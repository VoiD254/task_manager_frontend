import { Link } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#323232ff"
      }}
    >
      <Link href="/(auth)/login" style={{
        color: "#ffff"
      }}>Login</Link>
      <Link href="/(tabs)/home" style={{
        color: "#ffff",
        marginTop: 10
      }}>Tasks</Link>
    </View>
  );
}
