/*
 simple task manager app
 chelsea wong
 chapter one tech screen fall 2024
*/
import React, { useState, useCallback } from 'react'; // importing react hooks
import { StyleSheet, View, FlatList, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native'; // import react native components
import { StatusBar } from 'expo-status-bar'; // status for mobile
import { useFonts } from 'expo-font'; // for custom fonts
import * as SplashScreen from 'expo-splash-screen'; // for splash screen (loading screen while fonts load)
import { Ionicons } from '@expo/vector-icons'; // for icons

SplashScreen.preventAutoHideAsync(); // prevents autohiding while loading fonts

export default function App() {
  // state variables
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  // load nice custom fonts
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  // font loading callback
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // functions
  const addTask = () => { // adding tasks
    if (taskText.trim() === '') {
      Alert.alert('error', 'task cannot be empty');
      return;
    }
    setTasks([...tasks, { id: Date.now().toString(), text: taskText, completed: false }]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => { // completing tasks
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => { // deleting tasks
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = hideCompleted ? tasks.filter(task => !task.completed) : tasks; // filtering tasks to be displayed

  const renderTask = ({ item }) => ( // rendering how each task item looks
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.checkboxContainer}>
        <Ionicons
          name={item.completed ? "checkbox-outline" : "square-outline"}
          size={20}
          color={item.completed ? "#4D596C" : "#000"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.taskTextContainer}>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return ( // main layout
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}> 
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.titleContainer} >
          <View style={styles.line} />
          <Text style={styles.title}>task manager</Text>
          <View style={styles.line} />
        </View>
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => setHideCompleted(!hideCompleted)} 
            style={styles.hideCompletedButton}
          >
            <Text style={styles.hideCompletedButtonText}>
              {hideCompleted ? "show completed" : "hide completed"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="add a new task"
            value={taskText}
            onChangeText={setTaskText}
          />
          <TouchableOpacity onPress={addTask} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// styles for components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D596C',
    fontFamily: 'Poppins-Regular',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#66748B',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#4D596C',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#f8b042',
    padding: 10,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginVertical: 2,
    marginHorizontal: 10,
    backgroundColor: '#ABB9CF',
    borderRadius: 8,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#4D596C',
  },
  deleteButton: {
    backgroundColor: '#ec6a52',
    padding: 6,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  hideCompletedButton: {
    backgroundColor: '#66748B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  hideCompletedButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});