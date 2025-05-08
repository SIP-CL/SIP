// screens/CafeScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, Alert, Pressable, Text, StyleSheet } from 'react-native';
import ReviewForm from '../reviewComponents/ReviewForm';

export default function CafeScreen() {
  const [showForm, setShowForm] = useState(false);

  const submitReview = (overall: number, wifi: number, noise: number, comments: string) => {
    Alert.alert('Thank you!', `Rating: ${overall}, Wifi: ${wifi}, Noise: ${noise}, Review: ${comments}`);
    setShowForm(false); // Hide form again after submission
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showForm ? (
        <Pressable onPress={() => setShowForm(true)} style={styles.button}>
          <Text style={styles.buttonText}>Leave a Review</Text>
        </Pressable>
      ) : (
        <ReviewForm onSubmit={submitReview} onCancel = {() => setShowForm(false)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
