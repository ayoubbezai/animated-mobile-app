import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none', // Disable page transition animations
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="sessions" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
