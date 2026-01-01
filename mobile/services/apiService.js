import axios from 'axios';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conditionally import Voice only on native platforms
let Voice = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-community/voice').default;
  } catch (error) {
    console.log('Voice library not available');
  }
}

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Chat API functions
export const sendMessage = async (message, conversationHistory = []) => {
  try {
    const response = await api.post('/api/chat', {
      message,
      conversationHistory,
      userId: 1 // Default user ID
    });
    return response.data;
  } catch (error) {
    console.error('Send Message Error:', error);
    throw new Error('Failed to send message');
  }
};

export const getConversationHistory = async (userId = 1) => {
  try {
    const response = await api.get(`/api/chat/history?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get Conversation History Error:', error);
    return [];
  }
};

// Tasks API functions
export const getTasks = async () => {
  try {
    const response = await api.get('/api/tasks');
    return response.data.tasks || response.data;
  } catch (error) {
    console.error('Get Tasks Error:', error);
    throw new Error('Failed to fetch tasks');
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Create Task Error:', error);
    throw new Error('Failed to create task');
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Update Task Error:', error);
    throw new Error('Failed to update task');
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Task Error:', error);
    throw new Error('Failed to delete task');
  }
};

// Reminders API functions
export const getReminders = async () => {
  try {
    const response = await api.get('/api/reminders');
    return response.data.reminders || response.data;
  } catch (error) {
    console.error('Get Reminders Error:', error);
    throw new Error('Failed to fetch reminders');
  }
};

export const createReminder = async (reminderData) => {
  try {
    const response = await api.post('/api/reminders', reminderData);
    return response.data;
  } catch (error) {
    console.error('Create Reminder Error:', error);
    throw new Error('Failed to create reminder');
  }
};

export const updateReminder = async (id, reminderData) => {
  try {
    const response = await api.put(`/api/reminders/${id}`, reminderData);
    return response.data;
  } catch (error) {
    console.error('Update Reminder Error:', error);
    throw new Error('Failed to update reminder');
  }
};

export const deleteReminder = async (id) => {
  try {
    const response = await api.delete(`/api/reminders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Reminder Error:', error);
    throw new Error('Failed to delete reminder');
  }
};

export const triggerReminder = async (reminderId) => {
  try {
    const response = await api.post(`/api/reminders/${reminderId}/trigger`);
    return response.data;
  } catch (error) {
    console.error('Error triggering reminder:', error);
    throw error;
  }
};

// Add this function for dismissing reminders (set status to 'dismissed')
export const dismissReminder = async (reminderId) => {
  try {
    // The backend does not have a dedicated dismiss endpoint, so we update the reminder status
    const response = await api.put(`/api/reminders/${reminderId}`, { status: 'dismissed' });
    return response.data;
  } catch (error) {
    console.error('Error dismissing reminder:', error);
    throw error;
  }
};

// Calendar API functions
export const getCalendarEvents = async () => {
  try {
    const response = await api.get('/api/calendar/events');
    return response.data;
  } catch (error) {
    console.error('Get Calendar Events Error:', error);
    return [];
  }
};

export const createCalendarEvent = async (eventData) => {
  try {
    const response = await api.post('/api/calendar/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Create Calendar Event Error:', error);
    throw new Error('Failed to create calendar event');
  }
};

export const updateCalendarEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/api/calendar/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Update Calendar Event Error:', error);
    throw new Error('Failed to update calendar event');
  }
};

export const deleteCalendarEvent = async (id) => {
  try {
    const response = await api.delete(`/api/calendar/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete Calendar Event Error:', error);
    throw new Error('Failed to delete calendar event');
  }
};

export const getCalendarAuthStatus = async () => {
  try {
    const response = await api.get('/api/calendar/auth');
    return response.data;
  } catch (error) {
    console.error('Error checking calendar auth:', error);
    throw error;
  }
};

// Voice API functions
export const speechToText = async (audioData) => {
  try {
    const response = await api.post('/api/voice/speech-to-text', {
      audio: audioData
    });
    return response.data;
  } catch (error) {
    console.error('Speech to Text Error:', error);
    throw new Error('Failed to convert speech to text');
  }
};

export const textToSpeech = async (text) => {
  try {
    const response = await api.post('/api/voice/text-to-speech', {
      text
    });
    return response.data;
  } catch (error) {
    console.error('Text to Speech Error:', error);
    throw new Error('Failed to convert text to speech');
  }
};

// Voice recognition functions (for native platforms)
export const startVoiceRecognition = async () => {
  if (!Voice) {
    throw new Error('Voice recognition not available on this platform');
  }
  
  try {
    await Voice.start('en-US');
  } catch (error) {
    console.error('Start Voice Recognition Error:', error);
    throw new Error('Failed to start voice recognition');
  }
};

export const stopVoiceRecognition = async () => {
  if (!Voice) {
    return;
  }
  
  try {
    await Voice.stop();
  } catch (error) {
    console.error('Stop Voice Recognition Error:', error);
  }
};

export const cancelVoiceRecognition = async () => {
  if (!Voice) {
    return;
  }
  
  try {
    await Voice.cancel();
  } catch (error) {
    console.error('Cancel Voice Recognition Error:', error);
  }
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health Check Error:', error);
    return { status: 'error', message: 'Server unavailable' };
  }
};

export const initializeSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  // socket = io(API_BASE_URL, { // This line was removed as per the edit hint
  //   auth: { token },
  //   // ...other options
  // });
  // ...rest of your code
};

export default api;