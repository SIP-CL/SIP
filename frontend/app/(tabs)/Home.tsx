import { SafeAreaView, Text, ScrollView, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import TrendingSection from "../feedComponents/TrendingSection";
import styles from "../feedComponents/styles";
import CafeCollection from "../feedComponents/CafeCollection";
import TopCafes from "../feedComponents/TopCafes";
import Feather from "@expo/vector-icons/Feather";
import SearchBar from "../feedComponents/search";
import ReviewScreen from "../reviewComponents/review";
type Cafe = {
  _id: string;
  name: string;
  address: string;
  rating: number;
  numReviews: number;
  drinkCategories?: string[];
};

export default function HomeScreen() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedDrink, setSelectedDrink] = useState("Coffee");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCafeID, setSelectedCafeID] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/cafes/getAll")
      .then((res) => res.json())
      .then((data) => setCafes(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const trendingCafes = useMemo(() => {
    return cafes
      .filter((c) => c.numReviews >= 200 && c.rating >= 4.0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }, [cafes]);

  const coffeeCafes = cafes
  .filter((c) =>
    c.drinkCategories?.includes("Coffee") &&
    c.numReviews >= 200 &&
    c.rating >= 4.0
  )
  .sort(() => Math.random() - 0.5)
  .slice(0, 5);

const matchaCafes = cafes
  .filter((c) =>
    c.drinkCategories?.includes("Matcha") &&
    c.numReviews >= 200 &&
    c.rating >= 4.0
  )
  .sort(() => Math.random() - 0.5)
  .slice(0, 5);

const teaCafes = cafes
  .filter((c) =>
    c.drinkCategories?.includes("Tea") &&
    c.numReviews >= 200 &&
    c.rating >= 4.0
  )
  .sort(() => Math.random() - 0.5)
  .slice(0, 5);

  const drinkTabs = ["Coffee", "Matcha", "Tea"];

  const getCafesForDrink = (drink: string) => {
    switch (drink) {
      case "Coffee":
        return coffeeCafes;
      case "Matcha":
        return matchaCafes;
      case "Tea":
        return teaCafes;
      default:
        return [];
    }
  };

  if (selectedCafeID) {
    return (
      <ReviewScreen
        cafeID={selectedCafeID}
        goBack={() => setSelectedCafeID(null)}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Welcome</Text>
          <Feather name="bell" size={20} color="black" />
        </View>

        <SearchBar query={searchQuery} setQuery={setSearchQuery} />

        <View style={styles.divider} />

        <TrendingSection cafes={trendingCafes} onCafeSelect={setSelectedCafeID} />

        <CafeCollection />

        <Text style={styles.sectionHeader}>Top Cafes by Drinks</Text>
        <View style={styles.tabHeader}>
          {drinkTabs.map((drink) => (
            <TouchableOpacity
              key={drink}
              style={[
                styles.tab,
                selectedDrink === drink && {
                  borderBottomColor: "black",
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setSelectedDrink(drink)}
            >
              <Text
                style={{
                  fontWeight: selectedDrink === drink ? "bold" : "normal",
                }}
              >
                {drink}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TopCafes
          cafes={getCafesForDrink(selectedDrink)}
          onCafeSelect={setSelectedCafeID}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
