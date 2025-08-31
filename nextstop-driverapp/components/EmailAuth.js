import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { colors, fontWeights } from './ui/Theme';
import { createAccount, loginWithEmail } from '../utils/firebase';

export function EmailAuth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = (val) => /.+@.+\..+/.test(val);

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!isEmailValid(email)) {
      setError('Enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await createAccount(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      // onAuthStateChanged in App.js will pick up and route into the app
    } catch (e) {
      const msg = e?.message || 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Driver Login' : 'Create Driver Account'}</CardTitle>
        </CardHeader>
        <CardContent style={styles.content}>
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              secureTextEntry
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          {mode === 'signup' && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                secureTextEntry
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
              />
            </View>
          )}

          <Button onPress={handleSubmit} style={styles.primaryButton} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
            )}
          </Button>

          <TouchableOpacity onPress={switchMode} style={styles.switchRow}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </Text>
          </TouchableOpacity>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: colors.destructive,
    backgroundColor: colors.red50,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 12,
  },
  primaryButton: {
    height: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  switchRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
});
