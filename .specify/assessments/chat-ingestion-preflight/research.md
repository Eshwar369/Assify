# Idea Research: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Slug**: chat-ingestion-preflight
- **Created**: 2026-11-07
- **Evidence confidence (overall)**: high

## Users & Demand

- **High-friction WhatsApp export experience**: WhatsApp does not provide an official API for reading personal chat histories; users must manually tap "Export Chat" which generates unstructured plain text or media-packed ZIP files — [source: https://github.com/Pustur/whatsapp-chat-parser] (confidence: high)
- **Desire for relationship clarity & shareable receipts**: Dating-stage and situationship users frequently screenshot or export chats seeking external objective evaluation rather than subjective friend opinions — [source: requirements/00_base_requirements/MAIN_APP_REQUIREMENTS.md] (confidence: high)
- **Zero-barrier expectation**: Users expect instant parsing without having to manually select date formats or clean up attachment markers themselves — [source: ASSUMPTION] (confidence: medium)

## Prior Art

- **`Pustur/whatsapp-chat-parser` (JavaScript/TypeScript)**: The de facto standard open-source library for parsing WhatsApp chat exports in client-side JS and Node.js. It handles multi-line messages, splits dates using `/[-/.] ?/` across 14+ languages, and evaluates day vs. month order heuristically by inspecting numbers $> 12$. Proves that 100% in-memory client-side parsing without server transmission is fast, viable, and battle-tested — [source: https://github.com/Pustur/whatsapp-chat-parser]
- **`Chat-Analyzer` / `WhatStat` (Python / Data Science)**: CLI and desktop tools that parse WhatsApp exports into tabular DataFrames. They successfully extract reply latency, word counts, and emoji distributions, but historically suffer from heavy memory usage by instantiating complete object graphs for every message — [source: ASSUMPTION]
- **Web-based wrappers (`chattopdf.app`, `threadrecap.com`)**: Commercial tools that require users to upload chat exports to their servers, creating major privacy friction and liability. Proves strong user demand, but highlights the competitive advantage of Assify's 100% on-device private processing — [source: https://chattopdf.app]

## Market & Context

- **Privacy as a wedge**: Existing web chat analyzers require cloud uploads of deeply personal messages, which scares privacy-conscious users. Assify's local-only architecture is a decisive differentiator.
- **Alternative coping mechanisms**: Users currently copy-paste single messages into ChatGPT or screenshot messages for group chats, which loses all longitudinal telemetry (latency, double-text bursts, overtime trends).
- **Cost of doing nothing**: Without automated ingestion and validation, users would have to manually format or sanitize chats, leading to high drop-off before reaching the diagnostic engine.

## Data & Constraints

- **Platform Header Disparity**:
  - iOS export headers use brackets: `[DD/MM/YY, HH:MM:SS] Sender: Message`
  - Android export headers use hyphens: `DD/MM/YY, H:MM AM - Sender: Message`
  - Any single parser regex must handle both structures seamlessly.
- **Media Bloat in ZIPs**: Exporting "With Media" produces ZIPs with hundreds of megabytes of media. In-memory central directory scanning must isolate `_chat.txt` and drop media immediately to stay within mobile RAM limits (<30MB peak).
- **Minimum Volume Constraint**: Conversations with $< 30$ messages lack statistical significance for median response latency and behavioral archetypes.

## Evidence Against the Idea

- **Format Drift**: WhatsApp occasionally updates its export formatting or system string localization (e.g., changes to `<Media omitted>` or disappearing message notices), which can cause regex parsing failures if not properly guarded with unit regression tests.
- **Ambiguous Date Formats**: In short chats with dates like `03/04/24` where both numbers are $\le 12$, determining day vs. month without device locale context requires heuristic fallback or assuming standard regional conventions.
- **Multi-device Exports**: Exports from WhatsApp Web vs. iOS vs. Android can have subtle variation in whitespace and hidden Unicode markers (e.g. `\u200E` directional marks).

## Gaps & Open Questions

- Should Assify bundle the battle-tested `whatsapp-chat-parser` npm package directly, or maintain an in-house single-pass lightweight streaming engine to keep bundle size and memory minimal?
- How should the parser handle custom contact nicknames containing colons (`:`) or hyphens (`-`)?

## Sources

- https://github.com/Pustur/whatsapp-chat-parser (host: github.com, policy: allowlisted)
- https://www.npmjs.com/package/whatsapp-chat-parser (host: npmjs.com, policy: allowlisted)
- requirements/00_base_requirements/MAIN_APP_REQUIREMENTS.md (host: local repo)

