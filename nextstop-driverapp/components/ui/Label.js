import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontWeights } from './Theme';

export function Label({ children, style, ...props }) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
    marginBottom: 8,
  },
});
