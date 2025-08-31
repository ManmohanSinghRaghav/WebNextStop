import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from './Theme';

export function Alert({ variant = 'default', children, style }) {
  return (
    <View style={[styles.alert, variantStyles[variant].container, style]}>
      {children}
    </View>
  );
}

export function AlertTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function AlertDescription({ children, style }) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  alert: {
    position: 'relative',
    width: '100%',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    marginBottom: 4,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: colors.foreground,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedForeground,
  },
});

const variantStyles = {
  default: StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
  }),
  destructive: StyleSheet.create({
    container: {
      backgroundColor: colors.red50,
      borderColor: colors.red200,
    },
  }),
};