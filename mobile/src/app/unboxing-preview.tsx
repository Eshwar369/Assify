import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TheatricalUnboxing, UnboxingPayload } from '../components/unboxing';
import { Colors } from '../constants/theme';

const SAMPLE_PAYLOAD: UnboxingPayload = {
  contactName: 'Elena',
  deluluScore: 84,
  circusLevel: 'CIRCUS HEADLINER',
  archetype: 'The Olympic Paragraph Writer',
  verdictSummary:
    'You are investing emotional capital like an IPO into an avoidant stock that was delisted three months ago.',
  theTurningPoint: {
    date: 'October 14th, 11:42 PM',
    description:
      'Elena transitioned from synchronous 4-minute banter into an 18-hour latency freeze following your spontaneous weekend trip proposal.',
    pivotQuote:
      'Haha that sounds so fun, super busy with work rn though will let u know!!',
    gapShift: '4m → 18h Delay',
  },
  greatestHits: [
    {
      quote:
        'I know you are super overwhelmed with life right now but I just wanted to make sure you know I am always in your corner no matter what...',
      sender: 'user',
      timestamp: '2:47 AM',
      annotation:
        'Unsolicited 94-word vulnerability paragraph sent after 14 hours of radio silence.',
    },
    {
      quote: 'yeah totally haha crazy week',
      sender: 'contact',
      timestamp: 'Next Day, 4:18 PM',
      annotation:
        '5-word lowercase deflation response to your late-night emotional essay.',
    },
    {
      quote: 'Are we still on for tonight or should I make other plans? No pressure at all!!',
      sender: 'user',
      timestamp: 'Friday, 6:02 PM',
      annotation:
        'Classic double-exclamation passive surrender move with "no pressure" disclaimer.',
    },
  ],
  stats: {
    initiationUser: 81,
    initiationContact: 19,
    delayUser: '3m 12s',
    delayContact: '4h 48m',
  },
};

export default function UnboxingPreviewScreen() {
  const router = useRouter();
  const [sessionKey, setSessionKey] = useState(0);

  const handleRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSessionKey((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.desktopCanvas}>
        {/* Top Navigation */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Theatrical Unboxing</Text>

          <TouchableOpacity
            onPress={handleRestart}
            style={styles.restartBtn}
            accessibilityRole="button"
            accessibilityLabel="Re-run unboxing animation"
          >
            <RotateCcw size={16} color={Colors.accentRose} />
          </TouchableOpacity>
        </View>

        {/* Main Theatrical Unboxing Engine */}
        <TheatricalUnboxing
          key={`unboxing-session-${sessionKey}`}
          payload={SAMPLE_PAYLOAD}
          onFinish={() => router.back()}
          onViewFullDossier={() => router.push('/acts-modal')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  desktopCanvas: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: Colors.background,
    ...(Platform.OS === 'web'
      ? {
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: Colors.borderHairline,
        }
      : {}),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderHairline,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  restartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentRoseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
