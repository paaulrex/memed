import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, SectionList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "./store/useGame";
import tasksData from "./data/tasks.json";

export default function TaskScreen() {
  const { addXP, deductTime, time, spendEnergy, energy, inGameDate, triggerRandomEvent } = useGame();
  const [tasks, setTasks] = useState(tasksData);
  const [xpGained, setXpGained] = useState(0);
  const [timeAfterTask, setTimeAfterTask] = useState(time);
  const [showPopup, setShowPopup] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  // Reset Intervals for Different Task Frequencies
  const resetIntervals = {
    daily: 1,
    threePerWeek: 2,
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    biannually: 180,
    yearly: 365,
  };

  // Function to Refresh Task List Based on Frequency
  const refreshTaskList = async () => {
    const storedCompletedTasks = await AsyncStorage.getItem("completedTasks");
    let completedTasksData = storedCompletedTasks ? JSON.parse(storedCompletedTasks) : {};

    const currentDate = new Date(inGameDate);

    const updatedTasks = tasksData.map((task) => {
      const lastCompletedDate = completedTasksData[task.id];
      const resetDays = resetIntervals[task.frequency] || 9999;

      if (!lastCompletedDate) {
        return { ...task, completed: false };
      }

      const lastCompleted = new Date(lastCompletedDate);
      const daysSinceCompleted = Math.floor((currentDate.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));

      return { ...task, completed: daysSinceCompleted < resetDays };
    });

    setTasks(updatedTasks);
  };

  // Load and Refresh Tasks on Component Mount or In-Game Date Change
  useEffect(() => {
    refreshTaskList();
  }, [inGameDate]);

  // Animate XP Gain
  const animateXP = (xpAmount: number, newTime: string) => {
    setXpGained(xpAmount);
    setTimeAfterTask(newTime);
    setShowPopup(true);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        animatedValue.setValue(0);
        setShowPopup(false);
      }, 2000);
    });
  };

  // Mark Task as Completed
  const completeTask = async (id: string, xpAmount: number, duration: number, energyCost: number) => {
    if (energy < energyCost) {
      Alert.alert("Not Enough Energy", "You're too exhausted to complete this task. End the day or rest.");
      return;
    }

    const taskCanProceed = await deductTime(duration);
    const energySufficient = spendEnergy(energyCost);

    if (!taskCanProceed || !energySufficient) return;

    // Retrieve existing completed tasks from AsyncStorage
    const storedCompletedTasks = await AsyncStorage.getItem("completedTasks");
    let completedTasksData = storedCompletedTasks ? JSON.parse(storedCompletedTasks) : {};

    // Update the completion date for this task without overriding previous ones
    completedTasksData[id] = new Date(inGameDate).toISOString();

    // Save updated task completion data
    await AsyncStorage.setItem("completedTasks", JSON.stringify(completedTasksData));

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );

    if (Math.random() < 0.2) { 
      triggerRandomEvent();
    }

    setTasks(updatedTasks);
    addXP(xpAmount);

    const newTime = useGame.getState().time;
    animateXP(xpAmount, newTime);
  };

  // Group Tasks by Frequency
  const groupedTasks = [
    { title: "Daily Tasks", data: tasks.filter((task) => task.frequency === "daily") },
    { title: "Weekly Tasks", data: tasks.filter((task) => task.frequency === "weekly") },
    { title: "Biweekly Tasks", data: tasks.filter((task) => task.frequency === "biweekly") },
    { title: "Monthly Tasks", data: tasks.filter((task) => task.frequency === "monthly") },
    { title: "Biannually Tasks", data: tasks.filter((task) => task.frequency === "biannually") },
    { title: "Yearly Tasks", data: tasks.filter((task) => task.frequency === "yearly") },
  ].filter((section) => section.data.length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222", padding: 20 }}>
      {/* Current In-Game Time and Energy Display */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ color: "#ffcc00", fontSize: 18 }}>🕒 Time: {time}</Text>
        <Text style={{ color: "#ff4500", fontSize: 18 }}>🔋 Energy: {energy}</Text>
      </View>

      {/* XP & Time Pop-Up */}
      {showPopup && (
        <View
          style={{
            position: "absolute",
            top: screenHeight / 2 - 50,
            left: screenWidth / 2 - 100,
            zIndex: 999,
            elevation: 10,
            backgroundColor: "#28a745",
            padding: 15,
            borderRadius: 10,
            width: 220,
            alignItems: "center",
          }}
        >
          <Animated.Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
              transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
            }}
          >
            +{xpGained} XP Earned! {"\n"}🕒 {timeAfterTask}
          </Animated.Text>
        </View>
      )}

      {/* Task List Grouped by Frequency */}
      <SectionList
        sections={groupedTasks}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ color: "#ffcc00", fontSize: 20, marginVertical: 10 }}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 5,
              paddingLeft: 20,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: item.completed ? "#444" : "#1e90ff",
            }}
            onPress={() => completeTask(item.id, item.xp, item.time, item.energy)}
            disabled={item.completed}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textDecorationLine: item.completed ? "line-through" : "none",
              }}
            >
              {item.text}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                textDecorationLine: item.completed ? "line-through" : "none",
              }}>
                ⏳ -{item.time} min  🔋 {item.energy < 0 ? `+${Math.abs(item.energy)}` : `-${item.energy}`} Energy
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
