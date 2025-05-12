import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './styles';
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
  cafes: any[];
  onCafeSelect: (id: string) => void;
};

export default function TrendingSection({ cafes, onCafeSelect }: Props) {
  return (
    <View>
      <Text style={styles.sectionHeader}>Trending Now</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cafes.map(cafe => (
          <TouchableOpacity
            key={cafe._id}
            style={styles.cafeCard}
            onPress={() => onCafeSelect(cafe._id)}
          >
            <Text style={styles.cafeName}>{cafe.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Entypo name="star-outlined" size={15} color="black" style={{ marginRight: 4 }} />
                <Text>{cafe.rating} ({cafe.numReviews})</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}