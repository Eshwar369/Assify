# Idea Intake: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Slug**: chat-ingestion-preflight
- **Created**: 2026-11-07
- **Source**: pasted text
- **Type**: new-capability

## Idea (as captured)

> "so now we are creating a basic 
>            WhatsApp Export (.txt / .zip)
>                                │
>                ┌───────────────┴───────────────┐
>                ▼ (OS Share Sheet)              ▼ (In-App Drop)
>         [Biometric Gate]                [Biometric Gate]
>                │                               │
>                └───────────────┬───────────────┘
>                                ▼
>                  [Pre-Flight Validation Engine]
>                  • N == 2 human participants
>                  • ≥ 30 conversational messages
>                  • System noise filtered
>                                │"

## Restated

Implement the foundational intake and validation pipeline of Assify, accepting WhatsApp chat exports (.txt / .zip) via both OS Share Sheet and in-app file drop, protected by a local biometric authentication gate, and verified through a pre-flight validation engine that enforces strict 2-participant boundaries, a 30-message volume threshold, and system noise scrubbing.

## Origin & Context

- **Raised by**: Project Lead / User
- **Trigger**: Starting execution on the core Assify intake pipeline from first principles, establishing the entry gates and data validation foundation before downstream telemetry and analysis.

## First-Glance Unknowns

- [NEEDS CLARIFICATION: Which native Share Sheet receivers and file-picker libraries are targeted for Expo (e.g. expo-sharing, expo-document-picker, or custom native intent filters)?]
- [NEEDS CLARIFICATION: How should biometric authentication cancellations or failures during OS Share Sheet intents be handled (e.g., abort silently vs. redirect to an in-app lock screen)?]
- [NEEDS CLARIFICATION: What are the exact rejection dialogs and user recovery paths when a chat fails validation (e.g., N > 2 group chat vs. < 30 messages volume)?]
- [NEEDS CLARIFICATION: Which specific regex patterns and localized system notices must be scrubbed (e.g., encryption notices, media omitted, deleted messages across English and regional WhatsApp formats)?]

