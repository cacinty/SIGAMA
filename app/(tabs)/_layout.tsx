import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="laporan"
        options={{
          title: 'Laporan Kerusakan',
          tabBarIcon: ({ color }) => <IconSymbol size={20}
            name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gmap"
        options={{
          title: 'Peta Kerusakan',
          tabBarIcon: ({ color }) => <IconSymbol
            size={20}
            name="map.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
