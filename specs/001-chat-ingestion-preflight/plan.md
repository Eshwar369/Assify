# Implementation Plan: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

**Branch**: `001-chat-ingestion-preflight` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-chat-ingestion-preflight/spec.md`

## Summary

Build the foundational intake and validation engine for Assify to parse WhatsApp `.txt` and `.zip` chat exports directly in-memory, enforcing strict 1-on-1 participant boundaries ($N = 2$) and minimum message volume ($\ge 30$). The engine scrubs system notices, computes lightweight summary chronemics (reply latency and double-text counts) in a single pass, extracts a clean transcript string, and blocks invalid exports with a clean native modal alert. In accordance with user directives, biometric authentication is omitted, and no heavy per-message database entities are created.

## Technical Context

**Language/Version**: TypeScript 5.x / ES2022  
**Target Platform**: React Native 0.76+ / Expo SDK 52+ (iOS & Android)  
**Primary Dependencies**: `jszip` (in-memory zip decompression), `react-native` (native alert dialogs)  
**Storage**: None (in-memory processing only; zero raw chat persistence during ingestion)  
**Testing**: Jest / Vitest (unit, contract, and fixture tests)  
**Project Type**: Mobile Application Core Domain Service  
**Performance Goals**: Parse 1,000 messages in <500ms; memory footprint <30MB peak transient RAM for 25,000 messages  
**Constraints**: Zero cloud leakage, 100% offline, zero disk storage of media files from `.zip` archives  

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| **I. Architectural Integrity & Model Primacy** | PASS | Canonical `ParsedChatSummary` domain interface defines the single source of truth. |
| **II. Component-First Law** | PASS | Rejection feedback utilizes native system alert dialogs without screen-level bespoke drift. |
| **III. Anti-Slop Enforcement** | PASS | No card-wrapping or wireframe borders; pure native system alert on rejection. |
| **IV. Mandatory Skill-First Protocol** | PASS | Followed `brainstorming`, `speckit-specify`, and `speckit-plan` workflows. |
| **V. Test-Driven Development (TDD)** | PASS | Fixture-based test suite defined in `quickstart.md`; red-green-refactor cycle planned. |
| **VI. Privacy-First Local Forensics** | PASS | 100% offline local parsing. In-memory ZIP parsing purges all media without disk writes. |
| **VII. Core Philosophies (KISS / DRY / YAGNI)** | PASS | Eliminated heavy database rows; simplified ingestion to a fast, single-pass summary parser. |
| **VIII. SOLID Principles** | PASS | `IChatIngestionService` segregated; single responsibility per parser function. |

## Project Structure

### Documentation (this feature)

```text
specs/001-chat-ingestion-preflight/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (architectural decisions)
├── data-model.md        # Phase 1 output (domain types & lifecycle)
├── quickstart.md        # Phase 1 output (verification & test guide)
├── contracts/           # Phase 1 output (domain interface definitions)
│   └── ingestion-parser.ts
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code Layout

```text
src/
├── core/
│   ├── ingestion/
│   │   ├── types.ts                   # Domain types & interfaces
│   │   ├── line-parser.ts             # Regex timestamp & sender extraction
│   │   ├── system-cleaner.ts          # Media omitted & encryption notice scrubbing
│   │   ├── chronemics-accumulator.ts  # Single-pass response latency & double-text counter
│   │   ├── zip-extractor.ts           # In-memory _chat.txt extraction via jszip
│   │   └── ingestion-service.ts       # Unified IChatIngestionService coordinator
│   └── index.ts
└── ui/
    └── alerts/
        └── rejection-dialog.ts        # Native HIG rejection dialog helper

tests/
├── fixtures/
│   ├── valid_chat_ios.txt
│   ├── valid_chat_android.txt
│   ├── invalid_group_chat.txt
│   └── invalid_too_few_messages.txt
├── unit/
│   ├── line-parser.test.ts
│   ├── system-cleaner.test.ts
│   └── chronemics-accumulator.test.ts
└── contract/
    └── ingestion-service.test.ts
```

## Complexity Tracking

| Issue / Decision | Alternative Considered | Why Chosen |
|---|---|---|
| Single-pass summary vs. Per-message DB table | SQLite / WatermelonDB storing every line | Per user directive and KISS: downstream diagnostic only needs summary metrics and cleaned text. |
| In-memory ZIP buffer parsing | Disk-based unzipper (`react-native-zip-archive`) | Protects privacy: zero media files (photos, audio) ever touch physical disk storage. |
| Native modal alert for rejection | Custom rejection screen component | Adheres to Apple HIG and avoids unnecessary screen navigation boilerplate. |
