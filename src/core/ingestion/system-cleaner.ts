/**
 * Assify System Notice Cleaner
 * Identifies and strips system operational messages (encryption notices, media omitted, etc.)
 */

const SYSTEM_PATTERNS: RegExp[] = [
  /^Messages and calls are end-to-end encrypted/i,
  /^<Media omitted>$/i,
  /^\[(?:image|video|audio|sticker|document) omitted\]$/i,
  /^This message was deleted$/i,
  /^You deleted this message$/i,
  /^Missed (?:voice|video) call$/i,
  /^\u200E?Messages to this chat and calls are now secured/i,
  /^\u200E?Disappearing messages/i,
];

export function isSystemNotice(text: string): boolean {
  if (!text) return true;
  const cleaned = text.trim();
  return SYSTEM_PATTERNS.some((pattern) => pattern.test(cleaned));
}
