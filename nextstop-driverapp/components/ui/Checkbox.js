import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, radius, shadows } from './Theme';

export function Checkbox({ checked, onCheckedChange, disabled, style, ...props }) {
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled,
        style
      ]}
      {...props}
    >
      {checked && (
        <View style={styles.indicator}>
          <Check size={14} color={colors.primaryForeground} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
