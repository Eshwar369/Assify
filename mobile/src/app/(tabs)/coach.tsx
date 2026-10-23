import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Send,
  Bot,
  Sparkles,
  Zap,
  Copy,
  Check,
  Shield,
  Flame,
  ArrowRight,
  MessageSquare,
} from 'lucide-react-native';

import { Colors, Radius, Typography, Spacing } from '@/constants/theme';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppleElevatedCard } from '@/components/ui/AppleElevatedCard';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

interface GhostReplyOption {
  id: string;
  category: string;
  title: string;
  replyText: string;
  strategy: string;
  toneTag: string;
  toneColor: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'coach',
    text: "Doctor Delulu online. I have full memory of your 14,821 messages, your 81% initiation ratio, and that 4-hour reply lag. What conversational crisis are we breaking down today?",
    timestamp: 'Just now',
  },
];

const DEFAULT_TRIAD: GhostReplyOption[] = [
  {
    id: 'opt-1',
    category: 'THE MIRROR',
    title: 'High-Value Stoic',
    replyText: 'Sounds good, let me know when you figure out your schedule.',
    strategy:
      'Matches her exact low-investment energy. Zero exclamation marks, zero desperation. Refuses to chase.',
    toneTag: 'FRAME CONTROL',
    toneColor: Colors.textPrimary,
  },
  {
    id: 'opt-2',
    category: 'THE DISRUPTOR',
    title: 'Playful Defuser',
    replyText: 'Careful, if you take any longer to reply WhatsApp is going to archive our chat for inactivity 😂',
    strategy:
      'Humorously calls out the 6-hour delay while keeping the dynamic light, teasing, and flirty.',
    toneTag: 'WITTY BANTER',
    toneColor: Colors.accentRose,
  },
  {
    id: 'opt-3',
    category: 'THE CLOSE',
    title: 'Decisive Cut-Through',
    replyText: 'Too busy for a 3-day text exchange. I’m grabbing drinks tomorrow at 8 — join me or stay a myth.',
    strategy:
      'Bypasses endless messaging banter and tests immediate romantic compliance in the real world.',
    toneTag: 'HIGH EQ CLOSE',
    toneColor: Colors.accentGold,
  },
];

const QUICK_PROMPTS = [
  'Why did she switch from 4m to 6h delay?',
  'Am I being breadcrumbed or actually busy?',
  'How do I regain leverage without playing games?',
  'Analyze her last voice note for subtext',
];

