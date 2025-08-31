import React from 'react';
import { View } from 'react-native';

export function AspectRatio({ ratio = 1, children, style }) {
  return (
    <View style={[{ aspectRatio: ratio }, style]}>
      {children}
    </View>
  );
}
