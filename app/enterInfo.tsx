import { useState } from "react";
import { View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EnterInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const saveUserInfo = async () => {
    if (!name.trim() || !birthYear.trim()) return;

    const currentYear = new Date().getFullYear();
    const userAge = currentYear - parseInt(birthYear, 10);
    
    await AsyncStorage.setItem("userName", name);
    await AsyncStorage.setItem("userBirthYear", birthYear);
    await AsyncStorage.setItem("userAge", userAge.toString());

    router.replace("/");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 22, marginBottom: 15 }}>Welcome to M.E.M.E.D.</Text>
      <Text style={{ color: "#bbb", fontSize: 16, textAlign: "center", marginBottom: 10 }}>
        Before you start, tell us a bit about yourself.
      </Text>

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        style={{ width: "100%", padding: 10, backgroundColor: "#222", color: "white", marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Enter your birth year (e.g., 1996)"
        placeholderTextColor="#888"
        value={birthYear}
        onChangeText={setBirthYear}
        keyboardType="numeric"
        maxLength={4}
        style={{ width: "100%", padding: 10, backgroundColor: "#222", color: "white", marginBottom: 10, borderRadius: 5 }}
      />

      <Button mode="contained" onPress={saveUserInfo} style={{ marginTop: 10 }}>
        Continue
      </Button>
    </KeyboardAvoidingView>
  );
}
