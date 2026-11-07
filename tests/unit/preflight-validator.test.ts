import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateChatText } from '../../src/core/ingestion/preflight-validator.ts';

test('validateChatText - succeeds with valid iOS chat log', () => {
  const content = fs.readFileSync('tests/fixtures/valid_ios.txt', 'utf8');
  const result = validateChatText(content);
  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.summary.participants, ['Alex', 'Jordan']);
    assert.ok(result.summary.messageCount >= 30);
    assert.ok(result.summary.cleanedChatText.length > 0);
    assert.ok(!result.summary.cleanedChatText.includes('<Media omitted>'));
  }
});

test('validateChatText - succeeds with valid Android chat log', () => {
  const content = fs.readFileSync('tests/fixtures/valid_android.txt', 'utf8');
  const result = validateChatText(content);
  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.summary.participants, ['Sam', 'Taylor']);
    assert.ok(result.summary.messageCount >= 30);
  }
});

test('validateChatText - rejects group chat with INVALID_PARTICIPANT_COUNT', () => {
  const content = fs.readFileSync('tests/fixtures/invalid_group.txt', 'utf8');
  const result = validateChatText(content);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.reason, 'INVALID_PARTICIPANT_COUNT');
    assert.equal(result.participantCount, 3);
  }
});

test('validateChatText - rejects chat with fewer than 30 messages with TOO_FEW_MESSAGES', () => {
  const content = fs.readFileSync('tests/fixtures/invalid_too_few.txt', 'utf8');
  const result = validateChatText(content);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.reason, 'TOO_FEW_MESSAGES');
    assert.ok(result.rawCount !== undefined && result.rawCount < 30);
  }
});

test('validateChatText - rejects empty file with EMPTY_OR_UNREADABLE', () => {
  const result = validateChatText('   \n  ');
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.reason, 'EMPTY_OR_UNREADABLE');
  }
});
