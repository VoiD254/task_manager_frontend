import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./hooks/AuthProvider";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunchedBefore");

        if (!hasLaunched) {
          await AsyncStorage.setItem("hasLaunchedBefore", "true");
          router.replace("/(auth)/signup");
          return;
        }

        // Existing user -> check auth
        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (err) {
        console.error("Error checking first launch:", err);
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [isAuthenticated, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
