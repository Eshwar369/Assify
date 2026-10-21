import React, { useState } from 'react';
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
  Share,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Send,
  Bot,
  Sparkles,
  User,
  Flame,
  Brain,
  Ghost,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { Colors, Radius, Typography } from '../../constants/theme';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'coach',
    text: "I am Doctor Assify. I have full forensic memory of your 39,154 messages with Sleepless Zombiee, her 6,481 double texts, and that 0.5-minute response speed. What are we strategizing today?",
    timestamp: 'Just now',
  },
];

const GHOST_TRIAD = [
  {
    title: '⚡ RIZZ / WITTY',
    text: "Careful, if you double-text any faster WhatsApp is going to charge you an overtime fee 😂",
    rationale: 'Teases her rapid-fire habit while maintaining high-value playful dominance.',
  },
  {
    title: '🛡️ THE CALM ANCHOR',
    text: "Sounds good, let me know by 7 so I can lock in my dinner plans.",
    rationale: 'Draws a clear boundary without passive aggression.',
  },
  {
    title: '🔥 UNHINGED ROAST',
    text: "Are you practicing for the DM Olympics or do you just miss me that much?",
    rationale: 'Directly calls out the romantic denial with zero shame.',
  },
];

const QUICK_PROMPTS = [
  'Why does she double-text so much?',
  'Craft a witty reply to keep the banter alive',
  'Is this just friendly sparring or actual feelings?',
];

