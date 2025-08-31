import React, { createContext, useContext, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, radius, shadows, fontWeights } from './Theme';

const DialogContext = createContext({
  open: false,
  setOpen: () => {},
});

export function Dialog({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild, ...props }) {
  const { setOpen } = useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => setOpen(true),
      ...props,
    });
  }

  return (
    <TouchableOpacity onPress={() => setOpen(true)} {...props}>
      {children}
    </TouchableOpacity>
  );
}

export function DialogContent({ children, style }) {
  const { open, setOpen } = useContext(DialogContext);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPress} onPress={() => setOpen(false)} />
        <View style={[styles.content, style]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOpen(false)}
          >
            <X size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function DialogHeader({ children, style }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function DialogTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function DialogDescription({ children, style }) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

export function DialogFooter({ children, style }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function DialogClose({ children, onPress }) {
  const { setOpen } = useContext(DialogContext);

  const handlePress = () => {
    setOpen(false);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    ...shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    borderRadius: radius.sm,
  },
  header: {
    marginBottom: 16,
    paddingRight: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    color: colors.foreground,
  },
  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
});
