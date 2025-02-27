import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "./store/useGame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();
  const { inGameDate,
    initializeGameDate,
    progressDay,
    xp,
    level,
    addXP,
    resetXp,
    resetGame,
    getLevelTitle,
    resetTasks
    } = useGame();
  const [userName, setUserName] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  const [xpProgress, setXpProgress] = useState(0);

  useEffect(() => {
    initializeGameDate();
  }, []);

  useEffect(() => {
    const checkUserInfo = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      const storedBirthYear = await AsyncStorage.getItem("userBirthYear");

      if (!storedName || !storedBirthYear) {
        router.replace("/enterInfo");
      } else {
        setUserName(storedName);
        setUserAge(new Date().getFullYear() - parseInt(storedBirthYear, 10));
      }
      setLoading(false);
    };
    checkUserInfo();
  }, []);

  useEffect(() => {
    if (inGameDate) {
      const displayDate = new Date(inGameDate).toDateString();
      setFormattedDate(displayDate);
    }
  }, [inGameDate]);

  useEffect(() => {
    const xpRequired = level === 0 ? 1 : level <= 5 ? 50 : level <= 10 ? 75 : level <= 15 ? 100 : level <= 20 ? 125 : 150;
    setXpProgress(xp / xpRequired);
  }, [xp, level]);

  if (loading) return null;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#111", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>M.E.M.E.D.</Text>
      <Text style={{ color: "#bbb", fontSize: 16, marginTop: 10 }}>Minimal Effort, Maximum Existential Dread</Text>

      <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>📅 {formattedDate}</Text>

      {/* XP Progress Bar */}
      <View style={{ width: "80%", marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 18 }}>XP Progress</Text>
        <ProgressBar progress={xpProgress} color="#FFD700" style={{ height: 10, borderRadius: 5, backgroundColor: "#333" }} />
        <Text style={{ color: "white", textAlign: "center", marginTop: 5 }}>
          Level {level}: {getLevelTitle(level)}
        </Text>
      </View>

      <TouchableOpacity 
        onPress={() => router.push("/tasks")}
        style={{ marginTop: 20, backgroundColor: "#1e90ff", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Start Adulting</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={progressDay}
        style={{ marginTop: 20, backgroundColor: "#ff4500", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>End Day</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => addXP(10)}
        style={{ marginTop: 20, backgroundColor: "#228B22", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Gain 10 XP</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={resetXp}
        style={{ marginTop: 20, backgroundColor: "#ff0000", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Reset XP</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={resetTasks}
        style={{ marginTop: 20, backgroundColor: "#ff0000", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Reset Task List</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={resetGame}
        style={{ marginTop: 20, backgroundColor: "#ff0000", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Reset Game & User Info</Text>
      </TouchableOpacity>
    </View>
  );
}
