# 📱 ASSIFY: MAIN APPLICATION REQUIREMENTS SPECIFICATION

> **Document Type:** Foundational Product & System Requirements Specification  
> **Classification:** Baseline Truth (Source of Truth for all downstream design and specifications)  
> **Status:** APPROVED & ADVERSARIALLY VERIFIED  
> **Version:** 2.0.0-PROD (Purple Flower Clean Slate Edition)  
> **Review Cycle:** Multi-Agent Teamwork Verified (Author + Adversarial Fault-Injection Reviewer)  

---

## 1. Product Mission, Thesis & Emotional Wedge

### 1.1 Core Mission
Assify is an objective, razor-sharp, and culturally grounded forensic chat intelligence engine designed to diagnose modern dating dynamics, situationships, and conversational power imbalances directly from WhatsApp exports.

### 1.2 The Emotional & Psychological Wedge
- **The Modern Intimacy Anxiety:** Text messaging is the primary medium of modern romance, yet users experience chronic anxiety interpreting delayed replies, double-texting, dry responses, and abrupt tone shifts. Users constantly screenshot chats and seek external reassurance from friends (*"Am I delusional, or are they losing interest?"*).
- **The Assify Solution:** Replace subjective friend gossip with an instantaneous, deterministic, and ruthlessly honest forensic evaluation. Assify validates user intuition with objective telemetry, delivers a high-impact diagnostic score (The Delulu Meter), and generates viral, aesthetically pristine social receipts (9:16 Story Cards) for Instagram and Snapchat.
- **The Core Emotional Payoff:** Transition the user from anxious uncertainty to empowering clarity and hilarious social validation within **10 seconds**.

---

## 2. Target Personas & Primary User Scenarios

### 2.1 Primary User Persona
- **Demographic:** Gen Z & Millennials (Ages 18–32).
- **Context:** Navigating ambiguous dating phases, talking stages, "situationships," post-breakup post-mortems, or testing relationship health.
- **Key Pain Point:** Asymmetric emotional investment and difficulty identifying whether a romantic prospect is genuinely invested or emotionally evasive.
- **Usage Frequency:** High-frequency event-driven usage (after an ambiguous text exchange, an unanswered double-text, a sudden silence seam, or a talking stage milestone).

### 2.2 Core Operational Scenarios
1. **The Instant WhatsApp Share-Sheet Audit (Scenario A - Out-of-App Intent):**  
   User is inside WhatsApp reading a conversation. User taps "Export Chat" (without media) and selects **Assify** from the OS Share Sheet. If Biometric Lock is active, Assify requires instant FaceID/PIN verification before processing, then parses participants, runs telemetry, and reveals the diagnosis in under 8 seconds.
2. **The In-App Direct File Drop (Scenario B - In-App Canvas):**  
   User opens Assify directly, passes optional biometric gate, taps the dropzone on the home canvas, selects an exported `.txt` or `.zip` chat archive, confirms identity with 1 tap, and watches the unboxing.
3. **The Longitudinal Check-in / Delta Audit (Scenario C - Evolution):**  
   Two weeks after an initial audit, the user exports an updated chat with the same partner containing new messages. Assify deduplicates previously analyzed messages, evaluates the incremental delta, computes dynamic shifts (e.g., *Delulu score +14%*, *response latency slowed by 18m*), and renders an updated evolutionary dossier.
4. **The Privacy-Conscious Revisit & Vault Management (Scenario D - Sanctuary):**  
   User opens Assify offline on a subway commute, unlocks via FaceID/TouchID, browses previously saved contact dossiers with 0s latency, exports a spicy flag card to their photo library, or performs a 1-tap hard wipe to purge all local records with zero trace.

---

