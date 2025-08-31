import React, { useState, createContext, useContext } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { colors } from './Theme';

const CollapsibleContext = createContext({
  open: false,
  setOpen: () => {},
});

export function Collapsible({ children, defaultOpen = false, onOpenChange }) {
  const [open, setOpen] = useState(defaultOpen);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <CollapsibleContext.Provider value={{ open, setOpen: handleOpenChange }}>
      <View style={styles.collapsible}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({ children, asChild, style, ...props }) {
  const { open, setOpen } = useContext(CollapsibleContext);

  const handlePress = () => {
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: handlePress,
      ...props,
    });
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.trigger, style]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

export function CollapsibleContent({ children, style }) {
  const { open } = useContext(CollapsibleContext);
  const [animation] = useState(new Animated.Value(open ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [open, animation]);

  const animatedStyle = {
    opacity: animation,
    maxHeight: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1000], // Adjust max height as needed
    }),
  };

  if (!open) {
    return null;
  }

  return (
    <Animated.View style={[styles.content, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  collapsible: {
    width: '100%',
  },
  trigger: {
    // Default trigger styles - can be overridden
  },
  content: {
    overflow: 'hidden',
  },
});
