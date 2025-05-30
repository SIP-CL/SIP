// import { useState } from 'react';
// import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
// import { auth } from '../../firebase/firebaseConfig';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { useRouter } from 'expo-router';

// export default function SignupScreen() {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const router = useRouter();

//   const handleSignup = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Set displayName (optional)
//       await updateProfile(userCredential.user, {
//         displayName: username,
//       });

//       console.log('User signed up:', userCredential.user.email);
//       router.replace('/home'); // redirect after signup
//     } catch (error: any) {
//       setErrorMsg(error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//       />
//       {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
//       <Button title="Sign Up" onPress={handleSignup} />

//       <TouchableOpacity onPress={() => router.back()}>
//         <Text style={styles.link}>Already have an account? Log in</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 30,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 16,
//     padding: 8,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   link: {
//     marginTop: 16,
//     color: 'blue',
//     textAlign: 'center',
//   },
// });

import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      console.log("User signed up:", userCredential.user.email);
      router.replace("/feed");
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Enter your credentials and create your account!
      </Text>

      <TextInput
        placeholder="name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Text style={styles.terms}>
        By continuing, you agree to our{" "}
        <Text style={styles.linkText}>Terms of Service</Text> and{" "}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>Or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Ionicons name="logo-google" size={18} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Get Started With Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./login")}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={styles.loginText}>Log in.</Text>
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
  terms: {
    fontSize: 12,
    color: "#444",
    marginBottom: 20,
  },
  linkText: {
    color: "#3C751E",
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
  error: {
    color: "red",
    marginBottom: 10,
  },
});
