import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle, StyleProp, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Elevation } from '@/constants/theme';

interface AppleElevatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
  onPress?: () => void;
  accentVariant?: 'none' | 'gold' | 'rose' | 'danger' | 'success';
  floating?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppleElevatedCard({
  children,
  style,
  interactive = false,
  onPress,
  accentVariant = 'none',
  floating = false,
}: AppleElevatedCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!interactive) return;
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (!interactive) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!interactive || !onPress) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics optional
      }
    }
    onPress();
  };

  const getBorderColor = () => {
    switch (accentVariant) {
      case 'gold':
        return Colors.borderGold;
      case 'rose':
        return Colors.borderRose;
      case 'danger':
        return 'rgba(255, 59, 48, 0.35)';
      case 'success':
        return 'rgba(52, 199, 89, 0.35)';
      default:
        return Colors.borderCard;
    }
  };

  const baseStyle = [
    floating ? styles.cardFloating : styles.card,
    { borderColor: getBorderColor() },
    style,
  ];

  if (!interactive) {
    return <View style={baseStyle}>{children}</View>;
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[baseStyle, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      } as any,
    }),
  },
  cardFloating: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
});
