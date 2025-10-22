// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./hooks/AuthProvider";
import { ResetTokenProvider } from "./hooks/ResetTokenContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ResetTokenProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#323232ff" },
          }}
        >
          {/* Landing page */}
          <Stack.Screen name="index" />

          {/* Auth stack */}
          <Stack.Screen name="(auth)" />

          {/* Main app tabs */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ResetTokenProvider>
    </AuthProvider>
  );
}
