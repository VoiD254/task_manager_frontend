// app/(tabs)/_layout.jsx
import { Stack } from "expo-router";
import { View } from "react-native";
import Footer from "../components/Footer";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Footer />
    </View>
  );
}
