import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Compass, Bot, TrendingUp, Bookmark } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { TabBarProvider, useTabBar } from '@/context/TabBarContext';

function TabsLayoutInner() {
  const { isTabBarVisible } = useTabBar();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isTabBarVisible ? 0 : 100,
      damping: 20,
      stiffness: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isTabBarVisible]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarBackground: () => (
          <View style={styles.dockWrapper}>
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={80}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
            ) : Platform.OS === 'web' ? (
              <View style={[StyleSheet.absoluteFill, styles.webDockBg]} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidDockBg]} />
            )}
            <View style={styles.topHairline} />
          </View>
        ),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 84 : Platform.OS === 'web' ? 64 : 60,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          transform: [{ translateY }] as any,
          ...(Platform.OS === 'web'
            ? {
                left: 0,
                right: 0,
                maxWidth: 420,
                marginHorizontal: 'auto',
                bottom: 16,
                borderRadius: 32,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: Colors.borderCard,
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
                transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              }
            : {}),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Radar',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Compass
                color={focused ? Colors.textPrimary : color}
                size={20}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
          },
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Bot
                color={focused ? Colors.textPrimary : color}
                size={20}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
          },
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Fever',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <TrendingUp
                color={focused ? Colors.textPrimary : color}
                size={20}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
          },
        }}
      />
      <Tabs.Screen
        name="keep"
        options={{
          title: 'Keep',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Bookmark
                color={focused ? Colors.textPrimary : color}
                size={20}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
          },
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <TabBarProvider>
      <TabsLayoutInner />
    </TabBarProvider>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          borderRadius: 32,
        }
      : {}),
  },
  webDockBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
  } as any,
  androidDockBg: {
    backgroundColor: '#FFFFFF',
  },
  topHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.borderHairline,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: Colors.secondaryBackground,
  },
});
