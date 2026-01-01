import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { initializeSocket } from '../services/socketService';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserId = async () => {
  try {
    const storedId = await AsyncStorage.getItem('userId');
    return storedId || '1';
  } catch (error) {
    return '1';
  }
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('1');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    // Fetch userId dynamically
    getUserId().then(setUserId);
    
    // Initialize socket silently
    const initSocket = async () => {
      try {
        const socketInstance = await initializeSocket();
        setSocket(socketInstance);
      } catch (error) {
        // Silent fail - app works without socket
      }
    };
    initSocket();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/chat/history?userId=${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.conversations && data.conversations.length > 0) {
          setMessages(
            data.conversations
              .map(c => [
                { role: 'user', content: c.message, timestamp: c.timestamp },
                { role: 'assistant', content: c.response, timestamp: c.timestamp }
              ])
              .flat()
          );
        }
      })
      .catch(err => {
        // Silent fail for new users - this is normal
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    
    const onChatResponse = (data) => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message, timestamp: new Date().toISOString() }
      ]);
      scrollToEnd();
    };
    
    socket.on('chat-response', onChatResponse);
    return () => socket.off('chat-response', onChatResponse);
  }, [socket]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() }
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId,
          conversationHistory: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add assistant response if not handled by socket
      if (data.response) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }
        ]);
        scrollToEnd();
      }
    } catch (err) {
      // Show user-friendly error message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'I\'m here to help! What would you like to do today?', timestamp: new Date().toISOString() }
      ]);
      scrollToEnd();
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble
      ]}
    >
      <Text style={[
        styles.bubbleText,
        item.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText
      ]}>
        {item.content}
      </Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        onContentSizeChange={scrollToEnd}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading...' : '👋 Hello! I\'m your voice office assistant. How can I help you today?'}
            </Text>
            <Text style={styles.suggestionText}>
              Try saying: "Schedule a meeting" or "Set a reminder"
            </Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!isLoading}
        />
        <Button 
          title={isLoading ? "..." : "Send"} 
          onPress={handleSend}
          disabled={isLoading || !input.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0'
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end'
  },
  assistantBubble: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start'
  },
  bubbleText: {
    fontSize: 16
  },
  userBubbleText: {
    color: '#fff'
  },
  assistantBubbleText: {
    color: '#222'
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10
  },
  suggestionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

export default ChatScreen;