## 3. End-to-End User Experience & Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        END-TO-END USER EXPERIENCE PIPELINE                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼ [Entry Trigger A]                                     ▼ [Entry Trigger B]
   WhatsApp Chat Export                                   Open Assify App
         │                                                       │
         ▼                                                       │
   OS Share Sheet (Android/iOS)                                  │
         │                                                       │
         └───────────────────────────┬───────────────────────────┘
                                     │
                                     ▼
                     [Biometric Gate (FaceID/PIN/TouchID)]
                      • Evaluated first if user enabled Biometrics in Settings
                      • Protects both Share Sheet entry and direct app launch
                                     │
                                     ▼
                      [1. File Ingestion & Validation]
                      • MIME & format check (.txt, .zip)
                      • Strict 1-on-1 check (reject if N != 2 participants)
                      • Minimum volume check (≥30 messages required)
                      • Filter system notices (<Media omitted>, encryption)
                                     │
                                     ▼
                     [2. Participant Identification Modal]
                      • 1-Tap Prompt: "Which one are you?"
                      • [User Pill] vs [Contact Pill]
                                     │
                                     ▼
                     [3. Theatrical Telemetry Scanner]
                      • 4 to 6-second dynamic scanning sequence
                      • Animated micro-ticks: latency, double-texts, leverage
                      • Silent Apple HIG tactile haptic pulses
                      • 15s timeout safeguard with Apple HIG retry card
                                     │
                                     ▼
                     [4. 5-Act Paged Theatrical Unboxing]
                      • Act 1: Forensic Intake & Archetypes
                      • Act 2: Delulu Meter (0-100%) & Circus Tier
                      • Act 3: Conversational Power & Leverage Split
                      • Act 4: Red & Green Flags Locker (Verifiable Quotes)
                      • Act 5: Greatest Hits, Superlatives & Final Verdict
                                     │
                                     ▼
                     [5. Full Dossier Unlock & Sharing]
                      • Complete scrollable report unlocked
                      • Client-Side Quote Rehydration ([USER] ➔ Display Names)
                      • 1-Tap 9:16 Story Card generation (Master & Act Cards)
                      • Native OS share to Instagram / Snapchat / Save to Device
                                     │
                                     ▼
                     [6. Local Vault Persistence & Delta Ready]
                      • Saved to local storage via database provider
                      • Ready for instant offline review or future delta updates
