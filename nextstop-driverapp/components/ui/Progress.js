import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from './Theme';

export function Progress({ value = 0, style }) {
  // Ensure value is between 0 and 100
  const progress = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.track, style]}>
      <View style={[styles.indicator, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    width: '100%',
    backgroundColor: colors.muted,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  },
});