# 🚨 ASSIFY System Audit — Architectural, Conceptual & Code Flaws Report

> **Document:** `PROJECT_FLAWS_AND_AUDIT.md`  
> **Evaluation Date:** October 2026  
> **Evaluator:** Principal Staff Engineer & Technical Mentor  
> **Standard:** Brutal Grader Standard (1–10 Scale, Zero Grade Inflation)  
> **Benchmarked Against:** Delulu Check Production Architecture, Apple Human Interface Guidelines, and Production-Grade Full-Stack Standards.

---

## 📊 1. Executive Scorecard & Brutal Assessment

| Dimension | Grade (1–10) | Status | Primary Cause |
| :--- | :---: | :---: | :--- |
| **End-to-End System Integration** | **2.0 / 10** | 🛑 **Critical Failure** | The app is currently a "Truman Show" simulator: file drop, analysis, coach chat, and ghost replies are hardcoded client-side `setTimeout` mocks. |
| **Backend Architecture & Concurrency** | **3.5 / 10** | 🔴 **High Risk** | `upload_and_analyze` blocks the FastAPI event loop for 45s; background task polling was specified in docs but never built. |
| **Data Privacy & Security (PII)** | **1.5 / 10** | 🛑 **Illegal / Rejection Trap** | UI advertises "Zero-Trust PII Masking", yet raw personal chat archives are transmitted unredacted to OpenAI. |
| **Product Strategy & Delulu Alignment** | **4.0 / 10** | 🟡 **Premature Bloat** | Lost the 10-second viral dopamine loop of Delulu Check by cramming 17 Acts, 8 Keep chambers, Coach, Ghost Writer, and Timelines into an untested prototype. |
| **Mobile Architecture & Native Standards** | **4.5 / 10** | 🟡 **Unstable** | Bleeding-edge Expo SDK 58/RN 0.88 canary version conflict; hardcoded emulator IPs (`10.0.2.2`); 2.5s network timeouts. |
| **Design System & Apple HIG Adherence** | **5.5 / 10** | 🟡 **Fragmented** | Schizophrenia between Apple Light Edition and Dark Cyber-Romance; 8 active "Native Slop" tells (Web modals, emoji icons, hand-rolled headers). |
| **Code Correctness & Parser Robustness** | **4.0 / 10** | 🔴 **High Risk** | Non-deterministic message IDs (`hash()`); missing 24-hr iOS timestamps; unhandled division-by-zero edge cases. |
| **OVERALL PROJECT HEALTH** | **3.5 / 10** | ⚠️ **Emergency Intervention Required** | **Significant structural and code rework required before any public testing or App Store submission.** |

---

## 🎭 2. The Core Conceptual & Product Flaws (The Foundation)

