import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp, View } from 'react-native';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: (label: string) => void;
  color?: string;
};

const Label: React.FC<Props> = ({ label, selected = false, onPress, color = '#000' }) => {
  const baseStyle: ViewStyle = {
    backgroundColor: selected ? color : 'white',
    borderColor: color,
    borderWidth: 1,
    padding: 5,
    borderRadius: 999,
    margin: 5,
  };

  const textStyle = {
    color: selected ? 'white' : color,
  };

  if (!onPress) {
    return (
      <View style={baseStyle}>
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => onPress(label)}
      style={({ pressed }) => [
        baseStyle,
        pressed && { opacity: 0.5 },
      ]}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    lineHeight: 14,
    marginRight: 4,
    marginLeft: 4,
  },
});

export default Label;
