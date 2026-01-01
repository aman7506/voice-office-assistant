import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Card, Button, FAB, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Import services
import { getCalendarEvents, createCalendarEvent, getCalendarAuthStatus } from '../services/apiService';

const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    location: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [localEvents, setLocalEvents] = useState({}); // { 'YYYY-MM-DD': [event, ...] }

  useEffect(() => {
    checkAuthAndLoadEvents();
  }, []);

  const checkAuthAndLoadEvents = async () => {
    try {
      setLoading(true);
      
      // Check calendar authentication
      const authResponse = await getCalendarAuthStatus();
      setAuthenticated(authResponse.authenticated);

      if (authResponse.authenticated) {
        await loadEvents();
      }
    } catch (error) {
      console.error('Error checking calendar auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await getCalendarEvents();
      setEvents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      Alert.alert('Error', 'Failed to load calendar events');
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (newEvent.end <= newEvent.start) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    try {
      const eventData = {
        summary: newEvent.title.trim(),
        description: newEvent.description.trim(),
        startTime: newEvent.start.toISOString(),
        endTime: newEvent.end.toISOString(),
        attendees: [], // Add attendee emails if needed
      };

      await createCalendarEvent(eventData);
      setModalVisible(false);
      setNewEvent({
        title: '',
        description: '',
        start: new Date(),
        end: new Date(Date.now() + 60 * 60 * 1000),
        location: ''
      });
      await loadEvents();
      Alert.alert('Success', 'Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event');
    }
  };

  const handleConnectCalendar = () => {
    Alert.alert(
      'Connect Calendar',
      'Calendar integration will be implemented in the next version. For now, you can use voice commands to schedule meetings.',
      [{ text: 'OK' }]
    );
  };

  const renderEvent = (event) => (
    <Card key={event.id} style={styles.eventCard}>
      <Card.Content>
        <Text style={styles.eventTitle}>{event.summary}</Text>
        {event.description && (
          <Text style={styles.eventDescription}>{event.description}</Text>
        )}
        <View style={styles.eventTime}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.eventTimeText}>
            {new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}
          </Text>
          <Text style={styles.eventLocation}>{event.location || ''}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Add event for selected date (local calendar)
  const handleAddLocalEvent = (event) => {
    setLocalEvents((prev) => {
      const dateKey = selectedDate;
      const eventsForDate = prev[dateKey] || [];
      return { ...prev, [dateKey]: [...eventsForDate, event] };
    });
  };

  // Render events for selected date (local calendar)
  const renderLocalEvents = () => {
    const eventsForDate = localEvents[selectedDate] || [];
    if (eventsForDate.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#9E9E9E" />
          <Text style={styles.emptyText}>No events for this day</Text>
        </View>
      );
    }
    return eventsForDate.map((event, idx) => (
      <Card key={idx} style={styles.eventCard}>
        <Card.Content>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.description ? <Text style={styles.eventDescription}>{event.description}</Text> : null}
          <Text style={styles.eventTimeText}>{event.time}</Text>
        </Card.Content>
      </Card>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.eventCount}>
          {events.length} upcoming events
        </Text>
      </View>
      {/* Local Calendar View */}
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#007AFF' },
          ...Object.keys(localEvents).reduce((acc, date) => {
            acc[date] = acc[date] || {};
            acc[date].marked = true;
            return acc;
          }, {})
        }}
        style={{ margin: 10, borderRadius: 10 }}
      />
      <ScrollView style={styles.eventsContainer} contentContainerStyle={styles.eventsContent}>
        {renderLocalEvents()}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
      {/* Add Event Modal (local) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Event</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Event Title *"
                value={newEvent.title}
                onChangeText={text => setNewEvent({ ...newEvent, title: text })}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                value={newEvent.description}
                onChangeText={text => setNewEvent({ ...newEvent, description: text })}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.label}>Time (optional):</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 14:00 - 15:00"
                value={newEvent.time || ''}
                onChangeText={text => setNewEvent({ ...newEvent, time: text })}
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  if (!newEvent.title.trim()) {
                    Alert.alert('Error', 'Please enter an event title');
                    return;
                  }
                  handleAddLocalEvent({ ...newEvent });
                  setModalVisible(false);
                  setNewEvent({ title: '', description: '', time: '', location: '' });
                }}
                style={styles.modalButton}
              >
                Add Event
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  eventCount: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  eventsContainer: {
    flex: 1,
  },
  eventsContent: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  connectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  connectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  connectSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  connectButton: {
    borderRadius: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  eventCard: {
    marginBottom: 10,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTimeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default CalendarScreen; 