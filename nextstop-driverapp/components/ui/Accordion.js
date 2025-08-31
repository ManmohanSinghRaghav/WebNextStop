import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors, radius, fontWeights } from './Theme';

const AccordionContext = createContext({
  openItem: null,
  setOpenItem: () => {},
});

export function Accordion({ children, defaultValue }) {
  const [openItem, setOpenItem] = useState(defaultValue || null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <View style={styles.accordionRoot}>{children}</View>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, value, style }) {
  return (
    <View style={[styles.item, style]} data-value={value}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue: value });
        }
        return child;
      })}
    </View>
  );
}

export function AccordionTrigger({ children, itemValue, style }) {
  const { openItem, setOpenItem } = useContext(AccordionContext);
  const isOpen = openItem === itemValue;
  const rotation = new Animated.Value(isOpen ? 1 : 0);

  const handlePress = () => {
    setOpenItem(isOpen ? null : itemValue);
    Animated.timing(rotation, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      style={[styles.trigger, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.triggerText}>{children}</Text>
      <Animated.View style={animatedStyle}>
        <ChevronDown size={16} color={colors.mutedForeground} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function AccordionContent({ children, itemValue, style }) {
  const { openItem } = useContext(AccordionContext);
  const isOpen = openItem === itemValue;

  if (!isOpen) return null;

  return (
    <View style={[styles.content, style]}>
      <Text style={styles.contentText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  accordionRoot: {
    width: '100%',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
    flex: 1,
  },
  content: {
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  contentText: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
});