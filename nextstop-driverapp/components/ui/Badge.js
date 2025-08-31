import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from './Theme';

export function Badge({ variant = 'default', children, style, textStyle }) {
  return (
    <View style={[styles.base, variantStyles[variant].container, style]}>
      <Text style={[styles.textBase, variantStyles[variant].text, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  textBase: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    lineHeight: 16,
  },
});

const variantStyles = {
  default: StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      borderColor: 'transparent',
    },
    text: {
      color: colors.primaryForeground,
    },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: colors.secondary,
      borderColor: 'transparent',
    },
    text: {
      color: colors.secondaryForeground,
    },
  }),
  destructive: StyleSheet.create({
    container: {
      backgroundColor: colors.destructive,
      borderColor: 'transparent',
    },
    text: {
      color: colors.destructiveForeground,
    },
  }),
  outline: StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
    },
    text: {
      color: colors.foreground,
    },
  }),
};