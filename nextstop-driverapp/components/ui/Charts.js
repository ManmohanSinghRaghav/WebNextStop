import React, { createContext, useContext } from 'react';
import { View, Dimensions } from 'react-native';
import { colors } from './Theme';

const ChartContext = createContext(null);

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartContainer');
  }
  return context;
}

export function ChartContainer({ config, children, style }) {
  const { width } = Dimensions.get('window');
  
  return (
    <ChartContext.Provider value={{ config }}>
      <View style={[{ width: width - 32, aspectRatio: 16/9 }, style]}>
        {children}
      </View>
    </ChartContext.Provider>
  );
}

// For React Native, we'll use simple chart components
// In a real app, you'd use react-native-chart-kit or victory-native

export function SimpleBarChart({ data, style }) {
  return (
    <View style={[{ height: 200, backgroundColor: colors.muted, borderRadius: 8, padding: 16 }, style]}>
      {/* Placeholder for chart - integrate with react-native-chart-kit */}
    </View>
  );
}

export function SimpleLineChart({ data, style }) {
  return (
    <View style={[{ height: 200, backgroundColor: colors.muted, borderRadius: 8, padding: 16 }, style]}>
      {/* Placeholder for chart - integrate with react-native-chart-kit */}
    </View>
  );
}
