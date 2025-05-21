import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName (optional)
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      console.log('User signed up:', userCredential.user.email);
      router.replace('/home'); // redirect after signup
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <Button title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});