import { Text, ScrollView, View } from "react-native";
import React, { useEffect, useState } from 'react';
import TrendingSection from '../feedComponents/TrendingSection';
import styles from '../feedComponents/styles';
import CafeCollection from '../feedComponents/CafeCollection';
import TopCafes from '../feedComponents/TopCafes';

type Cafe = {
  _id: string;
  name: string;
  address: string;
  rating: number;
  numReviews: number;
};

export default function FeedScreen() {
  const [cafes, setCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/cafes/getAll')
      .then(res => res.json())
      .then(data => setCafes(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const trendingCafes = cafes
    .filter(c => c.numReviews >= 200 && c.rating >= 4.0)
    .sort(() => Math.random() - 0.5);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome</Text>
      <View style={styles.searchBar}>
        <Text>🔍 What are you looking for?</Text>
      </View>
      <View style={styles.divider} />
      <TrendingSection cafes={trendingCafes} />
      <CafeCollection />
      <TopCafes cafes={cafes} />
    </ScrollView>
  );
}
