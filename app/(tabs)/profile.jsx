import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./home";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "john",
    email: "john@gmail.com",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from your backend API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        // const response = await fetch('your-api-endpoint/user/profile');
        // const userData = await response.json();
        // setUserProfile({
        //   name: userData.name,
        //   email: userData.email,
        //   avatar: userData.avatar,
        // });

        // Temporary placeholder - remove when connecting to API
        setTimeout(() => {
          setUserProfile({
            name: "John Doe",
            email: "john@gmail.com",
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            // Remove JWT from storage
            // await AsyncStorage.removeItem("jwtToken");

            // Redirect to login
            router.replace("/login");
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#323232" />
      {/* Main Content */}
      <View style={profileStyles.main}>
        {/* User Info Section */}
        <View style={profileStyles.userSection}>
          <View style={profileStyles.avatar}>
            <Text style={profileStyles.avatarText}>
              {loading
                ? "..."
                : userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
            </Text>
          </View>
          <View style={profileStyles.userInfo}>
            <Text style={profileStyles.userName}>
              {loading ? "Loading..." : userProfile.name}
            </Text>
            <Text style={profileStyles.userEmail}>
              {loading ? "Loading..." : userProfile.email}
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={profileStyles.settingsSection}>
          <View style={profileStyles.settingsGroup}>
            <View style={profileStyles.settingItem}>
              <Text style={profileStyles.settingLabel}>
                Dark Mode{" "}
                <Text style={{ fontSize: 10, color: "#646363ff" }}>
                  (toggle coming soon)
                </Text>
              </Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#666", true: "#3B82F6" }}
                thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
                ios_backgroundColor="#666"
              />
            </View>

            <View
              style={[profileStyles.settingItem, profileStyles.settingItemLast]}
            >
              <Text style={profileStyles.settingLabel}>
                Notifications{" "}
                <Text style={{ fontSize: 10, color: "#646363ff" }}>
                  (coming soon)
                </Text>
              </Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#666", true: "#3B82F6" }}
                thumbColor={notifications ? "#ffffff" : "#f4f3f4"}
                ios_backgroundColor="#666"
              />
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <View style={profileStyles.logoutSection}>
          <TouchableOpacity
            style={profileStyles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={profileStyles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const profileStyles = {
  main: {
    flex: 1,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  userSection: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#eeecec",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#999",
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsGroup: {
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    color: "#eeecec",
    fontWeight: "500",
  },
  logoutSection: {
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.5)",
  },
  logoutButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "bold",
  },
};
