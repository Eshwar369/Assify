# Decision: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Slug**: chat-ingestion-preflight
- **Decided**: 2026-11-07
- **Verdict**: go
- **Artifacts reviewed**: intake.md, research.md, problem.md, concept.md

## Scorecard

| Criterion | Rating | Justification |
|---|---|---|
| **Problem validity** | strong | Real-world WhatsApp exports are noisy, unstructured, and contain non-qualifying files (group chats, <30 messages) that corrupt relationship analytics if not validated upfront. |
| **Evidence strength** | strong | Validated against `Pustur/whatsapp-chat-parser` open-source research and `MAIN_APP_REQUIREMENTS.md`. |
| **Value vs. inaction** | strong | Inaction results in runtime crashes, invalid Delulu scores, and device storage exhaustion from unmanaged media. |
| **Feasibility / appetite** | strong | Option A (In-House Single-Pass Streaming Parser) has a small appetite (2–3 days) and minimal technical risk. |
| **Strategic fit** | strong | Perfect alignment with Constitution: 100% on-device private execution, zero cloud leakage, and strict Model Primacy. |
| **Risk posture** | strong | Format disparities (iOS bracketed vs Android hyphen) and media bloat are directly mitigated by dual regex compilation and in-memory ZIP processing. |

## Verdict & Rationale

**Verdict: GO.**

The discovery phase proves this capability is essential, statistically grounded, and technically sound within a small appetite. All open questions around rejection feedback (native system alert), biometrics (omitted for frictionless entry), and ZIP archive handling (in-memory extraction with instant media discard) have been clarified and agreed upon with the project owner. The initiative is approved to proceed into implementation.

## If go — Handoff to `/speckit-specify`

- **Problem**: Ingest WhatsApp chat exports across iOS/Android, block non-qualifying conversations ($N \ne 2$ or $<30$ messages), and scrub system notices and media without memory bloat.
- **Chosen approach**: Option A — In-House Single-Pass Streaming Parser extracting a lightweight `ParsedChatSummary`.
- **In scope**:
  - In-app document picker and system Share Sheet receivers for `.txt` and `.zip`.
  - In-memory ZIP extraction (`jszip`) discarding all non-text media.
  - Streaming line parser identifying iOS and Android timestamp headers.
  - Pre-flight rejection dialog (native Apple HIG alert).
  - Single-pass calculation of median reply latency and double-text bursts.
- **Out of scope**:
  - Biometric authentication gates (dropped per user directive).
  - Multi-party group chat analysis ($N > 2$).
  - Persistent database rows for individual messages.
  - Media/photo rendering or storage.
- **Success metrics**:
  - Sub-500ms validation on 1,000 messages.
  - Peak transient RAM $<30$MB on 25,000 messages.
  - 100% rejection rate for group chats and files $<30$ messages.
  - 0 bytes of media files written to disk.
- **Carried-forward open questions**:
  - *None* (all resolved).

