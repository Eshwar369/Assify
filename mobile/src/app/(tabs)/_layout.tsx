import React from 'react';
import { Tabs } from 'expo-router';
import { Flame, Sparkles, MessageSquareQuote, GitCommit } from 'lucide-react-native';
import { Colors } from '../../constants/theme';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accentYellow,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderSubtle,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.4,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profiler',
          tabBarIcon: ({ color, size }) => <Flame color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="keep"
        options={{
          title: 'The Keep',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ color, size }) => <MessageSquareQuote color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color, size }) => <GitCommit color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}