```

### 3.1 Step 1: Entry Trigger & Strict Ingestion Validation
- **Cross-Platform Native Receivers:** System must accept input through Android OS Share Sheet Intent (`android.intent.action.SEND`) and iOS Share Extension for MIME types `text/plain` and `application/zip`, as well as the in-app document picker.
- **Biometric Enforcement Gate:** If the user has enabled the Biometric Lock setting, incoming Share Sheet intents MUST trigger biometric authentication before parsing or displaying any conversation data.
- **Pre-Flight Validation Engine:**
  * **Strict Participant Count ($N == 2$):** Exactly two distinct human senders must be present in the conversation.
    - If $N < 2$ (e.g. self-chat or note dump): Ingestion halts with an Apple HIG dialog: *"Assify needs a 2-person conversation to analyze relationship dynamics."*
    - If $N > 2$ (group chat): Ingestion halts with: *"Assify is built for 1-on-1 situationships. Please export a direct personal chat."*
  * **Message Volume Threshold:** Minimum 30 valid conversational messages required for initial analysis. If $<30$ messages exist, ingestion halts with: *"Need at least 30 messages to uncover the truth."*
  * **System Noise Scrubbing:** System notices (`Messages and calls are end-to-end encrypted`, `<Media omitted>`, `Missed voice call`, `This message was deleted`, `Messages to this chat are now secured`) must be identified and filtered out prior to chronemics and LLM analysis.

### 3.2 Step 2: 1-Tap Participant Resolution
- Immediately upon parsing valid headers, the app presents a clean, non-blocking modal displaying the two extracted sender handles.
- Header copy: *"Which one are you?"*
- Two interactive pill buttons allow the user to select their identity in a single tap.
- Upon selection:
  * The user identity is mapped to token `[USER]`.
  * The counterpart is mapped to token `[PARTNER]`.
  * Stable Contact ID is computed deterministically: `SHA-256(alphabetically_sorted([participant_a, participant_b]))`.

### 3.3 Step 3: Theatrical Telemetry Scanner
- **Target Duration:** 4 to 6 seconds total duration, matching backend processing latency.
- **Visual Presentation:** Pure white canvas with a high-precision Apple-style animated scanner radar and progressing telemetry ticks:
  * *"Unpacking conversational archive..."*
  * *"Auditing response latency and sleep gaps..."*
  * *"Detecting double-text patterns and chases..."*
  * *"Sanitizing personal identifiers..."*
  * *"Synthesizing psychological profile..."*
- **Tactile Sensation:** Subtle Apple HIG haptic tick accompanying each state transition. Zero intrusive audio cues to preserve privacy in public spaces.
- **Graceful Failure & Timeout Safeguards:**
  * If LLM completion takes $>6\text{ seconds}$, the radar gracefully continues its orbital sweep with a calming status: *"Finalizing deep diagnostic..."*
  * If synthesis exceeds 15 seconds or hits an unrecoverable network drop, the app displays an Apple HIG error card: *"Analysis taking longer than expected."* with a prominent **"Retry Synthesis"** button.
  * **State Preservation Invariant:** Ingested messages and local chronemics telemetry are already cached in storage. Tapping "Retry" re-dispatches synthesis immediately without forcing the user to re-pick the file or re-select their identity.

### 3.4 Step 4: 5-Act Paged Theatrical Unboxing
The unboxing presents a paged, story-style interface with fluid 60fps spring transitions (tap right or swipe to advance):
1. **Act 1: The Forensic Intake & Surface Reality:**
   - Participant archetypes (e.g., *"The Anxious Overthinker"* vs. *"The Avoidant Phantom"*).
   - Relationship phase classification (Talking Stage, Situationship, Deep Bond, Zombie Loop).
   - Brutal 2-sentence executive diagnosis.
2. **Act 2: The Delulu Meter & Delusion Index:**
   - Primary Delulu Gauge needle animated with physics spring from 0 to target score (0–100%).
   - Circus tier classification:
     * 0–35%: *Ground Reality (Emotionally Sane)*
     * 36–69%: *Circus Apprentice (Moderate Delusion)*
     * 70–100%: *Head Clown (Terminal Delusion)*
   - Core psychological delusion driver.
   - Tactile celebration haptic when the needle locks into position.
3. **Act 3: Conversational Power & Leverage Dynamics:**
   - Power split visual bar (e.g., *User 32% vs Partner 68%*).
   - Chasing status diagnosis (Who is chasing whom).
   - Key chronemics telemetry: Median Response Latency (MRL) comparison, True Double-Text count, and Late-Night volume ratio.
4. **Act 4: The Red & Green Flags Locker:**
   - Quoted conversational receipts extracted directly from the chat log.
   - Severity-ranked red flags (Severity 1 to 5) with category badges.
   - Legitimate green flags highlighting mutual vulnerability or caring inquiries.
5. **Act 5: Greatest Hits & The Final Ruling:**
   - Satirical superlative awards (*"Fastest Ghoster"*, *"Longest Monologue"*, *"Dryest 'K' Award"*).
   - Memorable cringe quote receipts.
   - 3-Month Relationship Survival Odds (0% to 100%).
   - Final definitive ruling: Stay, Run, or Confront.

### 3.5 Step 5: Full Dossier Unlock & 9:16 Story Card Export
- Upon completion of Act 5, the full scrollable dossier is permanently unlocked.
- **Client-Side Quote Rehydration Layer:** Prior to rendering quotes on screen or capturing story cards, the presentation layer automatically replaces tokens `[USER]` and `[PARTNER]` with the real display names of the participants.
- **Export Formats:**
  * **Master Verdict Card (9:16 High-Res Image):** Delulu Gauge, Archetypes, Power Imbalance, and Final Verdict.
  * **Individual Act Cards (9:16 High-Res Image):** 1-tap export available on high-drama components (The Flags Locker, The Double-Text Receipt, The Power Breakdown).
- **Export Trigger:** 1-tap generation via native view capture rendering directly to Android/iOS OS Share Sheet (Instagram Stories, Snapchat, WhatsApp Status, or Save Image).

### 3.6 Step 6: Vault Persistence & Differential Re-analysis
- Dossiers and deduplicated messages are persisted locally via the Database Provider.
- **Differential Ingestion Engine (The Delta Loop):**
  * **Zero-Delta Optimization:** If a re-imported chat file contains **0 new messages** compared to the local database, Assify skips all LLM calls, displays an Apple HIG toast: *"Chat is already up to date"*, and opens the existing dossier instantly (0s latency, 0 API tokens burned).
  * **Incremental Delta Processing:** If new messages are detected ($N_{new} > 0$), previously stored messages are skipped via deterministic content hashes. Assify computes telemetry across the lifetime conversation AND computes specific delta badges (e.g., *"Delulu Score: 82% (+12% since last check)"*, *"Response Latency: slowed by 24m"*, *"3 New Red Flags Detected"*).

---

## 4. Core Functional Capabilities & System Boundaries

### 4.1 Ingestion & Normalization Capability
- **Requirement 4.1.1 (Multi-Format Support):** System must parse standard WhatsApp plain text exports (`.txt`) and zipped exports (`.zip`), auto-extracting the inner text payload in memory without writing temporary uncompressed files to unmanaged disk locations.
- **Requirement 4.1.2 (Encoding & Unicode Normalization):** System must strip Left-to-Right (LTR) marks (`\u200e`), Right-to-Left (RTL) marks (`\u200f`), Byte Order Marks (BOM), and normalize non-breaking spaces before tokenization.
- **Requirement 4.1.3 (Deterministic Collision-Free Message Hash):** To eliminate hash collisions on repeated same-minute messages (since WhatsApp exports lack second precision), every message must receive a unique content hash computed from:  
  $$\text{Message ID} = \text{SHA-256}(\text{contact\_id} + \text{timestamp\_iso} + \text{sequence\_index} + \text{sender} + \text{cleaned\_text})$$  
  Where `sequence_index` represents the message's line offset within the source file. Re-uploading identical archives produces identical IDs with zero duplicate database rows.

### 4.2 Zero-Trust PII Sanitization Capability
- **Requirement 4.2.1 (Pre-Flight Redaction Boundary):** No conversational text may be transmitted across external network boundaries without passing through the PII sanitizer.
- **Requirement 4.2.2 (Entity Masking Targets):**
  * Phone numbers (Indian +91 mobile formats, US formatted, and international E.164) $\rightarrow$ `[PHONE_REDACTED]`.
  * Email addresses $\rightarrow$ `[EMAIL_REDACTED]`.
  * Financial tokens (Credit/debit card numbers and Indian UPI Virtual Payment Addresses) $\rightarrow$ `[ACCOUNT_REDACTED]`.
  * Names: Full and partial names of the user and contact are masked as `[USER]` and `[PARTNER]` using whole-word boundaries.
- **Requirement 4.2.3 (Client-Side Rehydration):** Tokens `[USER]` and `[PARTNER]` are strictly internal sanitization tokens. The client UI rehydrates these tokens back to actual display names when rendering unboxing cards and 9:16 export stories.

### 4.3 Deterministic Chronemics Telemetry Capability (0-LLM)
All timing metrics must be computed mathematically with zero LLM involvement to ensure 100% determinism and reproducibility:
- **Requirement 4.3.1 (Turn Clustering & Boundary Anchoring):** Messages from the same participant separated by $\le 90\text{ seconds}$ are merged into a single Conversational Turn.
  * Turn start timestamp is anchored to message 1 of the cluster.
  * Turn end timestamp is anchored to message $N$ of the cluster.
- **Requirement 4.3.2 (Silence Seam Detection):** Gaps between alternating turns $\ge 3.5\text{ hours}$ are flagged as conversational session boundaries.
- **Requirement 4.3.3 (Median Response Latency with Sleep Clamping):** MRL is computed across alternating conversational turns:
  * Latency is measured from the previous turn's end timestamp to the current turn's start timestamp.
  * Rapid replies under 30 seconds are clamped to 30s.
  * **Overnight Sleep Gap Clamping:** Any gap spanning between 11:00 PM and 8:00 AM local time exceeding 4 hours is excluded from MRL calculations to prevent sleep periods from corrupting latency metrics.
  * **Terminal Turn Exclusion:** The final unanswered message of a conversation is classified as a terminal turn and excluded from alternating latency medians.
- **Requirement 4.3.4 (Follow-up Turns vs. Chasing Double-Texts):**
  * Consecutive turns sent by the same participant after $>90\text{ seconds}$ without an intervening reply are classified as follow-up turns.
  * Any follow-up turn sent after an unanswered silence delay $\ge 30\text{ minutes}$ is strictly classified as a **Chasing Double-Text**.
- **Requirement 4.3.5 (Late-Night Volume Ratio):** Percentage of total message volume exchanged between 11:00 PM and 4:00 AM local time.

### 4.4 AI Profile Synthesis Capability
- **Requirement 4.4.1 (Single-Pass Generation):** The entire 5-Act dossier (Archetypes, Delulu Score, Power split, Flags, Superlatives, Verdict) must be generated in a single structured LLM completion using strictly typed schemas.
- **Requirement 4.4.2 (Cultural Pragmatics Grounding):** Evaluators must be grounded in South Asian / Hinglish / Telugu colloquialisms (*Pulihora*, *Chi po ra*, *Babu entra*, teasing sarcasm) so friendly banter is never classified as toxicity or abuse.
- **Requirement 4.4.3 (Verifiable Quoted Receipts):** Every flagged behavior or cringe quote must include an exact, verbatim text snippet from the sanitized chat log. Hallucinated or fabricated quotes are strictly prohibited.

### 4.5 System Architecture Topology & Provider Abstraction
- **Requirement 4.5.1 (Topology & API Secret Safeguard):**
  * **Mobile Client:** React Native / Expo SDK 54 LTS application on device. Handles UI, navigation, native Intent receivers, biometric gate, and 9:16 image generation.
  * **Backend Service:** Lightweight FastAPI async service. Acts as the secure database provider and LLM gateway, ensuring external API keys (`OPENAI_API_KEY`) are NEVER compiled into mobile application binaries where they can be decompiled.
- **Requirement 4.5.2 (Universal Database Provider Interface):** Domain logic and API controllers interact with storage exclusively via `BaseDatabaseProvider`.
- **Requirement 4.5.3 (MVP SQLite WAL Mode):** Phase 1 MVP implements `SQLiteDatabaseProvider` operating in Write-Ahead Logging (WAL) mode with busy timeout handling.
- **Requirement 4.5.4 (Phase 2 Cloud Provider Extensibility):** The interface must allow drop-in implementation of a cloud provider (e.g. Supabase PostgreSQL) without altering domain services or API schemas.

---

## 5. Security, Privacy & Operational Guardrails

### 5.1 Privacy Sanctuary & User Data Ownership
- **Requirement 5.1.1 (Local Storage Security):** All parsed messages and generated dossiers reside in local application storage on the user's device/local server.
- **Requirement 5.1.2 (Exhaustive 1-Tap Hard Wipe):** The application settings must include an unmistakable "Wipe All Data" action that executes:
  1. Truncation and deletion of all database records across all tables.
  2. Recursive deletion of all rendered story cards and temporary files in `FileSystem.cacheDirectory`.
  3. Purging of all persisted user preferences and session keys in MMKV storage.
  Resulting in a guaranteed 0-byte residual user footprint.
- **Requirement 5.1.3 (Per-Contact Deletion):** Users must be able to delete individual contacts and all associated message history and dossiers with a single swipe or menu tap.
- **Requirement 5.1.4 (Zero External Model Training):** Outbound LLM API calls must be configured with zero data retention / zero training flags where supported by provider contracts.

### 5.2 Optional Biometric & PIN Security Gate
- **Requirement 5.2.1 (App Access Lock):** App must support an optional biometric lock (FaceID / TouchID / Android BiometricPrompt / Device PIN).
- **Requirement 5.2.2 (Universal Gatekeeping):** When enabled, biometric authentication is enforced both upon direct app opening AND when receiving shared files from OS Share Sheets.

### 5.3 Offline & Network Boundary Rules
- **Requirement 5.3.1 (Offline Vault Functionality):** Browsing past contacts, viewing previously generated 5-Act dossiers, biometric authentication, and exporting story cards must function 100% offline without any network connectivity.
- **Requirement 5.3.2 (Network Requirement for New Analysis):** Ingesting and analyzing a *new* chat file requires network connectivity for AI profiling. If the device is offline during an import attempt, Assify must display an Apple HIG network banner explaining that an active connection is required to evaluate new chats, while keeping the rest of the app fully operational.

### 5.4 Tactile & Sensory Feedback Constraints
- **Requirement 5.4.1 (Subtle Apple HIG Haptics):** Haptic pulses are restricted to meaningful tactile confirmations: selection taps, telemetry ticks during scanning, and the Delulu gauge lock-in.
- **Requirement 5.4.2 (Zero Auditory Intrusions):** No automatic sound effects, chirps, or background music are permitted, ensuring the app is discreet and completely silent in public environments.

---

## 6. Non-Goals & System Boundaries (Phase 1 MVP vs. Future Backlog)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SCOPE BOUNDARIES & PHASE ALLOCATION                             │
├────────────────────────────────────────────┬───────────────────────────────────────────┤
│ 🟢 IN SCOPE (Phase 1 MVP Rebuild)          │ 🔴 EXPLICIT NON-GOALS (Phase 2 Backlog)   │
├────────────────────────────────────────────┼───────────────────────────────────────────┤
│ • 1-on-1 WhatsApp Chat Exports (.txt, .zip)│ • Multi-person Group Chat Audits          │
│ • Android & iOS Native Share Sheet Receiver│ • Audio Voice Note Transcription (Whisper)│
│ • 1-Tap Participant Identification Modal   │ • In-App LLM Chat Coach ("Doctor Delulu") │
│ • 4-6s Theatrical Telemetry Scanner        │ • Contextual Ghost Writer Reply Generator │
│ • 5-Act Paged Theatrical Unboxing          │ • Longitudinal Fever Timeline (Bezier)    │
│ • 9:16 High-Res Story Card Exporter        │ • The Keep 8-Chamber Long-Term Memory     │
│ • Local Vault & Differential Delta Engine  │ • Cloud Sync (Supabase PostgreSQL)        │
│ • Universal Database Provider (SQLite WAL) │ • In-App Purchases / Monetization Paywalls│
│ • Optional Biometric / PIN Lock (Settings) │ • iMessage / Telegram / Instagram DMs     │
│ • 1-Tap Exhaustive Hard Wipe (DB+Cache)    │ • Dark Mode Theme (Strictly Light Apple)  │
└────────────────────────────────────────────┴───────────────────────────────────────────┘
```

