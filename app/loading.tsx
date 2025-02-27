import { useEffect, useState } from "react";
import { View, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ProgressBar, Text } from "react-native-paper";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    const loadGame = async () => {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress(i / 100);
        Animated.timing(progressAnim, {
          toValue: i / 100,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }

      // Check if user info exists
      const storedName = await AsyncStorage.getItem("userName");
      if (!storedName) {
        router.replace("/enterInfo"); // Redirect to Name Input if first-time user
      } else {
        router.replace("/"); // Redirect to Home Page
      }
    };

    loadGame();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111", padding: 20 }}>
      {/* Animated Logo */}
      <LottieView
        source={require("../assets/anim/hand-anim.json")} // Ensure the file exists in /assets
        autoPlay
        loop
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />

      <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>Loading...</Text>
      
      {/* Progress Bar */}
      <Animated.View style={{ width: "80%", height: 10, borderRadius: 5, backgroundColor: "#333", overflow: "hidden" }}>
        <Animated.View
          style={{
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            height: "100%",
            backgroundColor: "#1e90ff",
            borderRadius: 5,
          }}
        />
      </Animated.View>
    </View>
  );
}
