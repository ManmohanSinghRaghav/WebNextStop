import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fontWeights } from './Theme';

export function LoadingSpinner({ size = 'medium', color = colors.primary, text = null }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizeStyles = {
    small: { width: 16, height: 16, borderWidth: 2 },
    medium: { width: 24, height: 24, borderWidth: 3 },
    large: { width: 32, height: 32, borderWidth: 4 },
  };

  return (
    <View style={[styles.container, text && styles.containerWithText]}>
      <Animated.View
        style={[
          styles.spinner,
          sizeStyles[size],
          { borderTopColor: color, transform: [{ rotate: spin }] },
        ]}
      />
      {text && <Text style={[styles.text, { color }]}>{text}</Text>}
    </View>
  );
}

export function LoadingOverlay({ visible, text = "Loading..." }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <LoadingSpinner size="large" color={colors.primary} />
        <Text style={styles.overlayText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWithText: {
    gap: 8,
  },
  spinner: {
    borderColor: colors.muted,
    borderRadius: 50,
  },
  text: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: colors.background,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
    minWidth: 120,
  },
  overlayText: {
    fontSize: 16,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
  },
});
