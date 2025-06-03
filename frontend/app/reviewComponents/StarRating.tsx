import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import FilledStar from '../../assets/images/filled_star.svg';
import EmptyStar from '../../assets/images/empty_star.svg';

type Props = {
    rating: number;
    onPress?: (rating: number) => void;
    size?: number;
    readOnly?: boolean;
    color?: string;
};

const HalfStarComposite: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  return (
    <View style={{ width: size, height: size }}>
      <EmptyStar width={size} height={size} stroke="#000" strokeWidth={1} color={color} />
      <View
        style={{
          position: 'absolute',
          width: size / 2,
          height: size,
          overflow: 'hidden',
        }}
      >
        <FilledStar width={size} height={size} stroke="#000" strokeWidth={1} color={color} />
      </View>
    </View>
  );
};

const StarRating: React.FC<Props> = ({ rating, onPress, size = 32, readOnly = false, color = '#3C751E' }) => {
    const handlePress = (starIndex: number, isHalf: boolean) => {
        const selectedRating = isHalf ? starIndex + 0.5 : starIndex + 1;
        onPress?.(selectedRating);
    };

    return (
        <View style={styles.container}>
          {[0, 1, 2, 3, 4].map((i) => {
            const starValue = i + 1;
            let starIcon;
            if (rating >= starValue) {
              starIcon = <FilledStar width={size} height={size} stroke="#000" strokeWidth={1} color={color} />;
            } else if (rating >= starValue - 0.5) {
              starIcon = <HalfStarComposite size={size} color={color} />;
            } else {
              starIcon = <EmptyStar width={size} height={size} stroke="#000" strokeWidth={1} color={color} />;
            }
            return (
              <View key={starValue} style={[styles.starWrapper, { width: size, height: size }]}>
                {!readOnly && (
                  <>
                    <Pressable
                      style={styles.pressableHalfLeft}
                      onPress={() => handlePress(i, true)}
                    />
                    <Pressable
                      style={styles.pressableHalfRight}
                      onPress={() => handlePress(i, false)}
                    />
                  </>
                )}
                <View style={styles.starIcon}>{starIcon}</View>
              </View>
            );
          })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8, // Only works in RN 0.71+, otherwise use margin
    },
    starWrapper: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pressableHalfLeft: {
      position: 'absolute',
      width: '50%',
      height: '100%',
      left: 0,
      zIndex: 2,
    },
    pressableHalfRight: {
      position: 'absolute',
      width: '50%',
      height: '100%',
      right: 0,
      zIndex: 2,
    },
    starIcon: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
});

export default StarRating;