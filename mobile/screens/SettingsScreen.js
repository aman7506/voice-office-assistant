import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { List, Divider, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    notificationsEnabled: true,
    autoSpeak: true,
    darkMode: false,
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Voice Settings</List.Subheader>
          <List.Item
            title="Voice Recognition"
            description="Enable voice input for commands"
            left={(props) => <List.Icon {...props} icon="microphone" />}
            right={() => (
              <Switch
                value={settings.voiceEnabled}
                onValueChange={(value) => handleSettingChange('voiceEnabled', value)}
              />
            )}
          />
          <List.Item
            title="Auto Speech"
            description="Automatically speak responses"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.autoSpeak}
                onValueChange={(value) => handleSettingChange('autoSpeak', value)}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </ScrollView>
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
  },
  content: {
    flex: 1,
  },
});

export default SettingsScreen; 