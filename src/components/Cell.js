import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { COLORS, SIZES } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const Cell = ({ value, onPress, disabled, isWinningCell }) => {
  const { theme: colors } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (value) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || value !== null}
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        isWinningCell && [styles.winningCell, { borderColor: colors.primary }]
      ]}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {value === 'X' && (
          <MaterialCommunityIcons name="close" size={50} color={colors.x} />
        )}
        {value === 'O' && (
          <MaterialCommunityIcons name="circle-outline" size={45} color={colors.o} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.cell,
    height: SIZES.cell,
    backgroundColor: COLORS.surface,
    margin: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  winningCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Cell;
