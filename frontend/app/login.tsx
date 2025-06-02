import { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "../firebase/authContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)/Feed");
    }
  }, [user, loading]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("logged in as:", userCredential.user.email);
      router.push("/(tabs)/Feed");
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Text style={styles.subtitle}>
        Enter your credentials and log into your account!
      </Text>

      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="#444"
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#444"
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity onPress={handleLogin} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>Or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Ionicons name="logo-google" size={18} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Continue With Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.loginLink}>
          Don’t have an account? <Text style={styles.loginText}>Sign up.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3C751E",
    marginBottom: 8,
  },
  subtitle: {
    color: "#444",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#3C751E",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#a5d6a7",
  },
  separatorText: {
    marginHorizontal: 12,
    color: "#3C751E",
    fontWeight: "500",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },
  loginText: {
    color: "#3C751E",
    fontWeight: "500",
  },
});
