import react from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import FilledStar from '../../assets/images/filled_star.svg';
import HalfStar from '../../assets/images/half_filled_star.svg';
import EmptyStar from '../../assets/images/empty_star.svg';

type Props = {
    rating: number;
    onPress: (rating: number) => void;
    size?: number;
}

const StarRating: React.FC<Props> = ({rating, onPress, size = 32}) => {
    const handlePress = (starIndex: number, isHalf: boolean) => {
        const selectedRating = isHalf ? starIndex + 0.5 : starIndex + 1;
        onPress(selectedRating);
    };

    return (
        <View style={styles.container}>
          {[0, 1, 2, 3, 4].map((i) => {
            const starValue = i + 1;
            let starIcon;
            if (rating >= starValue) {
              starIcon = <FilledStar width={size} height={size} color = '#A9A9A9' />;
            } else if (rating >= starValue - 0.5) {
              starIcon = <HalfStar width={size} height={size} color = '#A9A9A9'/>;
            } else {
              starIcon = <EmptyStar width={size} height={size} color = '#A9A9A9'/>;
            }
      
            return (
              <View key={starValue} style={[styles.starWrapper, { width: size, height: size }]}>
                <Pressable
                  style={styles.pressableHalfLeft}
                  onPress={() => handlePress(i, true)}
                />
                <Pressable
                  style={styles.pressableHalfRight}
                  onPress={() => handlePress(i, false)}
                />
                <View style={styles.starIcon}>{starIcon}</View>
              </View>
            );
          })}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8, // If supported by your RN version
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