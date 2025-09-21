import { Link, usePathname } from "expo-router"; // using usePathname for active tab detection
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../(tabs)/home";

const Footer = () => {
  const pathname = usePathname(); // get current route path

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Link href="/(tabs)/home" asChild>
          <TouchableOpacity style={styles.footerItem}>
            <Text style={styles.homeIcon}>🏠</Text>
            <Text
              style={
                pathname === "/(tabs)/home"
                  ? styles.footerActiveText
                  : styles.footerInactiveText
              }
            >
              Home
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/profile" asChild>
          <TouchableOpacity style={styles.footerItem}>
            <Text style={styles.profileIcon}>👤</Text>
            <Text
              style={
                pathname === "/(tabs)/profile"
                  ? styles.footerActiveText
                  : styles.footerInactiveText
              }
            >
              Profile
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Footer;
