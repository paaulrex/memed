# Final Project For SWE-861 - Software Construction

## Adulting Game App
This is the name that I used for SWE-861 Final Project, if this game gets deployed to iOS/Android devices through their respective app stores, the name for the app is as follows:

## M.E.M.E.D. - Minimal Effort, Maximum Existential Dread

M.E.M.E.D. is a mobile game that humorously gamifies real-life millennial struggles, making everyday tasks engaging and fun. It provides an interactive experience where players complete adulting challenges, earn XP, and encounter random life events.

## Project Overview

**Category:** Mobile Application / Simple Game  
**Platform:** iOS & Android (Developed using React Native with Expo)  

## Features

- **Daily & Recurring Tasks:** Players complete realistic adulting tasks such as cooking, cleaning, and paying bills.
- **XP & Level System:** Earn XP for completing tasks and progress through different adulting levels.
- **Energy Management:** Tasks consume energy, and players must balance their resources.
- **Random Life Events:** Unpredictable scenarios that impact time, energy, and XP.
- **Offline-First Experience:** Uses AsyncStorage for local game progress.
- **90s-Themed UI:** Nostalgic design inspired by the aesthetics of the 90s.

## Project Requirements & Success Criteria

- **Core Features Implemented:** 
  - Task completion and persistence
  - XP progression and leveling system
  - Random life events with probability-based triggers
  - Energy and time management
  - End day system for task refresh cycles
- **Performance Considerations:** 
  - Lightweight assets for smooth gameplay
  - Optimization for both iOS and Android
- **Scalability & Maintainability:**
  - Component-based architecture for easy updates
  - Clear separation of concerns for logic and UI

## Tech Stack

| Category          | Technology Used |
|------------------|----------------|
| **Framework**    | React Native (Expo) |
| **State Management** | Zustand |
| **Storage**      | AsyncStorage |
| **UI Library**   | React Native Paper |

## Architecture

The application follows a modular design:

- **Components:** Reusable UI components for tasks, XP tracking, and progress bars.
- **State Management:** Zustand for game state persistence and logic handling.
- **Storage:** AsyncStorage for offline support and local data saving.
- **Navigation:** Expo Router for seamless screen transitions.
- **Game Flow:** Tasks → XP Gain → Random Events → End Day → Repeat

## Future Enhancements

- **More Life Events:** Expand the random event list for increased replayability.
- **Achievements & Unlockables:** Add milestone-based rewards.
- **Career Paths & Financial Planning:** Introduce budgeting and career progression elements.
- **Multiplayer Mode:** Competitive leaderboards and social interactions.

## Getting Started

### Prerequisites
- Node.js installed
- Expo CLI installed (`npm install -g expo-cli`)

### Installation & Running the App
```sh
# Clone the repository
git clone https://github.com/paaulrex/memed.git
cd memed

# Install dependencies
npm install

# Start the project
npx expo start
```

## 📜 License

This project is licensed under the MIT License.

---

_M.E.M.E.D. - Because adulting should at least be fun! 🎮_
