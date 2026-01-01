import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button, FAB, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getReminders, createReminder, updateReminder, deleteReminder } from '../services/apiService';

const RemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  
  // State for date and time pickers
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const loadReminders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReminders();
      setReminders(Array.isArray(response) ? response : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleOpenModal = (reminder = null) => {
    if (reminder) {
      setIsEditing(true);
      setCurrentReminder(reminder);
      setDate(new Date(reminder.scheduled_for));
    } else {
      setIsEditing(false);
      setCurrentReminder({ message: '' });
      setDate(new Date());
    }
    setModalVisible(true);
  };

  const handleSaveReminder = async () => {
    if (!currentReminder.message?.trim()) {
      Alert.alert('Error', 'Please enter a reminder message');
      return;
    }

    const reminderData = {
      ...currentReminder,
      scheduled_for: date.toISOString(),
    };

    try {
      if (isEditing) {
        await updateReminder(reminderData.id, reminderData);
      } else {
        await createReminder(reminderData);
      }
      setModalVisible(false);
      loadReminders();
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} reminder`);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    Alert.alert('Delete Reminder', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReminder(reminderId);
            loadReminders();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete reminder');
          }
        },
      },
    ]);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const d = new Date(dateString);
    if (isNaN(d)) return 'Invalid Date';
    return d.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {reminders.map(reminder => (
          <Card key={reminder.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{reminder.message}</Text>
              <Text>Due: {formatDate(reminder.scheduled_for)}</Text>
              <View style={styles.actions}>
                <IconButton icon="pencil" onPress={() => handleOpenModal(reminder)} />
                <IconButton icon="delete" onPress={() => handleDeleteReminder(reminder.id)} />
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB style={styles.fab} icon="plus" onPress={() => handleOpenModal()} />

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Reminder' : 'Add Reminder'}</Text>
          <TextInput
            placeholder="Message"
            value={currentReminder?.message}
            onChangeText={(text) => setCurrentReminder({ ...currentReminder, message: text })}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
             <Text style={styles.dateText}>Due: {date.toLocaleString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
          )}

          {showTimePicker && (
            <DateTimePicker value={date} mode="time" display="default" onChange={onTimeChange} />
          )}

          <Button onPress={handleSaveReminder}>Save</Button>
          <Button onPress={() => setModalVisible(false)}>Cancel</Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    card: { marginVertical: 5 },
    title: { fontSize: 18, fontWeight: 'bold' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
    modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
    modalTitle: { fontSize: 24, marginBottom: 15 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    dateText: { fontSize: 18, padding: 10 }
});

export default RemindersScreen;