### Flaw 2.1: The "Truman Show" Illusion (Faked End-to-End Experience)
- **What is happening:** The mobile application looks visually impressive in screenshots, but almost every interactive feature is completely disconnected from the backend and faked with local timers:
  1. **File Picking is Faked:** In [`mobile/src/components/WhatsAppDropzone.tsx#L37-L41`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/components/WhatsAppDropzone.tsx#L37-L41), tapping the dropzone does not open a system file picker (`expo-document-picker`). It hardcodes `mockFileName = '_chat_sleepless_zombiee.txt'`.
  2. **File Ingestion is Faked:** In [`mobile/src/app/(tabs)/index.tsx#L116-L129`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/index.tsx#L116-L129), `handleFileDrop` runs a `setTimeout` for 1,200ms and re-queries existing local mock state. It makes **zero** HTTP POST requests to `POST /api/ingest/upload`.
  3. **Doctor Delulu Coach is Faked:** In [`mobile/src/app/(tabs)/coach.tsx#L164-L185`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/coach.tsx#L164-L185), user messages trigger a 1,100ms `setTimeout` that appends a static hardcoded string response (*"Here is the raw truth: You are over-indexing on her recent latency..."*). The backend directories `backend/coach/` and `backend/replies/` contain nothing but empty `__init__.py` files.
  4. **Ghost Writer is Faked:** In [`mobile/src/app/(tabs)/coach.tsx#L209-L220`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/coach.tsx#L209-L220), reply generation is a static template string (*"Got it. Let me know when you are free next week"*).
  5. **Network Layer is a Fallback Trap:** In [`mobile/src/services/api.ts#L175-L186`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/services/api.ts#L175-L186), all API calls timeout after 2.5 seconds (`timeoutMs = 2500`). When any request fails or times out, it silently swallows the error and returns hardcoded fallback fixtures (`FALLBACK_CONTACT`, `FALLBACK_PROFILE`, `FALLBACK_CHRONEMICS`).
- **Why this is fatal:** You cannot test real-world behavior or iterate on real user feedback. The system creates a false sense of completion while none of the full-stack plumbing actually functions.

---

### Flaw 2.2: Product Identity Crisis & Premature Scope Bloat
- **What made Delulu Check viral:**
  - Delulu Check's viral mechanics in production were ruthlessly simple:
    1. Direct share from WhatsApp/iMessage into app via Android/iOS Share Sheet.
    2. Instant 5–8 second analysis.
    3. High-dopamine visual payoff: Delulu Meter (0–100%), 1 savage archetypal diagnosis, and 3 shareable Instagram Story receipts.
- **How Assify lost this focus:**
  - Assify attempted to build five competing apps in Day 0:
    1. A 17-Act Theatrical Opera (requiring 4 sequential OpenAI passes).
    2. An 8-Chamber Relationship Memory Vault ("The Keep" tracking gifts, foods, movies, and dates).
    3. A 24/7 AI Relationship Therapist ("Doctor Delulu").
    4. A Real-Time Dating Wingman ("Ghost Writer Reply Triad").
    5. A 4-Epoch Longitudinal Relationship Timeline.
    6. A Relationship Diary Chapter Generator.
- **Result:** Instead of mastering the core 10-second viral "Delulu Check" loop, the app has 5 half-built, non-functional sub-products.

---

### Flaw 2.3: The False "Zero-Trust" Security Promise (GDPR & App Store Rejection)
- **The Violation:** The UI in [`WhatsAppDropzone.tsx#L131-L133`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/components/WhatsAppDropzone.tsx#L131-L133) boasts:
  ```tsx
  <ShieldCheck size={12} color={Colors.systemGreen} />
  <Text style={styles.applePillText}>Zero-Trust PII Masking</Text>
  ```
  And displays the loading state: *"Scrubbing PII & crunching latencies..."*.
- **The Reality:** A full grep search of the entire backend codebase reveals **zero lines of code that scrub, mask, hash, or anonymize PII**.
  In [`backend/profiler/synthesizer.py#L294`](file:///c:/Users/DELL/gen%20ai/Assify/backend/profiler/synthesizer.py#L294), raw unredacted personal chats (including names, addresses, private medical/surgery records, and emotional vulnerabilities) are dumped straight into OpenAI prompt payloads:
  ```python
  prompt = f"""
  ...
  CHAT TRANSCRIPT SLICES (ORGANIZED BY EPOCH):
  {chat_text}
  ...
  """
  resp = self.client.chat.completions.create(model=self.model, ...)
  ```
- **Consequences:**
  - Direct violation of **Apple App Store Review Guidelines 5.1.1 & 5.1.2** (Data Collection, Storage, and Third-Party Transmission).
  - Direct violation of **GDPR & CCPA** regulations for transferring unconsented, un-anonymized third-party conversation data to cloud LLMs.
  - Immediate App Store rejection upon review.

---

### Flaw 2.4: Devastating Unit Economics & Denial-of-Service Risk
- **The Math:**
  - Ingesting a single 30,000-message chat triggers:
    1. Neuro-Symbolic Seams analysis: ~40 transition seams sent to `gpt-4o-mini`.
    2. The Keep extraction: candidate turns sent to `gpt-4o-mini`.
    3. 4-Pass Synthesizer: 4 separate large context calls to `gpt-4o-mini`.
  - Total processing time: **35 to 50 seconds**.
  - Total cost per analysis: ~$0.02 to $0.05.
- **The Flaw:**
  - There is **no authentication**, **no rate limiting**, and **no monetization/paywall**.
  - 500 concurrent viral users uploading WhatsApp chats would cost $25/hour, exceed OpenAI tier rate limits (429 errors), and completely freeze the unscaled single-threaded backend server.

---

## 🏛️ 3. Backend Architectural & Concurrency Flaws

### Flaw 3.1: FastAPI Event-Loop Freezing (Synchronous Blocking in `async def`)
- **Location:** [`backend/api/ingest.py#L12-L64`](file:///c:/Users/DELL/gen%20ai/Assify/backend/api/ingest.py#L12-L64)
- **The Defect:**
  ```python
  @router.post("/upload", response_model=Dict[str, Any])
  async def upload_and_analyze(...):
      # ...
      ingest_res = ingest_chat(...)       # SYNCHRONOUS BLOCKING CPU
      # ...
      profiler_res = synthesizer.run_full_profiler(...)  # SYNCHRONOUS 40s LLM CALLS
  ```
- **Why this breaks production:**
  In FastAPI, declaring an endpoint as `async def` signals to Uvicorn that the function will cooperatively yield control via `await`. When a synchronous blocking function (`run_full_profiler`) is called inside an `async def`, **it blocks the entire single-threaded asyncio event loop**.
  While one user is uploading a chat, the entire server stops responding to all other requests (`/health`, `/contacts`, `/report/1`).
- **Remediation:** Either declare the route as standard synchronous `def upload_and_analyze(...)` (so FastAPI offloads it to its worker thread pool) or execute the analysis via a background task worker (Celery, ARQ, or FastAPI `BackgroundTasks`).

---

### Flaw 3.2: Architecture Contract Violation — Ghost Polling Endpoints
- **Location:** [`ARCHITECTURE.md#L226-L237`](file:///c:/Users/DELL/gen%20ai/Assify/ARCHITECTURE.md#L226-L237)
- **The Defect:**
  `ARCHITECTURE.md` explicitly specifies an asynchronous polling architecture:
  | Method | Endpoint | Input | Output | Description |
  |---|---|---|---|---|
  | `POST` | `/api/upload` | `multipart/form-data` | `{ task_id, status }` | Ingests chat and spawns analysis |
  | `GET` | `/api/status/{task_id}` | Path param | `{ progress, current_step, is_done }` | Polling for analysis progress |
- **The Reality:**
  - `/api/status/{task_id}` does not exist in any file.
  - `/api/upload` does not exist; instead `POST /api/ingest/upload` was built, and it blocks synchronously for 45s.
  - The client has no mechanism to show a true multi-stage progress bar (e.g., "15% - Normalizing messages", "45% - Computing chronemics", "80% - Synthesizing Acts").

---

### Flaw 3.3: Missing Backend Route Modules
- **Location:** [`backend/main.py#L13-L38`](file:///c:/Users/DELL/gen%20ai/Assify/backend/main.py#L13-L38)
- **The Defect:**
  `ARCHITECTURE.md` defines:
  - `POST /api/coach/chat` (Doctor Delulu streaming chat)
  - `POST /api/ghost/reply` (Ghost Writer 3-Option Triad)
  - `POST /api/ghost/voice` (God Mode speech-to-intent reply)
  None of these routes are implemented in `backend/api/` or registered in `backend/main.py`. The directories `backend/coach/` and `backend/replies/` are completely empty stubs.

---

## 📱 4. Mobile Architecture, Networking & Native Flaws

### Flaw 4.1: The Localhost Emulator Loopback Trap (`10.0.2.2`)
- **Location:** [`mobile/src/services/api.ts#L3-L4`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/services/api.ts#L3-L4)
- **The Defect:**
  ```typescript
  const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
  export const BASE_API_URL = `http://${LOCAL_HOST}:8000/api`;
  ```
- **Why this fails:**
  - `10.0.2.2` is a special loopback IP that **only works inside an Android Studio Emulator**.
  - `127.0.0.1` **only works inside an iOS Simulator or web browser**.
  - If a user opens the app on a **physical smartphone** via Expo Go (which ADR 001 explicitly states is the primary test target), `10.0.2.2` and `127.0.0.1` fail 100% of the time because the phone cannot route to the host machine's localhost.
- **Remediation:** Dynamic host detection via `Constants.expoConfig?.hostUri` or environment variable configuration (`EXPO_PUBLIC_API_URL`).

---

### Flaw 4.2: Aggressive 2.5s Timeout vs 45s Backend Response
- **Location:** [`mobile/src/services/api.ts#L175-L186`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/services/api.ts#L175-L186)
- **The Defect:**
  ```typescript
  async function fetchWithTimeout(url: string, timeoutMs: number = 2500): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    // ...
  ```
- **The Clash:** The backend synthesis pipeline takes 35 to 45 seconds to process 30,000 messages. If the mobile app ever attempted to trigger an upload or profiler run, the request would be aborted after 2.5 seconds, guaranteeing immediate failure.

---

### Flaw 4.3: Missing `uploadChat()` API Method
- **Location:** [`mobile/src/services/api.ts`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/services/api.ts)
- **The Defect:**
  `mobile/src/services/api.ts` implements `getContacts()`, `getReportDossier()`, `getAllActs()`, and `getKeepVault()`.
  It **completely lacks** any function to upload a chat file (e.g. `uploadChatArchive(fileUri, vibeMode)`). The frontend literally has no network client method to send files to the server.

---

### Flaw 4.4: Missing Native Modules & Template Configuration
- **Location:** [`mobile/app.json`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/app.json) & [`mobile/package.json`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/package.json)
- **The Defects:**
  1. **Template Name & Branding:** `name` is `"mobile"`, `slug` is `"mobile"`, `scheme` is `"mobile"`. Splash screen background is default Expo blue (`#208AEF`).
  2. **Missing WhatsApp Intent Receiver:** `ARCHITECTURE.md` promises a *"WhatsApp Intent Receiver (Direct Share Target)"*. `app.json` has **zero** intent filters or share targets configured for Android (`android.intent.action.SEND`).
  3. **Missing Audio Recorder:** `ARCHITECTURE.md` promises *"God Mode Audio Recorder (expo-av)"*. `expo-av` is not installed in `package.json` and no microphone permissions are configured in `app.json`.
  4. **Document Picker Missing:** `expo-document-picker` is not installed in `package.json`, making real file selection impossible.

---

### Flaw 4.5: Dependency Version Drift & Experimental Bleeding-Edge Packages
- **Location:** [`mobile/package.json#L5-L33`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/package.json#L5-L33)
- **The Defect:**
  All project documentation (`GEMINI.md`, `AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`) mandates:
  - React Native with **Expo SDK 54** (TypeScript)
  - React Native Reanimated 3
  - React 18
- **The Reality:**
  `package.json` contains:
  ```json
  "expo": "~58.0.16",
  "react": "19.3.0",
  "react-native": "0.88.0",
  "react-native-reanimated": "4.7.1",
  "react-native-worklets": "0.13.0"
  ```
  SDK 58 and Reanimated 4 are experimental, unstable, and incompatible with standard Expo Go clients and common third-party community libraries.

---

## 🎨 5. Design System, Apple HIG & Native Slop Audit

Grounding against `.agents/skills/expo-design-system/references/native-slop.md` and Apple Human Interface Guidelines:

| Native Slop Tell | Status in Assify | Observable Code Location | Violation & Fix |
|---|:---:|---|---|
| **Tell #1: The Web Modal** | ❌ **Present** | [`index.tsx#L9`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/index.tsx#L9), [`acts-modal.tsx#L14`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/acts-modal.tsx#L14) | Uses React Native's `<Modal>` dialog for contact switching and viral card sharing instead of native sheets (`presentation: 'formSheet'`). |
| **Tell #3: Emoji Iconography** | ❌ **Present** | [`keep.tsx#L36-L40`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/keep.tsx#L36-L40) | Uses emoji directly in UI filter buttons: `🎁 Gift Wishlist`, `🍕 Food`, `🎬 Watchlist`. Must use SF Symbols / Lucide icons without raw emoji strings. |
| **Tell #5: Floating Pill Tab Bar** | ❌ **Present** | [`(tabs)/_layout.tsx#L54-L68`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/_layout.tsx#L54-L68) | On Web, tab bar is hardcoded as an inset floating pill with `borderRadius: 34`, hovering above content. Must use standard system dock placement. |
| **Tell #11: Hand-Rolled Header** | ❌ **Present** | [`(tabs)/_layout.tsx#L26`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/_layout.tsx#L26) | `headerShown: false` is set globally, and custom `<AppHeader>` headers are manually recreated on every screen, losing native large-title collapse and gestures. |
| **Tell #13: The Squish Reflex** | ❌ **Present** | [`AppleElevatedCard.tsx#L34`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/components/ui/AppleElevatedCard.tsx#L34) | `scale: 0.98` spring animation applied uniformly to all cards on touch, plus widespread use of `TouchableOpacity` throughout the app. |
| **Tell #18: Dark-Mode Amnesia & Schizophrenia** | ❌ **Present** | [`theme.ts#L1-L90`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/constants/theme.ts#L1-L90) | Codebase is split between Light Apple Edition (`#FFFFFF`, `#F5F5F7`) and legacy dark tokens (`#07080C`, `#08090E`). No dynamic dark mode support. |
| **Tell #19: The Spinner Blink** | ❌ **Present** | [`index.tsx#L131-L139`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/index.tsx#L131-L139), [`acts-modal.tsx#L99-L106`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/acts-modal.tsx#L99-L106) | Full-screen centered `ActivityIndicator` displays during data fetching instead of skeleton loaders or retaining stale data during revalidation. |
| **Tell #20: Keyboard Blindness** | ❌ **Present** | [`coach.tsx#L10`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/(tabs)/coach.tsx#L10) | Uses standard React Native `KeyboardAvoidingView` with raw `ScrollView`, which fails to adapt properly on Android devices without `react-native-keyboard-controller`. |

---

## 🐛 6. Code-Level Logic Errors & Algorithmic Bugs

### Bug 6.1: Non-Deterministic Message IDs in Python Parser
- **Location:** [`backend/ingestion/parser.py#L162`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/parser.py#L162)
- **The Defect:**
  ```python
  msg_id = f"{contact_id}_{line_num}_{abs(hash(raw_ts + content)) % 1000000}"
  ```
- **Why this is broken:** Python’s built-in `hash()` function is salted with a random per-process seed (`PYTHONHASHSEED`) that changes on every Python process start.
  If the backend restarts and re-ingests or syncs a chat, every message receives a completely different `id`, breaking foreign key relationships, duplicates detection, and evidence quote linking.
- **Fix:** Use deterministic hashing: `hashlib.md5((raw_ts + content).encode('utf-8')).hexdigest()[:8]`.

---

### Bug 6.2: Missing 24-Hour Seconds Timestamp Pattern
- **Location:** [`backend/ingestion/parser.py#L90-L101`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/parser.py#L90-L101)
- **The Defect:**
  `formats` includes:
  - `"%d/%m/%Y, %H:%M"`
  - `"%d/%m/%y, %H:%M"`
  - `"%d/%m/%Y, %I:%M:%S %p"`
  It **omits** `"%d/%m/%y, %H:%M:%S"` and `"%d/%m/%Y, %H:%M:%S"` (24-hour time with seconds, which is standard in many international iOS WhatsApp exports).
- **Impact:** When an unlisted format is parsed, `parse_timestamp()` returns `None`. The parser falls back to storing the unparsed raw string (e.g. `"24/10/24, 18:30:15"`). When SQLite runs `ORDER BY time_stamp ASC`, string comparison sorts by day instead of year (`01/10/2026` comes before `31/01/2024`), corrupting chronemics and conversational order.

### Bug 6.1: Non-Deterministic Message IDs in Python Parser — `[FIXED - VERIFIED]`
- **Location:** [`backend/ingestion/parser.py#L162`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/parser.py#L162)
- **Status:** ✅ **Resolved** (Grade: **9.5 / 10**)
- **The Defect:** Python’s built-in `hash()` function is salted with a random per-process seed (`PYTHONHASHSEED`) that changes on every process start.
- **The Fix Applied:** Implemented deterministic MD5 hashing: `hashlib.md5((raw_ts + content).encode('utf-8')).hexdigest()[:8]`.
- **Verification:** Unit test `test_deterministic_message_ids` in [`backend/tests/test_parser.py`](file:///c:/Users/DELL/gen%20ai/Assify/backend/tests/test_parser.py) passes.

---

### Bug 6.2: Missing 24-Hour Seconds Timestamp Pattern — `[FIXED - VERIFIED]`
- **Location:** [`backend/ingestion/parser.py#L90-L101`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/parser.py#L90-L101)
- **Status:** ✅ **Resolved** (Grade: **9.0 / 10**)
- **The Defect:** Missing standard iOS/international 24-hour formats with seconds (`%d/%m/%y, %H:%M:%S` and `%d/%m/%Y, %H:%M:%S`), causing unparsed strings to fail chronological sorting.
- **The Fix Applied:** Added 6 explicit 24-hour and ISO variations with seconds.
- **Verification:** Unit test `test_parse_timestamp_24_hour_with_seconds` in [`backend/tests/test_parser.py`](file:///c:/Users/DELL/gen%20ai/Assify/backend/tests/test_parser.py) passes.

---

### Bug 6.3: Unhandled LLM Synthesis Failures & Zero Retry Logic — `[PARTIALLY ADDRESSED]`
- **Location:** [`backend/profiler/synthesizer.py#L245-L260`](file:///c:/Users/DELL/gen%20ai/Assify/backend/profiler/synthesizer.py#L245-L260)
- **Status:** ⚠️ **Partial Mitigated Only** (Grade: **3.5 / 10**)
- **The Defect:** If Pass 4 throws a transient rate-limit or JSON error, Passes 1–3 are lost and the request crashes.
- **What Was Done:** Added an outer `try...except` in [`backend/api/ingest.py`](file:///c:/Users/DELL/gen%20ai/Assify/backend/api/ingest.py) so failure logs a warning and returns basic ingestion without a dossier.
- **Remaining Debt:** Individual pass checkpointing to SQLite and `tenacity` exponential retry logic inside [`synthesizer.py`](file:///c:/Users/DELL/gen%20ai/Assify/backend/profiler/synthesizer.py) remain unbuilt.

---

## 🛠️ 7. Master Remediation Roadmap (Phase-by-Phase Plan)

### 🚨 Phase 1: Kill the "Truman Show" — Real End-to-End Pipeline (P0)
1. **Real File Picking & Ingestion:**
   - [x] Install `expo-document-picker` in `mobile/package.json`.
   - [x] Wire `WhatsAppDropzone.tsx` to pick real `.txt` and `.zip` files from mobile storage.
   - [x] Implement `uploadChatArchive()` in `mobile/src/services/api.ts` with `FormData` multipart upload.
2. **Asynchronous Background Processing & Polling:**
   - [x] Convert `POST /api/ingest/upload` to enqueue a background job via `ThreadPoolExecutor` and immediately return `{ task_id, status: 'queued' }`.
   - [x] Implement `GET /api/status/{task_id}` and `GET /api/ingest/status/{task_id}` returning progress stages (10%, 30%, 55%, 80%, 100%).
   - [x] Build real animated progress tracker in mobile UI using Reanimated UI-thread driver.
   - [x] 🛡️ *Resolved:* Migrated ephemeral in-memory `_tasks` dict to persistent SQLite `ingestion_tasks` table with atomic `task_repo` and self-healing startup recovery.
3. **Dynamic Network Host Configuration:**
   - [x] Remove hardcoded `10.0.2.2`. Use `Constants.expoConfig?.hostUri` and `EXPO_PUBLIC_API_URL` so physical devices connect seamlessly over Wi-Fi.

---

### 🛡️ Phase 2: Privacy Hardening & Real PII Scrubbing (P0)
1. **Pre-LLM Sanitization Engine:**
   - [x] Create `backend/ingestion/sanitizer.py` with regexes for phones, emails, card numbers, UPI IDs, and participant names.
   - [x] Hook `sanitize_text` into `sample_representative_messages` in `backend/profiler/synthesizer.py`.
   - [ ] 🛑 *CRITICAL SECURITY LEAK REMAINING:* Must hook `sanitize_text` into [`preference_tagger.py`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/preference_tagger.py#L183) and [`chronemics.py`](file:///c:/Users/DELL/gen%20ai/Assify/backend/analytics/chronemics.py#L208). Unredacted text is still leaking to OpenAI!
2. **App Store Compliance:**
   - [ ] Add explicit user consent modal disclosing that anonymized chat snippets are processed by OpenAI for relationship analysis.

---

### 💬 Phase 3: Implement or Defer Secondary Modules (P1)
1. **Coach & Ghost Writer Decision:**
   - [ ] Build real backend endpoints (`POST /api/coach/chat` with SSE token streaming, `POST /api/ghost/reply`) OR remove the Coach tab from primary navigation until Phase 2 to prevent Apple App Store rejection for broken mock features.
2. **Align Product with the Delulu Benchmark:**
   - [ ] Prioritize the 10-second instant gratification view: Delulu Score radial gauge + Top 3 Receipts + 1-Tap Instagram Story export.

---

### 🎨 Phase 4: Clean Up Native Slop & Design System (P2)
1. **Eliminate Native Slop Tells:**
   - [ ] Replace `<Modal>` in [`acts-modal.tsx`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/app/acts-modal.tsx) with native iOS `formSheet` modals.
   - [ ] 🛑 *REGRESSION FIX:* Restore contact switching in `index.tsx` using an Apple HIG action sheet or `formSheet` route (was deleted without replacement).
   - [ ] Strip emoji iconography from category buttons in `keep.tsx`.
   - [ ] Use standard bottom navigation tabs without floating Web pills in `_layout.tsx`.
   - [ ] Configure native stack headers instead of `headerShown: false` everywhere.
2. **Enforce Single Theme Source of Truth:**
   - [ ] Purge dead dark mode tokens from `theme.ts`. Standardize on the Apple Light Edition token contract.

---

## 📋 8. Post-Sprint 5.7 Verified Remediation Ledger (Brutal Audit)

| # | Item / Flaw | Planned Action | Verified Status | Brutal Grade (1–10) | Forensic Findings & Caveats |
|---|---|---|:---:|:---:|---|
| **1** | **Deterministic Parser IDs** (Bug 6.1) | Replace `hash()` with `md5` | ✅ **DONE** | **9.5 / 10** | Fully resolved in [`parser.py#L170`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/parser.py#L170). Tested & verified. |
| **2** | **24-Hour Timestamp Parser** (Bug 6.2) | Add missing ISO/24h seconds formats | ✅ **DONE** | **9.0 / 10** | Fully resolved in [`parser.py#L89-L113`](file:///c:/Users/DELL/gen%20ai/Assify/backend/ingestion/parser.py#L89-L113). Tested & verified. |
| **3** | **Dynamic Network Host** (Flaw 4.1) | Replace `10.0.2.2` with `Constants.expoConfig` | ✅ **DONE** | **8.5 / 10** | Fully resolved in [`api.ts#L4-L17`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/services/api.ts#L4-L17). Works on physical devices. |
| **4** | **Native Document Picker** (Flaw 2.1) | Install `expo-document-picker` | ✅ **DONE** | **8.0 / 10** | Real file picking and animated progress bar working in [`WhatsAppDropzone.tsx`](file:///c:/Users/DELL/gen%20ai/Assify/mobile/src/components/WhatsAppDropzone.tsx). |
| **5** | **Async Polling Architecture** (Flaw 3.1 & 3.2) | ThreadPool worker + `/status` endpoint | ✅ **DONE** | **9.5 / 10** | Fully backed by persistent SQLite `ingestion_tasks` table, WAL mode, process-safe, with startup recovery for abandoned tasks. Tested & verified. |
| **6** | **PII Sanitization Engine** (Flaw 2.3) | Scrub names/phones/cards/UPI | 🛑 **LEAKY** | **4.5 / 10** | Clean regex engine created, but **only hooked into 1 of 3 OpenAI pipelines**. `preference_tagger` and `chronemics` still transmit raw chat turns! |
| **7** | **Synthesis Failure Fallback** (Bug 6.3) | Retries and pass checkpointing | ⚠️ **PARTIAL** | **3.5 / 10** | Soft `try/except` added in `ingest.py`, but individual pass checkpointing and `tenacity` retries in `synthesizer.py` are unbuilt. |
| **8** | **Native Slop Tell #1 (Web Modal)** | Replace `<Modal>` with HIG sheet | 🛑 **BOTCHED** | **2.0 / 10** | The `<Modal>` in `index.tsx` was deleted without replacement, **completely breaking user contact switching**. `acts-modal.tsx` still uses `<Modal>`. |
| **9** | **Doctor Delulu Coach & Ghost Writer** | Implement backend endpoints or remove tab | ❌ **UNTOUCHED** | **1.0 / 10** | 100% fake `setTimeout` strings in `coach.tsx`. Backend folders remain empty `__init__.py` stubs. |
| **10** | **Automated Test Coverage** | 19 automated tests | ✅ **DONE** | **9.5 / 10** | 19 of 19 backend tests passing in pytest (unit tests for parser, sanitizer, task repo, and async polling). |

### 🎯 Updated System Health Assessment
- **Pre-Sprint 5.7 Health Score:** `3.5 / 10`
- **Current Verified Health Score:** `4.8 / 10`
- **Current Blocker Punch-List:**
  1. Patch PII leak in `preference_tagger.py` and `chronemics.py`.
  2. Restore Contact Selector in `index.tsx` using a native Apple HIG bottom sheet.
  3. Persist async task state into SQLite.
  4. Decide whether to build real Coach/Ghost Writer endpoints or defer the tab before App Store submission.
