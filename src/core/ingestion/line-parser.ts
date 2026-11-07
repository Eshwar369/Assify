import type { RawParsedLine } from './types.ts';
import { isSystemNotice } from './system-cleaner.ts';

export { isSystemNotice };

// iOS format: [12/04/24, 18:31:00] Alex: Hello or [12/04/24, 6:31:00 PM] Alex: Hello
const IOS_MSG_REGEX = /^\[(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s+[AP]M)?)\]\s+([^:]+):\s+(.*)$/i;
// iOS system notice: [12/04/24, 18:30:15] Messages and calls are end-to-end encrypted...
const IOS_SYS_REGEX = /^\[(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s+[AP]M)?)\]\s+(.*)$/i;

// Android format: 4/12/24, 6:31 PM - Sam: Hello or 12/04/2024, 18:31 - Sam: Hello
const ANDROID_MSG_REGEX = /^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s+[AP]M)?)\s+-\s+([^:]+):\s+(.*)$/i;
// Android system notice: 4/12/24, 6:30 PM - Messages and calls are end-to-end encrypted...
const ANDROID_SYS_REGEX = /^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s+[AP]M)?)\s+-\s+(.*)$/i;

export function parseLine(line: string): RawParsedLine | null {
  if (!line || !line.trim()) return null;

  // Try iOS Message
  const iosMsgMatch = line.match(IOS_MSG_REGEX);
  if (iosMsgMatch) {
    const [, dateStr, timeStr, sender, message] = iosMsgMatch;
    return {
      dateStr,
      timeStr,
      sender: sender.trim(),
      message: message.trim(),
      isSystem: isSystemNotice(message),
    };
  }

  // Try Android Message
  const androidMsgMatch = line.match(ANDROID_MSG_REGEX);
  if (androidMsgMatch) {
    const [, dateStr, timeStr, sender, message] = androidMsgMatch;
    return {
      dateStr,
      timeStr,
      sender: sender.trim(),
      message: message.trim(),
      isSystem: isSystemNotice(message),
    };
  }

  // Try iOS System Notice
  const iosSysMatch = line.match(IOS_SYS_REGEX);
  if (iosSysMatch) {
    const [, dateStr, timeStr, message] = iosSysMatch;
    return {
      dateStr,
      timeStr,
      sender: '',
      message: message.trim(),
      isSystem: true,
    };
  }

  // Try Android System Notice
  const androidSysMatch = line.match(ANDROID_SYS_REGEX);
  if (androidSysMatch) {
    const [, dateStr, timeStr, message] = androidSysMatch;
    return {
      dateStr,
      timeStr,
      sender: '',
      message: message.trim(),
      isSystem: true,
    };
  }

  // Not a header line (multi-line message body continuation)
  return null;
}