export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [vibeMode, setVibeMode] = useState<'therapy' | 'unhinged'>('unhinged');
  const [showGhostWriter, setShowGhostWriter] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      if (vibeMode === 'unhinged') {
        if (text.toLowerCase().includes('double-text')) {
          replyText =
            "She's sent 6,481 double texts! That's not breadcrumbing; that's an industrial bakery. She treats your DM like a live stream chat. Do not reply instantly—let her stew for 15 minutes.";
        } else if (text.toLowerCase().includes('witty') || text.toLowerCase().includes('reply')) {
          replyText =
            "Unhinged Calibration:\n'If texting were an Olympic sport, you'd already have 3 gold medals and a sponsorship deal 🥇.'\n\nPsychological Roast: Teases her addiction while keeping your frame untouchable.";
        } else {
          replyText =
            "Look, you two have been circling each other across 39,000 texts like two stubborn cats. Either confess your feelings or accept that you're full-time sparring partners in the Delulu Coliseum.";
        }
      } else {
        if (text.toLowerCase().includes('double-text')) {
          replyText =
            "Her high double-text volume (6,481 instances) stems from an anxious-leaning communication style. She uses rapid messaging to secure connection reassurance. Respond with warm consistency rather than withdrawal.";
        } else if (text.toLowerCase().includes('witty') || text.toLowerCase().includes('reply')) {
          replyText =
            "Therapy Calibration:\n'Always enjoy our banter, but take your time—no rush at all!'\n\nTherapeutic Rationale: Creates a safe emotional space that relieves attachment anxiety.";
        } else {
          replyText =
            "Healthy relationships require mutual clarity. When you both rely heavily on humor to shield vulnerability, emotional growth stalls. Consider having an honest conversation outside of WhatsApp.";
        }
      }

      const coachMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: replyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCopyTriad = async (text: string, index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
    try {
      await Share.share({ message: text });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Apple Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Bot size={20} color={Colors.systemBlue} />
              <Text style={styles.headerTitle}>Doctor Assify</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Tactical Relationship Wingman • 39k Texts Grounding
            </Text>
          </View>

          {/* Apple Segmented Toggle */}
          <View style={styles.vibeToggle}>
            <TouchableOpacity
              onPress={() => setVibeMode('therapy')}
              style={[
                styles.vibeBtn,
                vibeMode === 'therapy' && styles.vibeBtnActiveTherapy,
              ]}>
              <Brain
                size={13}
                color={vibeMode === 'therapy' ? '#FFFFFF' : Colors.systemGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVibeMode('unhinged')}
              style={[
                styles.vibeBtn,
                vibeMode === 'unhinged' && styles.vibeBtnActiveUnhinged,
              ]}>
              <Flame
                size={13}
                color={vibeMode === 'unhinged' ? '#FFFFFF' : Colors.systemGray}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ghost Writer Dropdown Drawer Banner */}
        <TouchableOpacity
          style={styles.ghostBanner}
          activeOpacity={0.82}
          onPress={() => setShowGhostWriter(!showGhostWriter)}>
          <View style={styles.ghostBannerLeft}>
            <Ghost size={15} color={Colors.systemBlue} />
            <Text style={styles.ghostBannerText}>GHOST WRITER: 3-REPLY CALIBRATOR</Text>
          </View>
          {showGhostWriter ? (
            <ChevronUp size={16} color={Colors.systemGray} />
          ) : (
            <ChevronDown size={16} color={Colors.systemGray} />
          )}
        </TouchableOpacity>

        {/* Ghost Writer Triad Cards */}
        {showGhostWriter ? (
          <View style={styles.ghostDrawer}>
            {GHOST_TRIAD.map((item, idx) => (
              <View key={idx} style={styles.triadCard}>
                <View style={styles.triadHeader}>
                  <Text style={styles.triadTitle}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => handleCopyTriad(item.text, idx)}>
                    <Copy size={11} color="#FFFFFF" />
                    <Text style={styles.copyBtnText}>
                      {copiedIndex === idx ? 'COPIED' : 'COPY'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.triadText}>"{item.text}"</Text>
                <Text style={styles.triadRationale}>{item.rationale}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Messages Stream */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isCoach ? styles.coachRow : styles.userRow,
                ]}>
                {isCoach ? (
                  <View style={styles.coachAvatar}>
                    <Bot size={13} color="#FFFFFF" />
                  </View>
                ) : null}

                <View
                  style={[
                    styles.bubble,
                    isCoach ? styles.coachBubble : styles.userBubble,
                  ]}>
                  <Text
                    style={[
                      styles.bubbleText,
                      isCoach ? styles.coachText : styles.userText,
                    ]}>
                    {msg.text}
                  </Text>
                  <Text style={styles.timestamp}>{msg.timestamp}</Text>
                </View>

                {!isCoach ? (
                  <View style={styles.userAvatar}>
                    <User size={13} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>
            );
          })}

          {isTyping ? (
            <View style={[styles.messageRow, styles.coachRow]}>
              <View style={styles.coachAvatar}>
                <Bot size={13} color="#FFFFFF" />
              </View>
              <View style={[styles.bubble, styles.coachBubble, { paddingVertical: 10 }]}>
                <Text style={styles.typingIndicator}>Doctor Assify is calibrating...</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <View style={styles.quickPrompts}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.promptChip}
                activeOpacity={0.8}
                onPress={() => sendMessage(prompt)}>
                <Sparkles size={11} color={Colors.systemBlue} />
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Apple Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Doctor Assify anything..."
            placeholderTextColor={Colors.systemGray}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            disabled={!input.trim()}
            activeOpacity={0.8}
            onPress={() => sendMessage()}>
            <Send size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.glassBorder,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.systemGray,
    marginTop: 1,
  },
  vibeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120, 120, 128, 0.20)',
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  vibeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  vibeBtnActiveTherapy: {
    backgroundColor: Colors.systemBlue,
  },
  vibeBtnActiveUnhinged: {
    backgroundColor: Colors.systemPink,
  },
  ghostBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 122, 255, 0.2)',
  },
  ghostBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ghostBannerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Colors.systemBlue,
  },
  ghostDrawer: {
    backgroundColor: Colors.glassSurface,
    padding: 14,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.glassBorder,
  },
  triadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.lg,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  triadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  triadTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.systemBlue,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.systemBlue,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  copyBtnText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  triadText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  triadRationale: {
    fontSize: 11,
    color: Colors.systemGray,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  coachRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  coachAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.systemBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.systemPink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: Radius.xl,
  },
  coachBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.systemBlue,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  coachText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 10,
    color: Colors.systemGray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.systemGray,
  },
  quickPrompts: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 0.5,
    borderTopColor: Colors.glassBorder,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  promptText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.glassDock,
    borderTopWidth: 0.5,
    borderTopColor: Colors.glassBorder,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    maxHeight: 100,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.systemBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.35,
  },
});
