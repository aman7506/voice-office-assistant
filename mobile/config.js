import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator, local IP for real device, localhost for web
export const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:5000' // Android emulator
    : Platform.OS === 'web'
      ? 'http://localhost:5000' // Web
      : 'http://192.168.3.26:5000'); // Real device: replace with your computer's local IP
// For real device, update the IP above to your computer's IP on the same WiFi network. 