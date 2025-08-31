import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { colors, radius, fontWeights, shadows } from './Theme';

const { width } = Dimensions.get('window');

// Main container for the drawer content
export function Sidebar({ children }) {
  return <View style={styles.sidebarContainer}>{children}</View>;
}

// Header section of the sidebar
export function SidebarHeader({ children, style }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

// Main scrollable content area
export function SidebarContent({ children, style }) {
  return <ScrollView style={[styles.content, style]}>{children}</ScrollView>;
}

// Footer section of the sidebar
export function SidebarFooter({ children, style }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

// A logical grouping of menu items
export function SidebarGroup({ children }) {
  return <View style={styles.group}>{children}</View>;
}

// Label for a sidebar group
export function SidebarGroupLabel({ children }) {
  return <Text style={styles.groupLabel}>{children}</Text>;
}

// Content wrapper for sidebar group
export function SidebarGroupContent({ children }) {
  return <View style={styles.groupContent}>{children}</View>;
}

// Container for the menu items
export function SidebarMenu({ children }) {
  return <View style={styles.menu}>{children}</View>;
}

// Wrapper for a single menu item
export function SidebarMenuItem({ children }) {
  return <View>{children}</View>;
}

// The actual pressable button for a menu item
export function SidebarMenuButton({ children, onPress, isActive = false, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuButton, isActive && styles.menuButtonActive, style]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

// Trigger button for mobile sidebar (hamburger menu)
export function SidebarTrigger({ onPress, style }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Add animation feedback
    Animated.sequence([
      Animated.timing(rotateAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
    
    onPress();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.sidebarTrigger, style]}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// Simple provider context for sidebar state
const SidebarContext = React.createContext({
  open: false,
  setOpen: () => {},
});

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: colors.sidebar,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.sidebarBorder,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.sidebarBorder,
  },
  group: {
    padding: 16,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: fontWeights.bold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  groupContent: {
    paddingHorizontal: 8,
  },
  menu: {
    gap: 4,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.lg,
    gap: 12,
  },
  menuButtonActive: {
    backgroundColor: colors.sidebarAccent,
    ...shadows.sm,
  },
  sidebarTrigger: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: 'transparent',
    ...shadows.sm,
  },
  hamburgerLine: {
    width: 18,
    height: 2,
    backgroundColor: colors.foreground,
    marginVertical: 1.5,
    borderRadius: 1,
  },
});