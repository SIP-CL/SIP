import React from 'react';
import { FlatList, Image, View, Text, StyleSheet } from 'react-native';

interface ItemSliderProps {
  photos: any[]; // Array of local photo requires or URLs
  items: string[]; // Array of item names
  prices?: number[]; // Optional array of prices
  recommendationCount?: number[]; // Optional array of recommendation counts
}

const ItemSlider: React.FC<ItemSliderProps> = ({ photos, items, prices = [], recommendationCount = [] }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageWrapper}>
              <Image source={item} style={styles.image} resizeMode="cover" />
              {prices[index] != null && (
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>${prices[index]?.toFixed(2)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemName} numberOfLines={1}>
              {items[index]}
            </Text>
            {recommendationCount[index] != null && (
              <Text style={styles.recommendationText}>
                Recommended by {recommendationCount[index]}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  itemContainer: {
    width: 135,
    marginRight: 12,
  },
  imageWrapper: {
    width: 135,
    height: 135,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3C751E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemName: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  recommendationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default ItemSlider;
