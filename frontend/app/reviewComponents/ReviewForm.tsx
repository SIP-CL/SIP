import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import StarRating from './StarRating';
import sharedStyles from './styles'; // your shared style file

type Props = {
  onSubmit: (overall: number, wifi: number, noise: number, comments: string) => void;
  onCancel: () => void;
};

const ReviewForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [overall, setOverall] = useState<number>(0);
  const [wifi, setWifi] = useState<number>(0);
  const [noise, setNoise] = useState<number>(0);
  const [comments, setComments] = useState<string>('');

  const handleSubmit = () => {
    if (overall === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(overall, wifi, noise, comments);
    setOverall(0);
    setWifi(0);
    setNoise(0);
    setComments('');
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.header}>Rate the Cafe</Text>

      <View style={localStyles.ratingGroup}>
        <Text style={sharedStyles.sectionHeader}>Overall</Text>
        <StarRating rating={overall} onPress={setOverall} />
      </View>

      <View style={localStyles.ratingGroup}>
        <Text style={sharedStyles.sectionHeader}>Wifi</Text>
        <StarRating rating={wifi} onPress={setWifi} />
      </View>

      <View style={localStyles.ratingGroup}>
        <Text style={sharedStyles.sectionHeader}>Noise Level</Text>
        <StarRating rating={noise} onPress={setNoise} />
      </View>

      <TextInput
        style={[sharedStyles.searchBar, localStyles.commentInput]}
        placeholder="Leave a comment..."
        multiline
        value={comments}
        onChangeText={setComments}
      />

      <Pressable onPress={handleSubmit} style={localStyles.button}>
        <Text style={localStyles.buttonText}>Submit Review</Text>
      </Pressable>

      <Pressable onPress={onCancel} style={[localStyles.button, { backgroundColor: '#ccc' }]}>
        <Text style={localStyles.buttonText}>Cancel</Text>
      </Pressable>
    </View>
  );
};

const localStyles = StyleSheet.create({
  ratingGroup: {
    marginBottom: 16,
  },
  commentInput: {
    textAlignVertical: 'top',
    height: 100,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ReviewForm;
