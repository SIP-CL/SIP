import React from 'react';
import { View, Slider as RNSlider, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // Community slider
// OR use `import { Slider } from 'react-native';` if using the built-in one

const RatingSlider = ({ value, onChange }) => {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onChange}
        minimumValue={1}
        maximumValue={5}
        step={0.1}
        minimumTrackTintColor="green"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#fff"
      />
      <Text style={styles.valueText}>{value.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  valueText: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
  },
});

export default RatingSlider;
