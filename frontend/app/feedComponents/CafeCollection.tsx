import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CafeCollections() {
    const titles = ["Best Study Cafes", "Hidden Gems", "Good for Groups"];
    return (
      <View>
        <Text style={styles.sectionHeader}>Cafe Collections</Text>
        {titles.map(title => (
          <TouchableOpacity key={title} style={styles.collectionCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>{title}</Text>
              <AntDesign name="right" size={20} color="black" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }