import React, { useState } from "react";
import Ranking from "../../assets/images/Ranking.svg";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Dummy Top Rated cafes
const topRatedCafes = [
  { name: "1. Bonsai Coffee Bar", location: "$$ | Sawtelle", rating: "★★★★½" },
  { name: "2. Verve Coffee Roasters", location: "$$ | DTLA", rating: "★★★★★" },
  { name: "3. Alfred Coffee", location: "$ | Melrose", rating: "★★★★" },
  {
    name: "4. Cognoscenti Coffee",
    location: "$$ | Culver City",
    rating: "★★★★½",
  },
];

// CafeCard Component
const CafeCard = ({ name, location, rating, isSaved, onToggleSave }) => (
  <View style={styles.cardContainer}>
    <Image
      source={require("../../assets/images/cafe.png")}
      style={styles.cafeImage}
    />
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardLocation}>{location}</Text>
      <Text style={styles.cardRating}>{rating}</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity>
        <Ionicons name="remove-circle-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleSave}>
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={24}
          color={isSaved ? "#3C751E" : "#333"}
        />
      </TouchableOpacity>
    </View>
  </View>
);

// ProfileScreen Component
export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("Top Rated");
  const [savedCards, setSavedCards] = useState([false, false, false, false]);

  const toggleSave = (index) => {
    const newSaved = [...savedCards];
    newSaved[index] = !newSaved[index];
    setSavedCards(newSaved);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>Jenny</Text>
        <Image
          source={require("../../assets/images/Jenny.png")}
          style={styles.profileImage}
        />
        <Text style={styles.handle}>Sip@gmail.com</Text>
        <Text style={styles.bio}>
          someone who just loves the occassional matcha-study sesh.
        </Text>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="create-outline" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="logo-instagram" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="logo-tiktok" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sip Updates */}
      <View style={styles.sipUpdate}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderRadius: 10,
          }}
        >
          <View style={{ flex: 1, marginRight: 10, padding: 3 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 4 }}>
              <Text style={{ color: "#3C751E" }}>#15</Text> Places Ranked!
            </Text>
            <Text style={{ fontSize: 10, color: "#555555" }}>
              Keep ranking your future cafe visits!
            </Text>
          </View>
          <Ranking />
        </View>
      </View>

      {/* Dot Navigation */}
      <View style={styles.dotRow}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
        <View style={styles.inactiveDot} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => setActiveTab("Top Rated")}>
          <Text
            style={
              activeTab === "Top Rated" ? styles.activeTab : styles.inactiveTab
            }
          >
            Top Rated
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Saved")}>
          <Text
            style={
              activeTab === "Saved" ? styles.activeTab : styles.inactiveTab
            }
          >
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Activity")}>
          <Text
            style={
              activeTab === "Activity" ? styles.activeTab : styles.inactiveTab
            }
          >
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "Top Rated" &&
        topRatedCafes.map((cafe, i) => (
          <CafeCard
            key={i}
            name={cafe.name}
            location={cafe.location}
            rating={cafe.rating}
            isSaved={savedCards[i]}
            onToggleSave={() => toggleSave(i)}
          />
        ))}

      {/* {activeTab === "Saved" &&
        topRatedCafes
          .map((cafe, i) => ({ ...cafe, index: i }))
          .filter((_, i) => savedCards[i])
          .map((cafe) => (
            <CafeCard
              key={cafe.index}
              name={cafe.name}
              location={cafe.location}
              rating={cafe.rating}
              isSaved={true}
              onToggleSave={() => toggleSave(cafe.index)}
            />
          ))} */}

      {activeTab === "Saved" &&
        topRatedCafes.map((cafe, i) => (
          <CafeCard
            key={`saved-${i}`}
            name={cafe.name}
            location={cafe.location}
            rating={cafe.rating}
            isSaved={true}
            onToggleSave={() => {}}
          />
        ))}

      {activeTab === "Activity" && (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
          Activity feed coming soon...
        </Text>
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
    alignItems: "center",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginVertical: 12,
  },
  handle: {
    fontSize: 16,
    fontWeight: "600",
  },
  bio: {
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 24,
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  iconButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 999,
    marginHorizontal: 6,
  },
  sipUpdate: {
    backgroundColor: "#e6f4ea",
    paddingTop: 12,
    paddingRight: 34,
    paddingBottom: 12,
    paddingLeft: 34,
    borderRadius: 16,
    marginTop: 24,
  },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  activeDot: {
    width: 10,
    height: 10,
    backgroundColor: "#2e7d32",
    borderRadius: 5,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 4,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 8,
  },
  activeTab: {
    fontWeight: "bold",
    color: "#2e7d32",
  },
  inactiveTab: {
    color: "#999",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#e6f4ea",
    padding: 12,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  cafeImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  cardLocation: {
    fontSize: 13,
    color: "#555",
  },
  cardRating: {
    fontSize: 13,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
});
