import React from 'react';
import { FlatList, Image, View, StyleSheet } from 'react-native';

interface menuSliderProps {
    photos: any[]; // Array of photo URLs   
}

const menuSlider: React.FC<menuSliderProps> = ({ photos }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={photos}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Image source={item} style={styles.image} resizeMode="cover" />
                )}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  image: {
    width: 135,
    height: 135,
    borderRadius: 12,
  },
});

export default menuSlider;