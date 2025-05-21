import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ReviewForm from '../reviewComponents/ReviewForm';
import StarRating from '../reviewComponents/StarRating';

import { AntDesign } from '@expo/vector-icons'; // or any icon set you prefer


const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  for (let i = 0; i < intervals.length; i++) {
    const { label, seconds } = intervals[i];
    const intervalCount = Math.floor(diffInSeconds / seconds);
    if (intervalCount >= 1) {
      return `${intervalCount} ${label}${intervalCount > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

const ReviewScreen = ({ cafeID, goBack }: { cafeID: string, goBack: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [cafe, setCafe] = useState<any>(null);

  const fetchCafeInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cafes/getByID/${cafeID}`);
      const data = await response.json();
      console.log('Cafe data:', data);
      setCafe(data);
    } catch (error) {
      console.error('Error fetching cafe info:', error);
      Alert.alert('Error', 'There was a problem fetching cafe information.');
    }
  }

  useEffect(() => {
    fetchCafeInfo();
  }, []);
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/review/getAllbyCafe/${cafeID}`);
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'There was a problem fetching reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async (overall: number, wifi: number, noise: number, comments: string) => {
    const reviewData = {
      userID: 'user123',
      postID: 'post123',
      cafeID,
      caption: comments,
      rating: [overall, wifi, noise],
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:3000/review/postReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        Alert.alert('Thank you! Your review has been submitted.');
        fetchReviews();
      } else {
        Alert.alert('Error', 'There was a problem submitting your review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error submitting review.');
    } finally {
      setShowForm(false);
    }
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Pressable onPress={goBack} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#000" />
      </Pressable> */}

      {cafe && (
        <View style={styles.cafeInfo}>
          <View style={styles.cafeHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              { !showForm && (
                <Pressable onPress={goBack} style={{ marginRight: 8 }}>
                  <AntDesign name="arrowleft" size={24} color="#000" />
                </Pressable>
              )}
              <Text style={styles.cafeName}>{cafe.name}</Text> 
            </View>
          </View>
          <View style={styles.rating}>
            <StarRating rating={parseFloat(cafe.rating) || 0} size={20} readOnly />
          </View>
          <Text style={styles.cafeAddress}>{cafe.address}</Text>
        </View>
      )}

      {showForm ? (
        <ReviewForm onSubmit={submitReview} onCancel={() => setShowForm(false)} />
      ) : (
        <View style={{ width: '100%' }}>
          <Pressable onPress={() => setShowForm(true)} style={styles.button}>
            <Text style={styles.buttonText}>Leave a Review</Text>
          </Pressable>

          {loading ? (
            <ActivityIndicator />
          ) : (
            reviews
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((review, index) => {
                const isExpanded = expandedCards.has(index);
                const fullComment = review.caption;
                const shortComment = fullComment.split(' ').slice(0, 10).join(' ') + (fullComment.split(' ').length > 10 ? '...' : '');

                return (
                  <Pressable key={index} style={styles.reviewCard} onPress={() => toggleCard(index)}>
                    <View style={styles.headerRow}>
                      <Text style={styles.reviewUser}>{review.userID}</Text>
                      <StarRating rating={review.rating?.[0] || 0} size={20} readOnly />
                    </View>

                    <Text style={styles.reviewText}>
                      {isExpanded ? fullComment : shortComment}
                    </Text>

                    {isExpanded && (
                      <View style = {styles.expandedContent}>
                        <View style={styles.headerRow}>
                          <Text style={styles.reviewUser}>Wifi:</Text>
                          <StarRating rating={review.rating?.[1] || 0} size={20} readOnly />
                        </View>

                        <View style={styles.headerRow}>
                          <Text style={styles.reviewUser}>Noise Level:</Text>
                          <StarRating rating={review.rating?.[2] || 0} size={20} readOnly />
                        </View>

                        <Text style={styles.date}>{getRelativeTime(review.date)}</Text>
                    </View>
                    )}
                  </Pressable>
                );
              })
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewUser: {
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // or 'flex-start' if you want them tightly packed
    marginBottom: 6,
  },
  expandedContent: {
    paddingTop: 10, // 👈 increase this value as needed
  },
  cafeInfo: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  cafeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // or 'flex-start' if you prefer
    marginBottom: 4,
    
  },
  cafeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 8,
  },  
  cafeAddress: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    marginBottom: 4,
  },
  cafeDescription: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  rating: {
    alignItems: 'flex-start',
  }
});

export default ReviewScreen;