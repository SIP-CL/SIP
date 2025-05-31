import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
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
            <ImageBackground
              source={require('../../assets/images/template.png')}
              style={styles.trendingCard}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.overlay}>
                <View style={{ marginTop: 'auto' }}>
                  <Text style={styles.trendingCardText}>{cafe.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Entypo name="star-outlined" size={15} color="white" style={{ marginRight: 4 }} />
                    <Text style={styles.trendingCardText}>{cafe.ratings['overall']['rating']} ({cafe.ratings['overall']['count']})</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}