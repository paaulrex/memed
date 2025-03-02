import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "./store/useGame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();
  const { inGameDate, initializeGameDate, progressDay, xp, level, addXP, resetXp, resetGame, getLevelTitle, resetTasks, triggerRandomEvent } = useGame();
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
    <ImageBackground source={require("../assets/images/background.png")} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>M.E.M.E.D</Text>
        <Text style={styles.subtitle}>Minimal Effort, Maximum Existential Dread</Text>

        <Text style={styles.dateText}>📅 {formattedDate}</Text>

        {/* XP Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>XP Progress</Text>
          <ProgressBar progress={xpProgress} color="#FFD700" style={styles.progressBar} />
          <Text style={styles.levelText}>Level {level}: {getLevelTitle(level)}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/tasks")} style={styles.buttonBlue}>
          <Text style={styles.buttonText}>Start Adulting</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={progressDay} style={styles.buttonRed}>
          <Text style={styles.buttonText}>End Day</Text>
        </TouchableOpacity>

        <View style={styles.devContainer}>
          <Text style={styles.divider}>----- DEV MODE -----</Text>

          <TouchableOpacity onPress={() => addXP(10)} style={styles.buttonGreen}>
            <Text style={styles.buttonText}>Gain 10 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetXp} style={styles.buttonDarkRed}>
            <Text style={styles.buttonText}>Reset XP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => triggerRandomEvent()}
            style={{ marginTop: 20, backgroundColor: "#ffcc00", padding: 10, borderRadius: 8 }}
          >
            <Text style={{ color: "black", fontSize: 18 }}>Trigger Random Event (Debug)</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={resetTasks} style={styles.buttonDarkRed}>
            <Text style={styles.buttonText}>Reset Task List</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetGame} style={styles.buttonDarkRed}>
            <Text style={styles.buttonText}>Reset Game & User Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Transparent black overlay
    borderRadius: 10,
    padding: 20,
    marginVertical: 30,
  },
  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
  },
  divider: {
    color: "#000",
    fontWeight:"bold",
    fontSize: 24,
    marginTop: 20,
    marginHorizontal: "auto",
    textAlign: "center",
    backgroundColor: "#fff"
  },
  dateText: {
    color: "white",
    fontSize: 28,
    marginTop: 20,
  },
  progressContainer: {
    width: "80%",
    marginTop: 20,
  },
  progressText: {
    color: "white",
    fontSize: 16,
    alignSelf: "center",
  },
  progressBar: {
    marginVertical: 5,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  devContainer: {
    flex: 0,
    marginHorizontal: "auto",
    justifyContent: "center",
  },
  levelText: {
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  buttonBlue: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
  },
  buttonRed: {
    marginTop: 20,
    backgroundColor: "#ff4500",
    padding: 10,
    borderRadius: 8,
  },
  buttonGreen: {
    marginTop: 20,
    backgroundColor: "#228B22",
    padding: 10,
    borderRadius: 8,
  },
  buttonYellow: {
    marginTop: 20,
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 8,
  },
  buttonDarkRed: {
    marginTop: 20,
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  buttonTextDark: {
    color: "black",
    fontSize: 18,
  },
});

