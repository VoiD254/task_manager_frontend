import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Fetch user profile from your backend API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        // const token = await AsyncStorage.getItem("jwtToken");
        // const response = await fetch('your-api-endpoint/user/profile', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const userData = await response.json();
        // setUserProfile({
        //   name: userData.profile.name,
        //   email: userData.profile.email,
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

  const handleEditName = () => {
    setEditName(userProfile.name);
    setShowEditModal(true);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (editName.length > 50) {
      Alert.alert("Error", "Name cannot be longer than 50 characters");
      return;
    }

    try {
      setSaving(true);
      
      // Replace with your actual API endpoint
      // const token = await AsyncStorage.getItem("jwtToken");
      // const response = await fetch('your-api-endpoint/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ name: editName }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update profile');
      // }
      
      // const data = await response.json();
      // setUserProfile({
      //   ...userProfile,
      //   name: data.profile.name,
      // });

      // Temporary - remove when connecting to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserProfile({
        ...userProfile,
        name: editName,
      });

      setShowEditModal(false);
      Alert.alert("Success", "Name updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update name. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
            // const token = await AsyncStorage.getItem("jwtToken");
            // await fetch('your-api-endpoint/auth/logout', {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${token}`
            //   }
            // });
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
            <View style={profileStyles.nameRow}>
              <Text style={profileStyles.userName}>
                {loading ? "Loading..." : userProfile.name}
              </Text>
              {!loading && (
                <TouchableOpacity
                  onPress={handleEditName}
                  style={profileStyles.editButton}
                >
                  <Text style={profileStyles.editIcon}>✎</Text>
                </TouchableOpacity>
              )}
            </View>
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

      {/* Edit Name Modal */}
      <Modal visible={showEditModal} transparent={true} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            if (!saving) {
              setShowEditModal(false);
            }
          }}
        >
          <View style={profileStyles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={profileStyles.modal}>
                <Text style={profileStyles.modalTitle}>Edit Name</Text>

                <TextInput
                  style={profileStyles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  value={editName}
                  onChangeText={setEditName}
                  maxLength={50}
                  editable={!saving}
                />

                <View style={profileStyles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setShowEditModal(false)}
                    style={[profileStyles.button, profileStyles.cancelButton]}
                    disabled={saving}
                  >
                    <Text style={profileStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveName}
                    style={[profileStyles.button, profileStyles.saveButton]}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={profileStyles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#eeecec",
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3a3a3a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#666",
  },
  editIcon: {
    fontSize: 16,
    color: "#3B82F6",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#323232",
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#666",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#eeecec",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#666",
    color: "#eeecec",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#666",
  },
  cancelButtonText: {
    color: "#eeecec",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
};