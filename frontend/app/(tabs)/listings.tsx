import react, { useEffect, useState } from 'react';
import { SafeAreaView, View, ScrollView, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ReviewScreen from '../reviewComponents/review';
import StarRating from '../reviewComponents/StarRating';

import type { FC } from 'react';

const CafeScreen: FC = () => {
    const [cafes, setCafes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCafeID, setSelectedCafeID] = useState<string | null>(null);

    const fetchCafes = async () => {
        try {
            const response = await fetch('http://localhost:3000/cafes/getAll');
            const data = await response.json();
            setCafes(data || []);
        } catch (error) {
            console.error('Error fetching cafes:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCafes();
    }, []);

    if (selectedCafeID) {
        return <ReviewScreen cafeID={selectedCafeID} goBack={() => setSelectedCafeID(null)} />;
      }
      

    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}> 
            {loading ? (
                <ActivityIndicator />
            ) : (
                cafes.map((cafe, index) => (
                    <Pressable key={index} style={styles.card} onPress={() => setSelectedCafeID(cafe._id)}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cafeName}>{cafe.name}</Text>
                    </View>
                    <View style={styles.rating}>
                        <StarRating rating={parseFloat(cafe.rating) || 0} size={16} readOnly />
                    </View>
                    <Text style={styles.cafeAddress}>{cafe.address}</Text>
                  </Pressable>
                ))
            )}  
        </ScrollView>
      </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    card: {
      backgroundColor: '#eee',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      width: '100%',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    cafeName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    cafeAddress: {
      fontSize: 14,
      color: '#555',
      marginTop: 8,
    },
    rating: {
        alignItems: 'flex-start'
    }
  });
  
  export default CafeScreen;