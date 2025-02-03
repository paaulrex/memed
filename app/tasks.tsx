import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Pay your bills', completed: false },
    { id: '2', text: 'Meal prep instead of takeout', completed: false },
    { id: '3', text: 'Actually go to bed before midnight', completed: false },
  ]);


  // Load saved tasks when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    };
    loadTasks();
  }, []);

  // Save tasks when they are updated
  const completeTask = async (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#222', padding: 20 }}>
      <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Daily Adulting Tasks
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: item.completed ? '#444' : '#1e90ff'
            }}
            onPress={() => completeTask(item.id)}
            disabled={item.completed}
          >
            <Text style={{ color: 'white', fontSize: 18, textDecorationLine: item.completed ? 'line-through' : 'none' }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
