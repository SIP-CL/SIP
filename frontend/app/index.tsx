import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Log in Link */}
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      {/* Placeholder for logo/image */}
      <View style={styles.logoContainer}>
        {/* You can insert your Image or SVG component here */}
        <Image source={require("../assets/images/Sip_Logo_1.png")} />
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.readyButton}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.buttonText}>Ready to Sip?</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color="white"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </View>
  );
}

// Hide the header on this screen
export const screenOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  loginLink: {
    position: "absolute",
    top: 60,
    right: 24,
  },
  loginText: {
    color: "#3C751E",
    fontSize: 16,
    fontWeight: "500",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  readyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C751E",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 60,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
