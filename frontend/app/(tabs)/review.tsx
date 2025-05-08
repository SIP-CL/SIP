// screens/CafeScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, Alert, Pressable, Text, StyleSheet } from 'react-native';
import ReviewForm from '../reviewComponents/ReviewForm';

export default function CafeScreen() {
  const [showForm, setShowForm] = useState(false);

  const submitReview = async (overall: number, wifi: number, noise: number, comments: string) => {
    const reviewData = {
      userID: 'user123', // Replace with actual user ID
      postID: 'post123', // Replace with actual post ID
      cafeID: 'cafe123', // Replace with actual cafe ID
      caption: comments,
      rating: [
        overall, wifi, noise
      ],
      date: new Date().toISOString(),
    };

    console.log('Review Data:', reviewData);
    console.log(JSON.stringify(reviewData));

    try {
      const response  = await fetch('http://localhost:3000/review/postReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        Alert.alert('Thank you! Your review has been submitted.');
      } else {
        Alert.alert('Error', 'There was a problem submitting your review. Please try again.');
      }
    } catch(error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'There was a problem submitting your review. Please try again.');
    } finally {
      setShowForm(false); // Hide form after submission
    }
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
