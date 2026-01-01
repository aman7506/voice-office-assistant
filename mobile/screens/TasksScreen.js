import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button, FAB, IconButton, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTasks, createTask, updateTask, deleteTask } from '../services/apiService';

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // State for date and time pickers
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(Array.isArray(response) ? response : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setIsEditing(true);
      setCurrentTask(task);
      setDate(new Date(task.due_date));
    } else {
      setIsEditing(false);
      setCurrentTask({ title: '', description: '', priority: 'medium' });
      setDate(new Date());
    }
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!currentTask.title?.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      ...currentTask,
      due_date: date.toISOString(),
    };

    try {
      if (isEditing) {
        await updateTask(taskData.id, taskData);
      } else {
        await createTask(taskData);
      }
      setModalVisible(false);
      loadTasks();
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} task`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(taskId);
            loadTasks();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    // Automatically open time picker after date is selected
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
      {/* Task List */}
      <ScrollView>
        {tasks.map(task => (
          <Card key={task.id} style={styles.taskCard}>
            <Card.Content>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text>{task.description}</Text>
              <Text>Due: {formatDate(task.due_date)}</Text>
              <View style={styles.actions}>
                <IconButton icon="pencil" onPress={() => handleOpenModal(task)} />
                <IconButton icon="delete" onPress={() => handleDeleteTask(task.id)} />
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB style={styles.fab} icon="plus" onPress={() => handleOpenModal()} />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Task' : 'Add Task'}</Text>
          <TextInput
            placeholder="Title"
            value={currentTask?.title}
            onChangeText={(text) => setCurrentTask({ ...currentTask, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={currentTask?.description}
            onChangeText={(text) => setCurrentTask({ ...currentTask, description: text })}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
             <Text style={styles.dateText}>Due: {date.toLocaleString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <Button onPress={handleSaveTask}>Save</Button>
          <Button onPress={() => setModalVisible(false)}>Cancel</Button>
        </View>
      </Modal>
    </View>
  );
};

// Add styles here...
const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    taskCard: { marginVertical: 5 },
    taskTitle: { fontSize: 18, fontWeight: 'bold' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
    modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
    modalTitle: { fontSize: 24, marginBottom: 15 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    dateText: { fontSize: 18, padding: 10 }
});

export default TasksScreen;