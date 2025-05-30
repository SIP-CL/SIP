import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Dummy data
const dummyCafes = [
  { name: "rok", location: "$$ | Koreatown", rating: 4.7 },
  { name: "Modu", location: "$$ | Highland Park", rating: 4.6 },
  { name: "Established Today", location: "$$ | West Hollywood", rating: 4.2 },
  { name: "Picnic Coffee", location: "$$$ | Silverlake", rating: 4.0 },
  { name: "Yeems Coffee", location: "$$ | Koreatown", rating: 4.3 },
  { name: "Maru Coffee", location: "$$ | Koreatown", rating: 4.1 },
];

export default function YourListScreen() {
  const [activeTab, setActiveTab] = useState("have tried");
  const [isFilterTabOpen, setIsFilterTabOpen] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your List</Text>

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

      {/* Conditional Content: either the list or the filter UI */}
      {isFilterTabOpen ? (
        // Filter UI (replaces the list)
        <View style={styles.filterTab}>
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
                // optionally reset selected filters
              }}
            >
              clear all
            </Text>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                console.log("apply filters");
                setIsFilterTabOpen(false); // close filter tab
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

          {/* Cafe Cards */}
          {dummyCafes.map((cafe, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardNumber}>{i + 1}.</Text>
                <Image
                  source={require("../../assets/images/cafe.png")}
                  style={styles.cardImage}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{cafe.name}</Text>
                  <Text style={styles.cardLocation}>{cafe.location}</Text>
                  <Text style={styles.cardRating}>
                    {activeTab === "have tried"
                      ? "Your overall rating:"
                      : "What others think:"}{" "}
                    <Text style={styles.star}>★</Text> {cafe.rating}/5
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.dropdownIcon}>
                <Ionicons name="chevron-down" size={20} />
              </TouchableOpacity>
            </View>
          ))}
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
  // Filter Tab Styles
  filterTab: {
    marginTop: 16,
    paddingBottom: 32,
    backgroundColor: "#f5fff5", // Visible background for testing
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
