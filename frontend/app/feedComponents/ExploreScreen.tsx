// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { Ionicons } from "@expo/vector-icons";
// import SearchScreen from "./search"; // adjust path

// const markers = [
//   { id: 1, lat: 34.0632, lon: -118.4468, rating: 4.0 },
//   { id: 2, lat: 34.0638, lon: -118.4455, rating: 2.1 },
//   { id: 3, lat: 34.0623, lon: -118.4465, rating: 3.5 },
//   { id: 4, lat: 34.0628, lon: -118.4442, rating: 4.8 },
//   { id: 5, lat: 34.0608, lon: -118.4445, rating: 5.0 },
//   { id: 6, lat: 34.0602, lon: -118.4435, rating: 4.3 },
// ];

// export default function ExploreScreen() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [price, setPrice] = useState("$$");

//   if (showSearch) {
//     return <SearchScreen goBack={() => setShowSearch(false)} />;
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: 34.0623,
//           longitude: -118.4455,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         {markers.map((m) => (
//           <Marker key={m.id} coordinate={{ latitude: m.lat, longitude: m.lon }}>
//             <View
//               style={[
//                 styles.marker,
//                 { backgroundColor: m.rating < 3 ? "#d9534f" : "#4caf50" },
//               ]}
//             >
//               <Text style={styles.markerText}>{m.rating.toFixed(1)}</Text>
//             </View>
//           </Marker>
//         ))}
//       </MapView>

//       <View style={styles.overlay}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Explore</Text>
//           <TouchableOpacity onPress={() => setShowSearch(true)}>
//             <Ionicons name="search" size={24} />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.tabs}>
//           {["All", "Been", "Want to Try"].map((label, index) => (
//             <Text
//               key={label}
//               style={[styles.tabText, index === 0 && styles.tabActive]}
//             >
//               {label}
//             </Text>
//           ))}
//         </View>

//         <ScrollView
//           horizontal
//           style={styles.filters}
//           contentContainerStyle={styles.filterContainer}
//           showsHorizontalScrollIndicator={false}
//         >
//           {["Open now", "Price", "Distance"].map((label) => (
//             <TouchableOpacity key={label} style={styles.openNowButton}>
//               <Text style={styles.openNowText}>{label}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.bottomPanel}>
//         <Text style={styles.bottomText}>see list</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   overlay: {
//     position: "absolute",
//     top: 0,
//     width: "100%",
//     backgroundColor: "transparent",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 10,
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//   },
//   title: { fontSize: 28, fontWeight: "bold" },
//   tabs: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     paddingVertical: 8,
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//   },
//   tabText: { fontSize: 16, color: "#444" },
//   tabActive: {
//     color: "green",
//     borderBottomWidth: 2,
//     borderColor: "green",
//   },
//   filters: { paddingVertical: 10 },
//   filterContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     paddingHorizontal: 10,
//   },
//   openNowButton: {
//     paddingHorizontal: 1,
//     paddingVertical: 1,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: "#2e7d32",
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//     height: 35,
//     width: 100,
//   },
//   openNowText: {
//     color: "#2e7d32",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
//   marker: { padding: 6, borderRadius: 20 },
//   markerText: { color: "white", fontWeight: "bold" },
//   bottomPanel: {
//     alignItems: "center",
//     paddingVertical: 12,
//     backgroundColor: "white",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   bottomText: { fontSize: 16 },
// });
