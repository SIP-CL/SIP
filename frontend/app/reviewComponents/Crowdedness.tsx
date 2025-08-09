import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure expo-linear-gradient is installed

const CrowdednessPill = ({ crowdedness }) => {
  const barWidth = crowdedness > 0 ? `${crowdedness}%` : '2%';

  // Gradient colors
  const gradientColors = ['#3C751E', '#E3A72F', '#E6725A'];
  const borderColor = gradientColors[gradientColors.length - 1]; // Last color in gradient

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.labelText}>
        <Text style={styles.liveText}>Live </Text>
        Capacity
      </Text>

      {/* Bar with Border */}
      <View style={[styles.barBackground, { borderColor: borderColor, borderWidth: 2 }]}>
        {/* Filled Bar */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.filledBar, { width: barWidth }]}
        />
      </View>

      {/* Percentage */}
      <Text style={styles.percentageText}>{crowdedness}%</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  filledBar: {
    height: '100%',
    borderRadius: 50,
  },
  barBackground: {
    width: '100%',
    height: 20,
    borderRadius: 50,
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginBottom: 8,
    // NOW dynamic borderColor and borderWidth will be added via inline style
  },
  container: {
    // paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-start', // Align everything to the left
    width: '100%',            // Full width
  },
  labelText: {
    fontSize: 12,
    // fontWeight: '600',
    marginBottom: 4,
    textAlign: 'left',
    width: '100%',            // Full width for text
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 22,
  },
  liveText: {
    color: '#E6725A',
  },
  barBackground: {
    width: "100%",
    height: 20,
    borderRadius: 50,
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',            // Full width for percentage
  },
});

export default CrowdednessPill;
