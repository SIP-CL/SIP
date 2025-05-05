import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import Entypo from '@expo/vector-icons/Entypo';

export default function TopCafesByDrinks({ cafes }: { cafes: any[] }) {
  return (
    <View>
      <Text style={styles.sectionHeader}>Top Cafes by Drinks</Text>
      <View style={styles.tabHeader}>
        {["Coffee", "Matcha", "Tea"].map(drink => (
          <View key={drink} style={styles.tab}><Text>{drink}</Text></View>
        ))}
      </View>
      {cafes.slice(0, 3).map((cafe, index) => (
        <View key={cafe._id} style={styles.rankCard}>
          <Text>{index + 1}. {cafe.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Entypo name="star-outlined" size={15} color="black" style={{ marginRight: 4 }} />
            <Text>{cafe.rating} ({cafe.numReviews})</Text>
          </View>
        </View>
      ))}
    </View>
  );
}