import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
  category: string;
  cafes: any[];
};

export default function TopCafesByDrinks({ category, cafes }: Props) {
  return (
    
    <View>
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