import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReviewScreen from "../reviewComponents/Review"; // ensure this is correctly imported

export default function YourListScreen() {
  const [activeTab, setActiveTab] = useState("have tried");
  const [isFilterTabOpen, setIsFilterTabOpen] = useState(false);
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCafeID, setSelectedCafeID] = useState<string | null>(null);

  const fetchCafes = async () => {
    try {
      const response = await fetch("http://localhost:3000/cafes/getAll");
      const data = await response.json();
      setCafes(data || []);
    } catch (error) {
      console.error("Error fetching cafes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {!selectedCafeID && (
        <Text style={styles.header}>Your List</Text>
      )}
      {selectedCafeID ? (
        <ReviewScreen
          cafeID={selectedCafeID}
          goBack={() => setSelectedCafeID(null)}
        />
      ) : (
        <>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "have tried" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("have tried")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "have tried" && styles.activeTabText,
                ]}
              >
                have tried
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "want to try" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("want to try")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "want to try" && styles.activeTabText,
                ]}
              >
                want to try
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterIcon}
              onPress={() => setIsFilterTabOpen(!isFilterTabOpen)}
            >
              <Ionicons name="filter-outline" size={20} />
            </TouchableOpacity>
          </View>

          {isFilterTabOpen ? (
            <View style={styles.filterTab}>
              {/* Filter UI */}
              <Text style={styles.sectionTitle}>neighborhood</Text>
              <View style={styles.searchBox}>
                <TextInput
                  placeholder="search all neighborhoods ..."
                  placeholderTextColor="#555"
                  style={styles.input}
                />
              </View>
              <View style={styles.chipContainer}>
                {[
                  "Silverlake",
                  "Koreatown",
                  "Downtown LA",
                  "West Hollywood",
                  "Santa Monica",
                  "Echo Park",
                  "Sawtelle",
                  "Westwood",
                ].map((item, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>amenities</Text>
              <View style={styles.searchBox}>
                <TextInput
                  placeholder="search all amenities ..."
                  placeholderTextColor="#555"
                  style={styles.input}
                />
              </View>
              <View style={styles.chipContainer}>
                {[
                  "Outlets",
                  "Study Spot",
                  "Free Wifi",
                  "Late Night",
                  "Pastries",
                  "Comfy Seats",
                  "Pet-Friendly",
                  "Good Music",
                ].map((item, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footerRow}>
                <Text
                  style={styles.clearText}
                  onPress={() => {
                    console.log("cleared filters");
                  }}
                >
                  clear all
                </Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    console.log("apply filters");
                    setIsFilterTabOpen(false);
                  }}
                >
                  <Text style={styles.applyText}>apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Search Bar */}
              <View style={styles.searchBar}>
                <TextInput
                  placeholder="search within your list ..."
                  placeholderTextColor="#999"
                  style={styles.searchInput}
                />
              </View>

              {loading ? (
                <ActivityIndicator />
              ) : (
                cafes.map((cafe, i) => (
                  <TouchableOpacity
                    key={cafe._id || i}
                    onPress={() => setSelectedCafeID(cafe._id)}
                  >
                    <View style={styles.card}>
                      <View style={styles.cardRow}>
                        <Text style={styles.cardNumber}>{i + 1}.</Text>
                        <Image
                          source={require("../../assets/images/cafe.png")}
                          style={styles.cardImage}
                        />
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName}>{cafe.name}</Text>
                          <Text style={styles.cardLocation}>
                            {cafe.location || "$$ | Neighborhood"}
                          </Text>
                          <Text style={styles.cardRating}>
                            {activeTab === "have tried"
                              ? "Your overall rating:"
                              : "What others think:"}{" "}
                            <Text style={styles.star}>★</Text>{" "}
                            {parseFloat(cafe.ratings['overall']['rating'] || 0).toFixed(1)}/5
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.dropdownIcon}>
                        <Ionicons name="chevron-down" size={20} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 24,
    marginRight: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#e6f4ea",
    borderColor: "#3C751E",
  },
  tabText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
  },
  activeTabText: {
    color: "#3C751E",
    fontWeight: "bold",
  },
  filterIcon: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ccc",
  },
  searchBar: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 14,
    color: "#333",
  },
  card: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    position: "relative",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    marginTop: 6,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  cardRating: {
    fontSize: 13,
    marginBottom: 2,
  },
  star: {
    color: "#000",
    fontSize: 13,
  },
  dropdownIcon: {
    position: "absolute",
    bottom: 10,
    right: 12,
  },
  filterTab: {
    marginTop: 16,
    paddingBottom: 32,
    backgroundColor: "#f5fff5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  searchBox: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  input: {
    fontSize: 14,
    color: "#333",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    borderColor: "#3C751E",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: "#3C751E",
    fontWeight: "500",
    fontSize: 13,
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearText: {
    fontSize: 16,
  },
  applyButton: {
    borderWidth: 1,
    borderColor: "#3C751E",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  applyText: {
    color: "#3C751E",
    fontWeight: "bold",
  },
});
