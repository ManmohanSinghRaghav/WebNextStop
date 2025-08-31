import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, fontWeights } from './Theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({ children, style }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function CardTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function CardDescription({ children, style }) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

export function CardContent({ children, style }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

export function CardFooter({ children, style }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: 'hidden',
    ...shadows.sm,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    color: colors.cardForeground,
  },
  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});