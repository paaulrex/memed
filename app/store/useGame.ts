import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tasksData from "../data/tasks.json";
import randomEvents from "../data/randomEvents.json";
import { Alert } from "react-native";

interface GameState {
  energy: number;
  money: number;
  career: number;
  inGameDate: string;
  time: string;
  xp: number;
  level: number;
  completedTasks: Record<string, string>;
  addXP: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  deductTime: (minutes: number) => boolean;
  triggerRandomEvent: (taskId?: string, forceEndDayEvent?: boolean) => void;
  endDay: () => Promise<void>;
  initializeGameDate: () => Promise<void>;
  progressDay: () => Promise<void>;
  resetGame: () => Promise<void>;
  resetXp: () => Promise<void>;
  resetTasks: () => Promise<void>;
  getLevelTitle: (level: number) => string;
}

const levelThresholds = [
  { min: 0, max: 0, xpRequired: 1 },
  { min: 1, max: 5, xpRequired: 60 },
  { min: 6, max: 10, xpRequired: 90 },
  { min: 11, max: 15, xpRequired: 120 },
  { min: 16, max: 20, xpRequired: 150 },
  { min: 21, max: 25, xpRequired: 200 },
];

const taskResetDays: Record<string, number> = {
  daily: 1,
  threePerWeek: 2,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  biannually: 180,
  yearly: 365,
};

