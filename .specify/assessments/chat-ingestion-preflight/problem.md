# Problem Definition: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Slug**: chat-ingestion-preflight
- **Created**: 2026-11-07
- **Inputs used**: intake.md, research.md

## Problem Statement

Users seeking objective forensic insights into their relationship dynamics are forced to rely on raw, unstructured WhatsApp chat exports that vary across operating systems, contain hundreds of megabytes of unwanted media, and frequently include invalid conversation structures (such as group chats or truncated snippets), causing downstream diagnostic failures and serious privacy concerns.

## Affected Users & Stakeholders

- **Users**: Modern dating and situationship partners (ages 18–32) experiencing relationship anxiety who want immediate, objective clarity from their chat history without complex technical setup, manual file scrubbing, or risk of personal media leaks.
- **Stakeholders**: Assify Core Product & Engineering team, who require reliable, sanitized, and structurally verified two-person conversational inputs to ensure mathematical integrity for all downstream chronemics and psychological scoring models.

## Goals

- Ingest WhatsApp export files effortlessly across iOS and Android without requiring manual user cleanup or format selection.
- Enforce strict forensic boundary validation (exactly two participants and at least 30 messages) to ensure all downstream diagnostic outputs are statistically meaningful.
- Protect device storage and personal privacy by immediately discarding all non-text media (photos, voice notes, stickers) from archives.
- Provide clear, instantaneous feedback when an exported conversation fails validation, allowing users to quickly correct the issue.

## Non-Goals

- Analyzing multi-party group chats ($N > 2$) or solo self-notes ($N < 2$).
- Storing, parsing, or displaying photos, audio messages, video attachments, or sticker media.
- Generating psychological diagnoses, Delulu scores, or story cards (reserved for downstream analysis engines).
- Live interception or real-time network scraping of WhatsApp chats.

## Success Metrics

- **100% Boundary Rejection Rate**: 100% of non-compliant files (group chats, one-sided notes, $<30$ message snippets, corrupted files) are stopped before any downstream analysis runs.
- **Sub-500ms Pre-Flight Validation**: Parsing and validation of a typical 1,000-message chat completes in under 500 milliseconds on a standard mobile device.
- **Zero Media Storage Footprint**: 0 bytes of images, audio, or video files from `.zip` exports are written to permanent device storage.
- **Zero Privacy Leakage**: 100% of chat intake and validation runs completely locally on-device without cloud network transmission.

## Cost of Inaction

Without a dedicated pre-flight ingestion and validation layer, invalid files (group chats, empty exports, or 5-message fragments) will pass into the diagnostic engine, producing nonsensical relationship scores and triggering runtime crashes. In addition, users exporting chats "With Media" will silently exhaust their device storage with unmanaged media archives, eroding trust in Assify as a secure, privacy-first sanctuary.

## Open Questions

- *None* (All foundational ambiguities regarding rejection behavior, biometric omission, and media discard were resolved and ratified with the project owner).

