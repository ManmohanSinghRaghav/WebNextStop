import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from './Theme';

export function Avatar({ children, style }) {
  return <View style={[styles.avatar, style]}>{children}</View>;
}

export function AvatarImage({ src, style }) {
  const [hasError, setHasError] = useState(!src);

  if (hasError) {
    return null; // Don't render anything if there's an error, fallback will be shown
  }

  return (
    <Image
      source={{ uri: src }}
      style={[styles.image, style]}
      onError={() => setHasError(true)}
    />
  );
}

export function AvatarFallback({ children, style }) {
  return (
    <View style={[styles.fallback, style]}>
      {typeof children === 'string' ? (
        <Text style={styles.fallbackText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 20, // Half of height/width
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  fallback: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: colors.mutedForeground,
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
});