import test from 'node:test';
import assert from 'node:assert/strict';
import { ChronemicsAccumulator } from '../../src/core/ingestion/chronemics-accumulator.ts';

test('ChronemicsAccumulator - computes reply speed and double texts', () => {
  const acc = new ChronemicsAccumulator('Alex', 'Jordan');

  // Alex sends message at 10:00
  acc.addMessage('Alex', new Date('2024-04-12T10:00:00Z'));
  // Alex sends double text at 10:10 (gap > 5m)
  acc.addMessage('Alex', new Date('2024-04-12T10:10:00Z'));
  // Jordan replies at 10:30 (response latency = 20m from last Alex msg)
  acc.addMessage('Jordan', new Date('2024-04-12T10:30:00Z'));
  // Alex replies at 10:35 (response latency = 5m from Jordan msg)
  acc.addMessage('Alex', new Date('2024-04-12T10:35:00Z'));

  const metrics = acc.getMetrics();
  assert.equal(metrics.userDoubleTexts, 1);
  assert.equal(metrics.partnerDoubleTexts, 0);
  assert.equal(metrics.partnerResponseTimeMins, 20);
  assert.equal(metrics.userResponseTimeMins, 5);
  assert.equal(metrics.userMessageCount, 3);
  assert.equal(metrics.partnerMessageCount, 1);
});
