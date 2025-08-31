import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, radius, fontWeights, shadows } from './Theme';

export function Button({ variant = 'default', size = 'default', children, style, textStyle, disabled, ...props }) {
  const isIconOnly = size === 'icon' && React.Children.count(children) === 1;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant].container,
        sizeStyles[size].container,
        isIconOnly && sizeStyles.icon.container,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[
          sizeStyles[size].text,
          variantStyles[variant].text,
          disabled && variantStyles[variant].disabledText,
          textStyle
        ]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles = {
  default: StyleSheet.create({
    container: { height: 36, paddingHorizontal: 16, paddingVertical: 8 },
    text: { fontSize: 14, fontWeight: fontWeights.medium },
  }),
  sm: StyleSheet.create({
    container: { height: 32, paddingHorizontal: 12, borderRadius: radius.md },
    text: { fontSize: 12, fontWeight: fontWeights.medium },
  }),
  lg: StyleSheet.create({
    container: { height: 40, paddingHorizontal: 24, borderRadius: radius.md },
    text: { fontSize: 16, fontWeight: fontWeights.medium },
  }),
  icon: StyleSheet.create({
    container: { width: 36, height: 36, padding: 0 },
    text: {},
  }),
};

const variantStyles = {
  default: StyleSheet.create({
    container: { 
      backgroundColor: colors.primary,
      ...shadows.sm,
    },
    text: { color: colors.primaryForeground },
    disabledText: { color: colors.primaryForeground },
  }),
  destructive: StyleSheet.create({
    container: { 
      backgroundColor: colors.destructive,
      ...shadows.sm,
    },
    text: { color: colors.destructiveForeground },
    disabledText: { color: colors.destructiveForeground },
  }),
  outline: StyleSheet.create({
    container: { 
      borderWidth: 1, 
      borderColor: colors.border, 
      backgroundColor: 'transparent' 
    },
    text: { color: colors.foreground },
    disabledText: { color: colors.mutedForeground },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: colors.secondary },
    text: { color: colors.secondaryForeground },
    disabledText: { color: colors.mutedForeground },
  }),
  ghost: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: colors.foreground },
    disabledText: { color: colors.mutedForeground },
  }),
  link: StyleSheet.create({
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary, textDecorationLine: 'underline' },
    disabledText: { color: colors.mutedForeground },
  }),
};