import { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "../firebase/authContext";
import styles1 from "./loginComponents/stylesLogin"; // shared styles

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/Feed");
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
      router.push("/feed"); // change to your actual route
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <View style={styles1.container}>
      <Text style={[styles1.header, { marginBottom: 12 }]}>Login</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Text style={{ color: "#666" }}>Haven’t joined? </Text>
        <Pressable onPress={() => router.push("/signup")}>
          <Text
            style={{
              color: "#000",
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            Sign up here
          </Text>
        </Pressable>
      </View>

      <View style={styles1.inputBox}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles1.inputText}
        />
      </View>

      <View style={styles1.inputBox}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles1.inputText}
        />
      </View>
      {errorMsg ? <Text style={styles1.error}>{errorMsg}</Text> : null}

      <TouchableOpacity onPress={handleLogin} style={styles1.loginButton}>
        <Text style={styles1.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
