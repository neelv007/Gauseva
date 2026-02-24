import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';
import { COLORS } from '../src/constants/colors';
import { PWAInstallPrompt } from '../src/components/PWAInstallPrompt';

export default function RootLayout() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.saffron} />
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="about" />
          <Stack.Screen name="government-order" />
          <Stack.Screen name="contact" />
          <Stack.Screen name="login" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="reference-form" />
          <Stack.Screen name="submission-success" />
        </Stack>
        <PWAInstallPrompt />
      </View>
    </SafeAreaProvider>
  );
}
