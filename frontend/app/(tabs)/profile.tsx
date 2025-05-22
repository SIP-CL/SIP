import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CafeCard = ({ name, location, rating }) => (
  <View style={styles.cardContainer}>
    <Image
      source={require("../../assets/images/cafe.png")} // Replace with your image source
      style={styles.cafeImage}
    />
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardLocation}>{location}</Text>
      <Text style={styles.cardRating}>{rating}</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity>
        <Ionicons name="add-circle-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="bookmark-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProfileScreen() {
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
        <Text style={styles.rankText}>#15 Places Ranked!</Text>
        <Text style={styles.rankSubtext}>
          Keep ranking your future cafe visits!
        </Text>
      </View>

      {/* Dot Navigation */}
      <View style={styles.dotRow}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
        <View style={styles.inactiveDot} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Text style={styles.activeTab}>Top Rated</Text>
        <Text style={styles.inactiveTab}>Saved</Text>
        <Text style={styles.inactiveTab}>Activity</Text>
      </View>

      {/* Cafe Cards */}
      {[...Array(4)].map((_, i) => (
        <CafeCard
          key={i}
          name="1. Bonsai Coffee Bar"
          location="$$ | Sawtelle"
          rating="★★★★½"
        />
      ))}
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
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  rankText: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 20,
  },
  rankSubtext: {
    marginTop: 6,
    color: "#555",
    fontSize: 13,
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
