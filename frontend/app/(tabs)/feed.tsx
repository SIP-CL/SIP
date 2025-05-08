import { Text, ScrollView, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useMemo } from 'react';
import TrendingSection from '../feedComponents/TrendingSection';
import styles from '../feedComponents/styles';
import CafeCollection from '../feedComponents/CafeCollection';
import TopCafes from '../feedComponents/TopCafes';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import SearchBar from "../feedComponents/search";
type Cafe = {
  _id: string;
  name: string;
  address: string;
  rating: number;
  numReviews: number;
  drinkCategories?: string[];
};

export default function FeedScreen() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedDrink, setSelectedDrink] = useState("Coffee");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/cafes/getAll')
      .then(res => res.json())
      .then(data => setCafes(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const trendingCafes = useMemo(() => {
    return cafes
      .filter(c => c.numReviews >= 200 && c.rating >= 4.0)
      .sort(() => Math.random() - 0.5);
  }, [cafes]);

  const coffeeCafes = cafes
    .filter(c => c.drinkCategories?.includes("Coffee"))
    .sort((a, b) =>
      b.rating !== a.rating
        ? b.rating - a.rating
        : b.numReviews - a.numReviews
    );

  const matchaCafes = cafes
    .filter(c => c.drinkCategories?.includes("Matcha"))
    .sort((a, b) =>
      b.rating !== a.rating
        ? b.rating - a.rating
        : b.numReviews - a.numReviews
    );

  const teaCafes = cafes
    .filter(c => c.drinkCategories?.includes("Tea"))
    .sort((a, b) =>
      b.rating !== a.rating
        ? b.rating - a.rating
        : b.numReviews - a.numReviews
    );

  const drinkTabs = ["Coffee", "Matcha", "Tea"];

  const getCafesForDrink = (drink: string) => {
    switch (drink) {
      case "Coffee": return coffeeCafes;
      case "Matcha": return matchaCafes;
      case "Tea": return teaCafes;
      default: return [];
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Welcome</Text>
        <Feather name="bell" size={20} color="black" />
      </View>

      <SearchBar query={searchQuery} setQuery={setSearchQuery} />

      <View style={styles.divider} />
      <TrendingSection cafes={trendingCafes} />
      <CafeCollection />

      <Text style={styles.sectionHeader}>Top Cafes by Drinks</Text>
      <View style={styles.tabHeader}>
        {drinkTabs.map(drink => (
          <TouchableOpacity
            key={drink}
            style={[
              styles.tab,
              selectedDrink === drink && { borderBottomColor: 'black', borderBottomWidth: 2 }
            ]}
            onPress={() => setSelectedDrink(drink)}
          >
            <Text style={{ fontWeight: selectedDrink === drink ? 'bold' : 'normal' }}>
              {drink}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TopCafes
        category={selectedDrink}
        cafes={getCafesForDrink(selectedDrink)}
      />
    </ScrollView>
  );
}
