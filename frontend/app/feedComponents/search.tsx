import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import Labels from "../reviewComponents/Labels";

type Cafe = {
  _id: string;
  name: string;
  address: string;
  ratings: {
    overall: {
      count: number;
      rating: number;
    };
  };
};

type Props = {
  goBack: () => void;
  onCafeSelect: (id: string) => void;
};

export default function SearchScreen({ goBack, onCafeSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Cafe[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const availableFilters = [
    "Study Spot",
    "Pastries",
    "Late-night",
    "Comfy Seats",
    "Pet Friendly",
    "Good Music",
    "Outlets",
    "Free Wifi",
    "Group Friendly",
    "Good Service",
    "Natural Light",
  ];

  const toggleFilter = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/cafes/search?name=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={goBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Search</Text>
        </View>

        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={20}
            color="#555"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Search for a cafe..."
            placeholderTextColor="#777"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <View style={styles.filterContainer}>
            {availableFilters.map((label) => (
              <Labels
                key={label}
                label={label}
                selected={selectedFilters.includes(label)}
                onPress={toggleFilter}
                color="#3C751E"
              />
            ))}
          </View>
        </View>

        {query.length >= 2 && results.length === 0 && (
          <Text style={styles.noResultsText}>No results found.</Text>
        )}

        {results.map((cafe) => (
          <TouchableOpacity
            key={cafe._id}
            onPress={() => onCafeSelect(cafe._id)}
            style={styles.resultItem}
          >
            <Text style={styles.resultName}>{cafe.name}</Text>
            <Text style={styles.resultDetails}>{cafe.address}</Text>
            <View style={styles.ratingRow}>
              <Entypo
                name="star-outlined"
                size={15}
                color="black"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.resultDetails}>
                {cafe.ratings?.overall?.rating.toFixed(1) ?? "N/A"} (
                {cafe.ratings?.overall?.count ?? 0})
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    marginHorizontal: 16,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  noResultsText: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },

  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  resultDetails: {
    color: "#555",
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});