export const useGame = create<GameState>((set, get) => ({
  energy: 100,
  money: 5000,
  career: 0,
  inGameDate: "",
  time: "06:00 AM",
  xp: 0,
  level: 0,
  completedTasks: {},

  getLevelTitle: (level: number) => {
    if (level === 0) return "Not An Adult";
    if (level <= 5) return "Pre-Adult";
    if (level <= 10) return "Part-Time Adult";
    if (level <= 15) return "Almost an Adult";
    if (level <= 20) return "Adult";
    return "Fully-Fledged and Functioning Adult";
  },

  addXP: async (amount) => {
    set((state) => {
      let newXP = state.xp + amount;
      let newLevel = state.level;

      while (newLevel < 25) {
        const xpRequired =
          levelThresholds.find(
            (threshold) => newLevel >= threshold.min && newLevel <= threshold.max
          )?.xpRequired || 200;

        if (newXP >= xpRequired) {
          newXP -= xpRequired;
          newLevel++;
        } else {
          break;
        }
      }

      AsyncStorage.setItem("xp", JSON.stringify(newXP));
      AsyncStorage.setItem("level", JSON.stringify(newLevel));

      return { xp: newXP, level: newLevel };
    });
  },

  spendEnergy: (amount) => {
    const currentEnergy = get().energy;
    if (currentEnergy < amount) {
      alert("You're too exhausted! End the day or rest to regain energy.");
      return false;
    }

    const newEnergy = Math.max(currentEnergy - amount, 0);
    set({ energy: newEnergy });
    AsyncStorage.setItem("energy", JSON.stringify(newEnergy));
    return true;
  },

  initializeGameDate: async () => {
    const storedDate = await AsyncStorage.getItem("inGameDate");

    if (storedDate) {
      set({ inGameDate: storedDate });
    } else {
      const birthYear = await AsyncStorage.getItem("userBirthYear");
      if (birthYear) {
        const startYear = parseInt(birthYear, 10) + 21;
        const startDate = new Date(startYear, 0, 1).toISOString();

        set({ inGameDate: startDate });
        await AsyncStorage.setItem("inGameDate", startDate);
      }
    }
  },

  deductTime: (minutes) => {
    let currentTime = get().time || "06:00 AM";
    let timeMatch = currentTime.match(/(\d+):(\d+) (\w{2})/);

    if (!timeMatch) {
      console.error("Invalid time format:", currentTime);
      return false;
    }

    let [_, hour, minute, period] = timeMatch;
    let newHour = parseInt(hour, 10);
    let newMinute = parseInt(minute, 10);

    if (period === "PM" && newHour !== 12) newHour += 12;
    if (period === "AM" && newHour === 12) newHour = 0;

    let previousHour = newHour;
    newMinute += minutes;
    while (newMinute >= 60) {
      newMinute -= 60;
      newHour++;
    }

    if (previousHour < 24 && newHour >= 24) {
      setTimeout(() => {
        alert("You're burning the midnight oil! End the day before continuing.");
      }, 500);
      return false;
    }

    let newPeriod = newHour >= 12 ? "PM" : "AM";
    if (newHour > 12) newHour -= 12;
    if (newHour === 0) newHour = 12;

    const formattedTime = `${newHour}:${newMinute.toString().padStart(2, "0")} ${newPeriod}`;

    set({ time: formattedTime });
    AsyncStorage.setItem("time", formattedTime);

    return true;
  },

  triggerRandomEvent: (taskId?: string, forceEndDayEvent = false) => {
    // Filter events based on whether it's an end-day event or task-based trigger
    const filteredEvents = randomEvents.filter(event =>
        forceEndDayEvent ? ["12", "16"].includes(event.id) :
        event.triggerTaskIds.includes(taskId || "") || event.triggerTaskIds.includes("ALL")
    );

    if (filteredEvents.length === 0) return;

    // Apply probability check
    const possibleEvents = filteredEvents.filter(event => {
        const eventProbability = event.probability ?? 100;
        return Math.random() * 100 <= eventProbability;
    });

    if (possibleEvents.length === 0) return;

    // Randomly select an event from the filtered list
    const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

    Alert.alert("Random Event!", selectedEvent.text);

    // Function to handle array or single values
    const getEffectValue = (effect: number | number[]): number => 
        Array.isArray(effect) ? effect[Math.floor(Math.random() * effect.length)] : effect;

    if (selectedEvent.effect.time) get().deductTime(getEffectValue(selectedEvent.effect.time));
    if (selectedEvent.effect.energy) get().spendEnergy(Math.abs(getEffectValue(selectedEvent.effect.energy)));
    if (selectedEvent.effect.xp) get().addXP(getEffectValue(selectedEvent.effect.xp));
},


  endDay: async () => {
    const currentDateStr = get().inGameDate;
    if (!currentDateStr) return;

    // Progress in-game date by 1 day
    const currentDate = new Date(currentDateStr);
    currentDate.setDate(currentDate.getDate() + 1);
    const newDateString = currentDate.toISOString();

    set({ inGameDate: newDateString, time: "06:00 AM", energy: 100 });
    await AsyncStorage.setItem("inGameDate", newDateString);
    await AsyncStorage.setItem("time", "06:00 AM");
    await AsyncStorage.setItem("energy", JSON.stringify(100));

    // Load previously completed tasks from storage
    const storedCompletedTasks = await AsyncStorage.getItem("completedTasks");
    let completedTasksData: Record<string, string> = storedCompletedTasks ? JSON.parse(storedCompletedTasks) : {};

    const updatedCompletedTasks: Record<string, string> = { ...completedTasksData }; // Preserve existing data
    const now = new Date(newDateString);

    for (const task of tasksData) {
        const taskId = task.id;
        const lastCompletedStr = completedTasksData[taskId];

        if (lastCompletedStr) {
            const lastCompletedDate = new Date(lastCompletedStr);
            const diffDays = Math.floor((now.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));

            const taskCooldown = taskResetDays[task.frequency];

            if (taskCooldown !== undefined && diffDays >= taskCooldown) {
                delete updatedCompletedTasks[taskId];
            }
        }
    }

    // Save the updated completed tasks list
    set({ completedTasks: updatedCompletedTasks });
    await AsyncStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));

    // 🎲 5% Probability to Trigger an End-Day Random Event
    const randomChance = Math.random() * 100; // Generates a number between 0 and 100
    if (randomChance <= 3) {
        get().triggerRandomEvent(undefined, true);
    }
},

  progressDay: async () => {
    await get().endDay();
  },

  resetXp: async () => {
    await AsyncStorage.removeItem("xp");
    await AsyncStorage.removeItem("level");
    set({ xp: 0, level: 0 });
  },

  resetTasks: async () => {
    await AsyncStorage.removeItem("completedTasks");
    set({ completedTasks: {} });
  },

  resetGame: async () => {
    await AsyncStorage.clear();
    set({
      inGameDate: "",
      time: "06:00 AM",
      xp: 0,
      level: 0,
      energy: 100,
      completedTasks: {},
    });
  },
}));

export default useGame;
