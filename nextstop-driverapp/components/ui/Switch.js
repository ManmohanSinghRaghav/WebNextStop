import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { colors } from './Theme';

export function Switch({ value, onValueChange, ...props }) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ 
        false: colors.switchBackground, 
        true: colors.primary 
      }}
      thumbColor={value ? colors.primaryForeground : colors.background}
      ios_backgroundColor={colors.switchBackground}
      {...props}
    />
  );
}
