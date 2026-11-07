import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLine, isSystemNotice } from '../../src/core/ingestion/line-parser.ts';

test('parseLine - iOS bracketed format', () => {
  const line = '[12/04/24, 18:31:00] Alex: Hey Jordan, how was your weekend?';
  const result = parseLine(line);
  assert.ok(result);
  assert.equal(result.sender, 'Alex');
  assert.equal(result.message, 'Hey Jordan, how was your weekend?');
  assert.equal(result.isSystem, false);
});

test('parseLine - Android hyphen format', () => {
  const line = '4/12/24, 6:31 PM - Sam: Hey Taylor, are you free this evening?';
  const result = parseLine(line);
  assert.ok(result);
  assert.equal(result.sender, 'Sam');
  assert.equal(result.message, 'Hey Taylor, are you free this evening?');
  assert.equal(result.isSystem, false);
});

test('parseLine - System notice without sender', () => {
  const line = '4/12/24, 6:30 PM - Messages and calls are end-to-end encrypted.';
  const result = parseLine(line);
  assert.ok(result);
  assert.equal(result.isSystem, true);
});

test('isSystemNotice - detects media omitted and encryption notices', () => {
  assert.equal(isSystemNotice('<Media omitted>'), true);
  assert.equal(isSystemNotice('Messages and calls are end-to-end encrypted.'), true);
  assert.equal(isSystemNotice('This message was deleted'), true);
  assert.equal(isSystemNotice('Hey are we meeting today?'), false);
});
