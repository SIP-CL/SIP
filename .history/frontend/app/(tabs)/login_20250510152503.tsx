// LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

// The main login screen component
const LoginScreen = () => {
  // Local state to store input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fake backend check for login
  const handleLogin = () => {
    // Replace with real API logic
    if (username === 'test' && password === '1234') {
      setErrorMessage('');
      alert('Login successful!');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  // Fake backend check for signup
  const handleSignup = () => {
    if (username === 'test') {
      setErrorMessage('User already exists');
    } else {
      setErrorMessage('');
      alert('Account created!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Display error if there's one */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Login button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Create account link */}
      <TouchableOpacity onPress={handleSignup}>
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

// Basic styling for layout and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default LoginScreen;
