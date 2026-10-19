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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Send, Bot, Sparkles, User, Zap } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

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

const QUICK_PROMPTS = [
  'Why does she double-text so much?',
  'Craft a witty reply to keep the banter alive',
  'Is this just friendly sparring or actual feelings?',
];

export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

    // Simulate intelligent coach reply grounded in their dynamic
    setTimeout(() => {
      let replyText = "Based on her 6,481 double texts and 0.5m response speed, she's not just replying—she's camping in your DMs. Keep the playful sparring going without over-investing.";
      if (text.toLowerCase().includes('double-text')) {
        replyText = "She's sent 6,481 double texts! That's not breadcrumbing; that's a whole bakery. She uses rapid texts as an attention hook because she knows you respond in under 30 seconds.";
      } else if (text.toLowerCase().includes('witty') || text.toLowerCase().includes('reply')) {
        replyText = "Calibrated Reply:\n'If you double-text any faster, WhatsApp is going to charge you an overtime fee 😂.'\n\nPsychological Rationale: Teases her habit while maintaining high-value playful dominance.";
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Bot size={20} color={Colors.accentYellow} />
              <Text style={styles.headerTitle}>DOCTOR ASSIFY</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Tactical Conversational Wingman • Unhinged Mode
            </Text>
          </View>
        </View>

        {/* Quick Prompts */}
        <View style={styles.quickPromptContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptList}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.promptChip}
                onPress={() => sendMessage(prompt)}>
                <Zap size={12} color={Colors.accentYellow} />
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Stream */}
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <View
                key={m.id}
                style={[styles.messageBubbleRow, isUser ? styles.userRow : styles.coachRow]}>
                {!isUser ? (
                  <View style={styles.avatarBot}>
                    <Sparkles size={14} color="#08090E" />
                  </View>
                ) : null}
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.coachBubble,
                  ]}>
                  <Text style={[styles.messageText, isUser && styles.userMessageText]}>
                    {m.text}
                  </Text>
                </View>
              </View>
            );
          })}
          {isTyping ? (
            <View style={styles.typingRow}>
              <View style={styles.avatarBot}>
                <Sparkles size={14} color="#08090E" />
              </View>
              <View style={[styles.messageBubble, styles.coachBubble]}>
                <Text style={styles.typingText}>Analyzing conversational subtext...</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask Doctor Assify anything..."
            placeholderTextColor={Colors.textTertiary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            disabled={!input.trim()}
            onPress={() => sendMessage()}>
            <Send size={16} color={input.trim() ? '#08090E' : Colors.textTertiary} />
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quickPromptContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  promptList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  promptText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    gap: 14,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  coachRow: {
    justifyContent: 'flex-start',
  },
  avatarBot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accentYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: Colors.accentYellow,
    borderBottomRightRadius: 4,
  },
  coachBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#08090E',
    fontWeight: '600',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 21,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.accentYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.surfaceElevated,
  },
});
