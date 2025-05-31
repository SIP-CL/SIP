import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Labels from '../reviewComponents/labels';

type Cafe = {
  _id: string;
  name: string;
  address: string;
  rating: number;
  numReviews: number;
};

type Props = {
  goBack: () => void;
  onCafeSelect: (id: string) => void;
};

export default function SearchScreen({ goBack, onCafeSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Cafe[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const availableFilters = [
    "Study Spot", "Pastries", "Late-night", "Comfy Seats",
    "Pet Friendly", "Good Music", "Outlets", "Free Wifi",
    "Group Friendly", "Good Service", "Natural Light"
  ];
  
  const toggleFilter = (label: string) => {
    setSelectedFilters(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:3000/cafes/search?name=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={goBack}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 12 }}>Search</Text>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#e5e5e5',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 999,
          marginBottom: 16,
        }}>
          <Feather name="search" size={20} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search for a cafe..."
            placeholderTextColor="#777"
            style={{ flex: 1, fontSize: 16 }}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {availableFilters.map((label) => (
              <Labels
                key={label}
                label={label}
                selected={selectedFilters.includes(label)}
                onPress={toggleFilter}
                color="#3C751E"
              />
            ))}
          </View>
        </View>

        {query.length >= 2 && results.length === 0 && (
          <Text style={{ color: '#999', textAlign: 'center', fontStyle: 'italic' }}>No results found.</Text>
        )}

        {results.map((cafe) => (
          <TouchableOpacity
            key={cafe._id}
            onPress={() => onCafeSelect(cafe._id)}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{cafe.name}</Text>
            <Text style={{ color: '#555' }}>{cafe.address}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Entypo name="star-outlined" size={15} cdolor="black" style={{ marginRight: 4 }} />
              <Text>{cafe.rating} ({cafe.numReviews})</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}