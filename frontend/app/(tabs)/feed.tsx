import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Static avatar images
const avatarImages: Record<string, any> = {
  jenny: require("../../assets/images/Jenny.png"),
  christine: require("../../assets/images/Jenny.png"),
  olivia: require("../../assets/images/Jenny.png"),
};

// Static review images
const reviewImages: Record<string, any> = {
  cake: require("../../assets/images/cake.png"),
  interior: require("../../assets/images/interior.png"),
  drink: require("../../assets/images/drink.png"),
};

// Dummy feed data
const dummyFeed = [
  {
    id: "1",
    user: { name: "Jenny Zhang", avatarKey: "jenny" },
    cafe: "harucake",
    rating: 5,
    review:
      "Corn latte was really good the corn flavor wasn't too strong but it was a little bit chunky which threw me off.",
    tags: ["Pastries", "Good Service"],
    favoriteDrink: "Soosoo Latte",
    imageKeys: ["cake"],
  },
  {
    id: "2",
    user: { name: "Christine Ahn", avatarKey: "christine" },
    cafe: "TPO Coffee",
    rating: 3,
    review:
      "Nice atmosphere and seating, but the drinks were just okay and really pricy.",
    tags: ["Study Spot", "Outlets", "Loud Music"],
    favoriteDrink: null,
    imageKeys: [],
  },
  {
    id: "3",
    user: { name: "Olivia Hyun", avatarKey: "olivia" },
    cafe: "Established Today.",
    rating: 4,
    review:
      "Very cool interior, they had 3 stations to listen to records. The coffee was very mid but would go again for the ambiance.",
    tags: ["Group Friendly", "Good Music"],
    favoriteDrink: "Kyoto cold brew",
    imageKeys: ["interior", "drink"],
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#3C751E" />);
    } else if (i - 0.5 === rating) {
      stars.push(
        <Ionicons key={i} name="star-half" size={16} color="#3C751E" />
      );
    } else {
      stars.push(<Ionicons key={i} name="star" size={16} color="#E2F0DA" />);
    }
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

const FriendFeedScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Friend Feed</Text>
      <View style={styles.headerLine} />

      {dummyFeed.map((post) => (
        <View key={post.id} style={styles.post}>
          <View style={styles.feedRow}>
            {/* Avatar Column */}
            <View style={styles.avatarColumn}>
              <Image
                source={avatarImages[post.user.avatarKey]}
                style={styles.avatar}
              />
            </View>

            {/* Content Column */}
            <View style={styles.contentColumn}>
              <Text style={styles.username}>
                {post.user.name} went to{" "}
                <Text style={styles.cafe}>{post.cafe}</Text>.
              </Text>

              <StarRating rating={post.rating} />

              <Text style={styles.review}>{post.review}</Text>

              <View style={styles.tags}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {post.favoriteDrink && (
                <Text style={styles.favorite}>
                  Favorite Drink: {post.favoriteDrink}
                </Text>
              )}

              {post.imageKeys.length > 0 && (
                <ScrollView horizontal style={styles.imageRow}>
                  {post.imageKeys.map((key, i) => (
                    <Image
                      key={i}
                      source={reviewImages[key]}
                      style={styles.image}
                    />
                  ))}
                </ScrollView>
              )}

              {/* Icons */}
              <View style={styles.iconRow}>
                <View style={styles.iconLeft}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    onPress={() => console.log("Liked")}
                  />
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    onPress={() => console.log("Commented")}
                  />
                </View>
                <View style={styles.iconRight}>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    onPress={() => console.log("Added")}
                  />
                  <Ionicons
                    name="bookmark-outline"
                    size={20}
                    onPress={() => console.log("Bookmarked")}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 16,
  },
  post: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 24,
    marginBottom: 24,
  },
  feedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarColumn: {
    marginRight: 12,
  },
  contentColumn: {
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  cafe: {
    fontWeight: "bold",
  },
  review: {
    marginVertical: 8,
    fontSize: 14,
    color: "#000",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3C751E",
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#3C751E",
    fontWeight: "500",
  },
  favorite: {
    fontWeight: "600",
    marginBottom: 6,
  },
  imageRow: {
    flexDirection: "row",
    marginVertical: 6,
  },
  image: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 12,
    marginRight: 8,
    resizeMode: "cover",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconLeft: {
    flexDirection: "row",
    columnGap: 16,
  },
  iconRight: {
    flexDirection: "row",
    columnGap: 16,
  },
});

export default FriendFeedScreen;
