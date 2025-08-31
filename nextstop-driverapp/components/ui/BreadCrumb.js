import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { colors, fontWeights, spacing } from './Theme';

export function Breadcrumb({ children, style }) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export function BreadcrumbList({ children, style }) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export function BreadcrumbItem({ children, style }) {
  return <View style={[styles.item, style]}>{children}</View>;
}

export function BreadcrumbLink({ children, ...props }) {
  return (
    <TouchableOpacity {...props}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
}

export function BreadcrumbPage({ children }) {
  return <Text style={styles.page}>{children}</Text>;
}

export function BreadcrumbSeparator() {
  return (
    <View style={styles.separator}>
      <ChevronRight size={14} color={colors.mutedForeground} />
    </View>
  );
}

export function BreadcrumbEllipsis() {
  return (
    <View style={styles.separator}>
      <MoreHorizontal size={16} color={colors.mutedForeground} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: fontWeights.normal,
  },
  page: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
  },
  separator: {
    marginHorizontal: spacing.xs,
  },
});