import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
  cafes: any[];
  onCafeSelect: (id: string) => void;
};

export default function TopCafesByDrinks({ cafes, onCafeSelect }: Props) {
  return (
    
    <View>
      {cafes.slice(0, 5).map((cafe, index) => (
        <TouchableOpacity
          key={cafe._id}
          style={styles.rankCard}
          onPress={() => onCafeSelect(cafe._id)}
        >
          <Text>{index + 1}. {cafe.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Entypo name="star-outlined" size={15} color="black" style={{ marginRight: 4 }} />
            <Text>{cafe.rating} ({cafe.numReviews})</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}