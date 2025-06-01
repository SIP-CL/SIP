import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../firebase/authContext";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#2e7d32" />
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/Jenny.png")}
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>{user?.displayName ?? "NoName"}</Text>
          <Text style={styles.username}>
            {user?.displayName?.toLowerCase().replace(/\s/g, "") ?? ""}
          </Text>
          <Text style={styles.email}>{user?.email ?? ""}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Options */}
      <TouchableOpacity style={styles.optionRow}>
        <Feather name="zap" size={20} color="#2e7d32" />
        <Text style={styles.optionText}>“Find your SIP” Quiz</Text>
        <Ionicons name="chevron-forward" size={20} color="#2e7d32" />
      </TouchableOpacity>

      <View style={styles.optionRow}>
        <Feather name="bell" size={20} color="#2e7d32" />
        <Text style={styles.optionText}>Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3C751E" }}
          thumbColor={notificationsEnabled ? "#FFFF" : "#FFFF"}
          ios_backgroundColor="#3e3e3e"
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled((prev) => !prev)}
        />
      </View>

      <View style={styles.optionRow}>
        <Feather name="map-pin" size={20} color="#2e7d32" />
        <Text style={styles.optionText}>Location Tracker</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3C751E" }}
          thumbColor={locationEnabled ? "#FFFFFF" : "#FFFFFF"}
          ios_backgroundColor="#3e3e3e"
          value={locationEnabled}
          onValueChange={() => setLocationEnabled((prev) => !prev)}
        />
      </View>

      <TouchableOpacity style={styles.optionRow}>
        <Feather name="percent" size={20} color="#2e7d32" />
        <Text style={styles.optionText}>Sales and Promos</Text>
        <Ionicons name="chevron-forward" size={20} color="#2e7d32" />
      </TouchableOpacity>

      {/* Sign Out */}
      <TouchableOpacity
        style={styles.signOutRow}
        onPress={async () => {
          try {
            await signOut(auth);
            router.replace("../../login");
          } catch (err) {
            console.error("error signing out:", err);
          }
        }}
      >
        <Ionicons name="close-circle-outline" size={20} color="red" />
        <Text style={styles.signOutText}>sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    marginLeft: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  username: {
    fontSize: 13,
    color: "#666",
  },
  email: {
    fontSize: 13,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },
  signOutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  signOutText: {
    color: "red",
    fontSize: 15,
    marginLeft: 6,
    fontWeight: "500",
  },
});
