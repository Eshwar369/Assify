# Concept: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Slug**: chat-ingestion-preflight
- **Created**: 2026-11-07
- **Recommended option**: Option A — In-House Single-Pass Streaming Parser

## Options

### Option A — In-House Single-Pass Streaming Parser
- **Sketch**: A lean, custom TypeScript string scanner designed specifically for Assify. It reads the exported chat line-by-line, identifies the platform format (iOS bracketed vs. Android hyphenated) on the first header, validates participant count and message volume, and computes summary reply latency and double-text bursts in a single $O(N)$ pass without ever instantiating thousands of individual message objects. For `.zip` archives, it uses `jszip` in-memory to grab `_chat.txt` and immediately drop the media payload.
- **Appetite**: Small (2–3 days)
- **Trade-offs**:
  - *Wins*: Maximum execution speed (<200ms), minimal transient memory (<15MB), zero external bundle bloat, and complete adherence to KISS/YAGNI.
  - *Sacrifices*: Requires maintaining our own dual-format regex patterns rather than relying on a third-party parser.
- **Rabbit holes**: Over-engineering regexes to support obscure historical WhatsApp versions or non-standard third-party Android mods.

---

### Option B — Open-Source Package Integration (`whatsapp-chat-parser`)
- **Sketch**: Adopt the existing open-source `whatsapp-chat-parser` npm package to convert the raw text into an array of message objects, then wrap it with an Assify pre-flight validation layer that checks $N=2$, verifies volume $\ge 30$, and filters system notices before computing chronemics.
- **Appetite**: Small (1–2 days)
- **Trade-offs**:
  - *Wins*: Instantly gains multi-locale date inference (14+ languages) and proven community edge-case handling.
  - *Sacrifices*: Violates our "don't instantiate every message" simplification by building a full array of thousands of message objects in memory before validation runs, increasing peak RAM usage.
- **Rabbit holes**: Dealing with unexpected schema updates or TypeScript typing discrepancies in external packages.

---

### Option C — Platform-Native TurboModule Pipeline (Swift & Kotlin)
- **Sketch**: Write custom native modules in Swift (iOS) and Kotlin (Android) that hook directly into the OS Share Extension, read the file stream at the native layer, validate participant counts, and pass only the validated summary across the React Native bridge.
- **Appetite**: Medium to Large (2–3 weeks)
- **Trade-offs**:
  - *Wins*: Unbeatable raw processing speed on 100,000+ line archives and seamless native Share Sheet intent handling.
  - *Sacrifices*: Massive engineering overhead, duplicate codebases in Swift and Kotlin, and high maintenance cost across Expo updates.
- **Rabbit holes**: React Native bridging issues, iOS share extension memory caps (often strictly 120MB), and Android background intent permission pitfalls.

---

## Recommendation

**Option A (In-House Single-Pass Streaming Parser)** is strongly recommended. 

It fulfills the user's explicit directive (*"cant we just get the required details from the txt file? why to complicate things"*), upholds our constitutional KISS and Model Primacy principles, and requires zero unnecessary dependencies. It provides sub-200ms parsing performance and predictable memory behavior without the complexity of native TurboModules or the memory overhead of external general-purpose object builders.

---

## Out of Scope (for the recommended option)

- Building custom native iOS/Android bridge TurboModules.
- Storing individual raw message rows in persistent local SQLite storage.
- Audio, image, or video thumbnail parsing.
- Biometric authentication gates (explicitly dropped by user directive).

---

## Assumptions to Validate

1. WhatsApp export formats remain consistently either bracketed (`[DD/MM/YY, HH:MM:SS]`) on iOS or hyphen-delimited (`DD/MM/YY, H:MM - `) on Android.
2. In-memory ZIP parsing via `jszip` stays under 30MB peak transient RAM on iOS and Android devices.
3. System alert dialogs provide sufficient user feedback on validation rejection without requiring custom modal view hierarchies.

