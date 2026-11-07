import type { ValidationResult, ParsedChatSummary } from './types.ts';
import { parseLine } from './line-parser.ts';
import { ChronemicsAccumulator } from './chronemics-accumulator.ts';

const MIN_MESSAGE_THRESHOLD = 30;

function parseTimestamp(dateStr: string, timeStr: string): Date {
  // Support both 12h (6:31 PM) and 24h (18:31:00)
  // Split date by / - .
  const parts = dateStr.split(/[-/.]/);
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000;
  const p1 = parseInt(parts[0], 10);
  const p2 = parseInt(parts[1], 10);

  // Heuristic: if p1 > 12, p1 is day, p2 is month; otherwise default to month = p1, day = p2 or DD/MM based on common mobile
  let month = p1;
  let day = p2;
  if (p1 > 12) {
    day = p1;
    month = p2;
  }

  // Parse time
  const isPM = /PM/i.test(timeStr);
  const isAM = /AM/i.test(timeStr);
  const timeClean = timeStr.replace(/\s*[AP]M/i, '').trim();
  const timeParts = timeClean.split(':');
  let hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
}

export function validateChatText(rawText: string): ValidationResult {
  if (!rawText || !rawText.trim()) {
    return {
      success: false,
      reason: 'EMPTY_OR_UNREADABLE',
      message: 'The selected chat file is empty or cannot be read.',
    };
  }

  const lines = rawText.split(/\r?\n/);
  const participantSet = new Set<string>();
  const validMessages: Array<{ sender: string; time: Date; text: string }> = [];

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;

    if (!parsed.isSystem && parsed.sender) {
      participantSet.add(parsed.sender);
      const timestamp = parseTimestamp(parsed.dateStr, parsed.timeStr);
      validMessages.push({
        sender: parsed.sender,
        time: timestamp,
        text: parsed.message,
      });
    }
  }

  const participants = Array.from(participantSet);

  if (participants.length !== 2) {
    return {
      success: false,
      reason: 'INVALID_PARTICIPANT_COUNT',
      participantCount: participants.length,
      message: 'Assify requires a 1-on-1 conversation with at least 30 messages.',
    };
  }

  if (validMessages.length < MIN_MESSAGE_THRESHOLD) {
    return {
      success: false,
      reason: 'TOO_FEW_MESSAGES',
      rawCount: validMessages.length,
      message: 'Assify requires a 1-on-1 conversation with at least 30 messages.',
    };
  }

  const [user, partner] = participants;
  const accumulator = new ChronemicsAccumulator(user, partner);
  const cleanedTextParts: string[] = [];

  for (const msg of validMessages) {
    accumulator.addMessage(msg.sender, msg.time);
    cleanedTextParts.push(`${msg.sender}: ${msg.text}`);
  }

  const earliestTime = validMessages[0].time.toISOString();
  const latestTime = validMessages[validMessages.length - 1].time.toISOString();

  const summary: ParsedChatSummary = {
    participants: [user, partner],
    messageCount: validMessages.length,
    dateRange: {
      start: earliestTime,
      end: latestTime,
    },
    cleanedChatText: cleanedTextParts.join('\n'),
    metrics: accumulator.getMetrics(),
  };

  return {
    success: true,
    summary,
  };
}
