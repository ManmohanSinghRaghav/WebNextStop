import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Button } from './Button';
import { colors, radius, shadows, fontWeights } from './Theme';

// The main component manages the modal's visibility state
export function AlertDialog({ visible, setVisible, children }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}
    >
      {children}
    </Modal>
  );
}

// A full-screen overlay that closes the modal on press
export function AlertDialogOverlay({ setVisible }) {
  return (
    <Pressable style={styles.overlay} onPress={() => setVisible(false)} />
  );
}

// The main content container
export function AlertDialogContent({ children, style }) {
  return (
    <View style={styles.centeredView}>
      <View style={[styles.content, style]}>
        {children}
      </View>
    </View>
  );
}

export function AlertDialogHeader({ children, style }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function AlertDialogFooter({ children, style }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function AlertDialogTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function AlertDialogDescription({ children, style }) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

// Use our converted Button component for actions
export function AlertDialogAction({ children, onPress }) {
  return <Button onPress={onPress}>{children}</Button>;
}

export function AlertDialogCancel({ children, onPress }) {
  return <Button variant="outline" onPress={onPress}>{children}</Button>;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 500,
    ...shadows.lg,
  },
  header: {
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
    color: colors.foreground,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 8,
  },
});