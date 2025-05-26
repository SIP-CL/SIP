import React, { lazy, useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';

type Props = {
    label: string;
    selected?: boolean;
    onPress: (label: string) => void;
    color?: string;
}

const Label: React.FC<Props> = ({ label, selected = false, onPress, color }) => {
    return (
        <Pressable
            onPress={() => onPress(label)}
            style={({ pressed }) => [
                {
                    backgroundColor: selected ? color : 'white',
                    borderColor: color,
                    borderWidth: 1,
                    padding: 5,
                    borderRadius: 999, // Large enough to make it fully pill-shaped
                    margin: 5,
                },
                pressed && { opacity: 0.5 },
            ]}
        >
            <Text style={[styles.label, { color: selected ? 'white' : color }]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 10,
        fontWeight: '500',
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        lineHeight: 14,
        marginRight: 4,
        marginLeft: 4
    }
});

export default Label;