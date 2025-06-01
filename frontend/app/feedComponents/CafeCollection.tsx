import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';

export default function CafeCollections() {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={styles.sectionHeader}>Cafe Collections</Text>
        <TouchableOpacity>
          <Text style={{ color: '#3C751E', fontWeight: '600' }}>View all</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.collectionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Best Study Cafes</Text>

          <Image
            source={require('../../assets/images/BestStudy.png')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.collectionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image
            source={require('../../assets/images/HiddenGem.png')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />

          <Text style={{ fontSize: 16, fontWeight: '500' }}>Hidden Gems</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.collectionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Good for Groups</Text>

          <Image
            source={require('../../assets/images/GoodForGroups.png')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
