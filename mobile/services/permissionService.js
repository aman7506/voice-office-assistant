import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

// Request microphone permission (no expo-av)
export const requestMicrophonePermission = async () => {
  // For now, always return true since expo-av is removed
  if (Platform.OS === 'web') {
    console.log('Web platform - microphone permission not needed');
    return true;
  }
  // You can implement native permission logic here if needed
  return true;
};

// Request calendar permission
export const requestCalendarPermission = async () => {
  if (Platform.OS === 'web') {
    console.log('Web platform - calendar permission not needed');
    return true;
  }

  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Calendar Permission Required',
        'This app needs calendar access to manage your schedule.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => openSettings() }
        ]
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting calendar permission:', error);
    return false;
  }
};

// Request contacts permission
export const requestContactsPermission = async () => {
  if (Platform.OS === 'web') {
    console.log('Web platform - contacts permission not needed');
    return true;
  }

  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Contacts Permission Required',
        'This app needs contacts access to help with scheduling.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => openSettings() }
        ]
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting contacts permission:', error);
    return false;
  }
};

// Request location permission
export const requestLocationPermission = async () => {
  if (Platform.OS === 'web') {
    console.log('Web platform - location permission not needed');
    return true;
  }

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to provide location-based services.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => openSettings() }
        ]
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Check all required permissions (no notifications, no expo-av)
export const checkPermissions = async () => {
  if (Platform.OS === 'web') {
    console.log('Web platform - all permissions granted by default');
    return {
      microphone: true,
      calendar: true,
      contacts: true,
      location: true,
    };
  }

  try {
    const permissions = {
      microphone: true, // Always true since we removed expo-av
      calendar: false,
      contacts: false,
      location: false,
    };
    // Check calendar permission
    const calStatus = await Calendar.getCalendarPermissionsAsync();
    permissions.calendar = calStatus.status === 'granted';
    // Check contacts permission
    const contactsStatus = await Contacts.getPermissionsAsync();
    permissions.contacts = contactsStatus.status === 'granted';
    // Check location permission
    const locationStatus = await Location.getForegroundPermissionsAsync();
    permissions.location = locationStatus.status === 'granted';
    return permissions;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      microphone: true,
      calendar: false,
      contacts: false,
      location: false,
    };
  }
};

// Request all permissions (no notifications, no expo-av)
export const requestAllPermissions = async () => {
  if (Platform.OS === 'web') {
    console.log('Web platform - all permissions granted by default');
    return {
      microphone: true,
      calendar: true,
      contacts: true,
      location: true,
    };
  }

  try {
    const results = await Promise.allSettled([
      requestMicrophonePermission(),
      requestCalendarPermission(),
      requestContactsPermission(),
      requestLocationPermission(),
    ]);
    const permissions = {
      microphone: true,
      calendar: results[1].status === 'fulfilled' && results[1].value,
      contacts: results[2].status === 'fulfilled' && results[2].value,
      location: results[3].status === 'fulfilled' && results[3].value,
    };
    return permissions;
  } catch (error) {
    console.error('Error requesting all permissions:', error);
    return {
      microphone: true,
      calendar: false,
      contacts: false,
      location: false,
    };
  }
};

// Open device settings
export const openSettings = () => {
  if (Platform.OS === 'web') {
    console.log('Web platform - settings not applicable');
    return;
  }
  
  // This would typically use Linking.openSettings() or similar
  // For now, we'll just show an alert
  Alert.alert(
    'Open Settings',
    'Please go to your device settings and enable the required permissions for this app.',
    [{ text: 'OK' }]
  );
};

// Check if all critical permissions are granted
export const areCriticalPermissionsGranted = async () => {
  const permissions = await checkPermissions();
  // Microphone and notifications are critical for voice assistant
  return permissions.microphone;
};

// Get permission status for a specific permission (no notifications, no expo-av)
export const getPermissionStatus = async (permissionType) => {
  if (Platform.OS === 'web') {
    console.log('Web platform - all permissions granted by default');
    return 'granted';
  }

  try {
    switch (permissionType) {
      case 'microphone': {
        return 'granted';
      }
      case 'calendar': {
        const calStatus = await Calendar.getCalendarPermissionsAsync();
        return calStatus.status;
      }
      case 'contacts': {
        const contactsStatus = await Contacts.getPermissionsAsync();
        return contactsStatus.status;
      }
      case 'location': {
        const locationStatus = await Location.getForegroundPermissionsAsync();
        return locationStatus.status;
      }
      default:
        return 'unknown';
    }
  } catch (error) {
    console.error('Error getting permission status:', error);
    return 'unknown';
  }
};

export default {
  requestMicrophonePermission,
  requestCalendarPermission,
  requestContactsPermission,
  requestLocationPermission,
  checkPermissions,
  requestAllPermissions,
  areCriticalPermissionsGranted,
  getPermissionStatus,
}; 