export default function CoachScreen() {
  const [activeTab, setActiveTab] = useState<'coach' | 'ghost'>('coach');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Ghost Writer state
  const [receivedText, setReceivedText] = useState('');
  const [triadOptions, setTriadOptions] = useState<GhostReplyOption[]>(DEFAULT_TRIAD);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollViewRef = useRef<any>(null);

  const handleTabSwitch = (tab: 'coach' | 'ghost') => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    setActiveTab(tab);
  };

  const handleSendCoach = () => {
    if (!inputMessage.trim()) return;

    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      if (Platform.OS !== 'web') {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // Haptics fallback
        }
      }
      setIsTyping(false);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: `Here is the raw truth: You are over-indexing on her recent latency. When a contact takes 4+ hours, sending an immediate follow-up lowers your perceived value by 40%. The tactical move is to hold your ground and let the silence breathe.`,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1100);
  };

  const handleCopyReply = (opt: GhostReplyOption) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics fallback
      }
    }
    setCopiedId(opt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateGhost = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Haptics fallback
      }
    }

    const customText = receivedText.trim();
    if (customText) {
      setTriadOptions([
        {
          id: 'opt-gen-1',
          category: 'THE MIRROR',
          title: 'Frame Equalizer',
          replyText: `Got it. Let me know when you are free next week.`,
          strategy: `In response to "${customText.slice(0, 30)}...": Matches coldness with respectful detachment.`,
          toneTag: 'STOIC DETACHMENT',
          toneColor: Colors.textPrimary,
        },
        {
          id: 'opt-gen-2',
          category: 'THE DISRUPTOR',
          title: 'Playful Subversion',
          replyText: `That sounds like an excuse someone with terrible taste in cocktails would make 😂`,
          strategy: 'Re-establishes playful frame dominance instead of apologizing or begging.',
          toneTag: 'TEASING BANTER',
          toneColor: Colors.accentRose,
        },
        {
          id: 'opt-gen-3',
          category: 'THE CLOSE',
          title: 'Decisive Pivot',
          replyText: `Let's skip the 20-question texting game. Grab dinner Thursday at 7:30?`,
          strategy: 'Forces binary clarity: either she accepts a real-world date or you save your time.',
          toneTag: 'HIGH EQ CLOSE',
          toneColor: Colors.accentGold,
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.desktopCanvas}>
        <AppHeader
          title="Tactics"
          subtitle="Doctor Delulu & Ghost Writer"
          activePartner="Sarah"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          {/* Segmented Switcher Pill */}
          <View style={styles.switcherContainer}>
            <View style={styles.switcherPill}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleTabSwitch('coach')}
                style={[
                  styles.switcherTab,
                  activeTab === 'coach' && styles.switcherTabActive,
                ]}
              >
                <Bot
                  size={14}
                  color={activeTab === 'coach' ? Colors.textPrimary : Colors.textTertiary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.switcherText,
                    activeTab === 'coach' && styles.switcherTextActive,
                  ]}
                >
                  Doctor Delulu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleTabSwitch('ghost')}
                style={[
                  styles.switcherTab,
                  activeTab === 'ghost' && styles.switcherTabActive,
                ]}
              >
                <Zap
                  size={14}
                  color={activeTab === 'ghost' ? Colors.textPrimary : Colors.textTertiary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.switcherText,
                    activeTab === 'ghost' && styles.switcherTextActive,
                  ]}
                >
                  Ghost Writer
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TAB 1: DOCTOR DELULU INTERACTIVE CHAT */}
          {activeTab === 'coach' ? (
            <View style={styles.tabContent}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.chatScroll}
                contentContainerStyle={styles.chatScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Active Tension Card */}
                <View style={styles.tensionCard}>
                  <View style={styles.tensionBadge}>
                    <Shield size={12} color={Colors.accentGold} style={{ marginRight: 4 }} />
                    <Text style={styles.tensionBadgeText}>CURRENT ACTIVE CONTEXT</Text>
                  </View>
                  <Text style={styles.tensionTitle}>4-Hour Response Lag Detected</Text>
                  <Text style={styles.tensionSub}>
                    Sarah's response latency increased by 180% since 10:00 PM. Frame vulnerability high.
                  </Text>
                </View>

                {/* Chat Bubbles */}
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageRow,
                        isUser ? styles.messageRowUser : styles.messageRowCoach,
                      ]}
                    >
                      {!isUser && (
                        <View style={styles.coachAvatar}>
                          <Bot size={15} color={Colors.accentGold} />
                        </View>
                      )}

                      <View
                        style={[
                          styles.bubble,
                          isUser ? styles.userBubble : styles.coachBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.bubbleText,
                            isUser ? styles.userBubbleText : styles.coachBubbleText,
                          ]}
                        >
                          {msg.text}
                        </Text>
                        <Text
                          style={[
                            styles.bubbleTimestamp,
                            isUser ? styles.userTimestamp : styles.coachTimestamp,
                          ]}
                        >
                          {msg.timestamp}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {isTyping && (
                  <View style={[styles.messageRow, styles.messageRowCoach]}>
                    <View style={styles.coachAvatar}>
                      <Bot size={15} color={Colors.accentGold} />
                    </View>
                    <View style={[styles.bubble, styles.coachBubble, styles.typingBubble]}>
                      <Text style={styles.typingText}>Doctor Delulu is analyzing subtext...</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Quick Prompt Suggestions */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickPromptsScroll}
                contentContainerStyle={styles.quickPromptsContent}
              >
                {QUICK_PROMPTS.map((prompt, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => setInputMessage(prompt)}
                    style={styles.promptPill}
                  >
                    <Sparkles size={11} color={Colors.accentGold} style={{ marginRight: 5 }} />
                    <Text style={styles.promptText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Message Input Bar */}
              <View style={styles.inputContainer}>
                <TextInput
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Ask Doctor Delulu what to say..."
                  placeholderTextColor={Colors.textTertiary}
                  style={styles.textInput}
                  multiline
                  onSubmitEditing={handleSendCoach}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSendCoach}
                  disabled={!inputMessage.trim()}
                  style={[
                    styles.sendButton,
                    inputMessage.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
                  ]}
                >
                  <Send
                    size={16}
                    color={inputMessage.trim() ? Colors.textInverted : Colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* TAB 2: GHOST WRITER REPLY TRIAD */
            <ScrollView
              style={styles.tabContent}
              contentContainerStyle={styles.ghostScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Context Input Card */}
              <AppleElevatedCard style={styles.ghostInputCard}>
                <Text style={styles.ghostInputLabel}>CONFUSING MESSAGE RECEIVED</Text>
                <TextInput
                  value={receivedText}
                  onChangeText={setReceivedText}
                  placeholder="Paste what she just sent you (e.g. 'Haha yeah maybe next week!')..."
                  placeholderTextColor={Colors.textTertiary}
                  style={styles.ghostTextInput}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleGenerateGhost}
                  style={styles.calibrateButton}
                >
                  <Sparkles size={14} color={Colors.textInverted} style={{ marginRight: 6 }} />
                  <Text style={styles.calibrateButtonText}>Generate Calibrated Triad</Text>
                </TouchableOpacity>
              </AppleElevatedCard>

              {/* Triad Options Feed */}
              <Text style={styles.triadSectionTitle}>CALIBRATED TACTICAL REPLIES</Text>

              {triadOptions.map((opt) => {
                const isCopied = copiedId === opt.id;
                return (
                  <AppleElevatedCard key={opt.id} style={styles.triadCard}>
                    <View style={styles.triadHeader}>
                      <View style={styles.triadTagRow}>
                        <View style={styles.toneBadge}>
                          <Text style={styles.toneBadgeText}>{opt.toneTag}</Text>
                        </View>
                        <Text style={styles.triadCategory}>{opt.category}</Text>
                      </View>
                      <Text style={styles.triadTitle}>{opt.title}</Text>
                    </View>

                    {/* Quotation text */}
                    <View style={styles.replyBox}>
                      <Text style={styles.replyQuote}>"{opt.replyText}"</Text>
                    </View>

                    {/* Tactical Strategy */}
                    <Text style={styles.strategyText}>{opt.strategy}</Text>

                    {/* Action Footer */}
                    <View style={styles.triadFooter}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => handleCopyReply(opt)}
                        style={[
                          styles.copyButton,
                          isCopied && styles.copyButtonDone,
                        ]}
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} color={Colors.systemGreen} style={{ marginRight: 6 }} />
                            <Text style={[styles.copyButtonText, { color: Colors.systemGreen }]}>
                              Copied to Clipboard
                            </Text>
                          </>
                        ) : (
                          <>
                            <Copy size={14} color={Colors.textPrimary} style={{ marginRight: 6 }} />
                            <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </AppleElevatedCard>
                );
              })}
            </ScrollView>
          )}
        </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  switcherContainer: {
    paddingHorizontal: Spacing.screenGutter,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderHairline,
  },
  switcherPill: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  switcherTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  switcherTabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
      } as any,
    }),
  },
  switcherText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textTertiary,
  },
  switcherTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tensionCard: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  tensionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tensionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.accentGold,
  },
  tensionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  tensionSub: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textTertiary,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowCoach: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userBubble: {
    backgroundColor: Colors.textPrimary,
    borderBottomRightRadius: Radius.xs,
  },
  coachBubble: {
    backgroundColor: Colors.secondaryBackground,
    borderBottomLeftRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    flex: 1,
  },
  userBubbleText: {
    fontSize: 15,
    lineHeight: 21,
    color: Colors.textInverted,
  },
  coachBubbleText: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  bubbleTimestamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.50)',
  },
  coachTimestamp: {
    color: Colors.textTertiary,
  },
  typingBubble: {
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textTertiary,
  },
  quickPromptsScroll: {
    maxHeight: 44,
  },
  quickPromptsContent: {
    paddingHorizontal: Spacing.screenGutter,
    gap: 8,
    alignItems: 'center',
  },
  promptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  promptText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenGutter,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderHairline,
    marginBottom: Platform.OS === 'web' ? 80 : 70,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.textPrimary,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondaryBackground,
  },
  ghostScrollContent: {
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: 16,
    paddingBottom: 110,
  },
  ghostInputCard: {
    padding: 18,
    marginBottom: 24,
  },
  ghostInputLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  ghostTextInput: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  calibrateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.md,
    paddingVertical: 12,
  },
  calibrateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverted,
  },
  triadSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textTertiary,
    marginBottom: 12,
    marginLeft: 4,
  },
  triadCard: {
    padding: 20,
    marginBottom: 16,
  },
  triadHeader: {
    marginBottom: 12,
  },
  triadTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  toneBadge: {
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  toneBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textPrimary,
  },
  triadCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  triadTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  replyBox: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  replyQuote: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  strategyText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textTertiary,
    marginBottom: 16,
  },
  triadFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderHairline,
    paddingTop: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    paddingVertical: 10,
  },
  copyButtonDone: {
    backgroundColor: 'rgba(52, 199, 89, 0.10)',
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
