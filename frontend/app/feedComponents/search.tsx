import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet } from 'react-native';

type Cafe = {
  _id: string;
  name: string;
  address: string;
  rating: number;
  numReviews: number;
};

type Props = {
  query: string;
  setQuery: (text: string) => void;
};

export default function SearchBar({ query, setQuery }: Props) {
  const [results, setResults] = useState<Cafe[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

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
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔍 Search for a cafe..."
        value={query}
        onChangeText={setQuery}
      />

      {query.length >= 2 && results.length === 0 && (
        <Text style={styles.noResults}>No results found.</Text>
      )}

      {results.map((cafe) => (
        <View key={cafe._id} style={styles.result}>
          <Text style={styles.name}>{cafe.name}</Text>
          <Text style={styles.details}>{cafe.address}</Text>
          <Text style={styles.details}>⭐ {cafe.rating} ({cafe.numReviews} reviews)</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  result: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  details: { fontSize: 14, color: '#555' },
  noResults: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
});
