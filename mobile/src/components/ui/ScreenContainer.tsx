import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  RefreshControlProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useTabBar } from '@/context/TabBarContext';

export interface ScreenContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  header,
  scrollable = true,
  refreshControl,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const { handleScroll } = useTabBar();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.desktopCanvas, style]}>
        {/* Fixed Top Header (if provided) */}
        {header}

        {/* Scrollable vs Static Content */}
        {scrollable ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, contentContainerStyle]}>
            {children}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  desktopCanvas: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: Colors.background,
    ...Platform.select({
      web: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.borderHairline,
        minHeight: '100vh',
      } as any,
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: 16,
    paddingBottom: 110,
  },
  staticContent: {
    flex: 1,
  },
});
