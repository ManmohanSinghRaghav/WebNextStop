import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, radius } from './Theme';

export function Input({ style, ...props }) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.mutedForeground}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    fontSize: 14,
    color: colors.foreground,
  },
});