---

## 7. Objective Acceptance & Verification Criteria

To ensure complete adherence to these requirements prior to any design or coding phases, the following acceptance criteria are established:

1. **Ingestion & Validation Verification:**  
   - Any upload with $N \ne 2$ participants (e.g. self-chats with 1 person or group chats with $\ge 3$) is cleanly rejected with the specified guidance banner.
   - Any upload with $<30$ messages is cleanly rejected with the minimum volume alert.
   - Parsing of both Android and iOS WhatsApp timestamp formats succeeds with zero parsing crashes.
2. **Deterministic Telemetry & Collision-Free Hash Verification:**  
   - Consecutive identical messages within the same minute receive distinct, reproducible hashes due to `sequence_index`.
   - Re-running chronemics calculations on the identical chat export produces identical numeric outputs every single time.
   - Sleep gaps ($>4\text{h}$ overnight) are mathematically excluded from Median Response Latency.
   - Double-texts within a 90-second turn cluster evaluate to exactly zero.
3. **Zero-Delta Optimization Verification:**  
   - Re-uploading an unchanged chat file opens the existing dossier immediately and consumes 0 LLM API calls.
4. **Privacy Sanitization & Rehydration Verification:**  
   - Outbound network inspection confirms zero unmasked phone numbers, emails, or personal names.
   - UI unboxing cards and 9:16 export stories rehydrate `[USER]` and `[PARTNER]` back into human display names.
5. **Security & Offline Boundary Verification:**  
   - Sharing a chat via OS Share Sheet while Biometric Lock is enabled requires FaceID/PIN verification before parsing.
   - Placing device in Airplane Mode allows immediate browsing and story card export of all existing local dossiers.
6. **Exhaustive Hard Wipe Verification:**  
   - Executing "Wipe All Data" clears all database tables, deletes all cached image files in `FileSystem.cacheDirectory`, and resets MMKV storage to zero.

---

*This specification represents the authoritative, unshakeable requirements for ASSIFY v2.0.*
