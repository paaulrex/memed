import { Stack } from "expo-router";

export default function Layout() {
  return <Stack initialRouteName="loading" screenOptions={{ headerShown: false }} />;
}
