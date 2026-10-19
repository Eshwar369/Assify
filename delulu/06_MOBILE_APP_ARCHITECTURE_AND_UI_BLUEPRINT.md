# 📱 Mobile App Architecture & UI Blueprint: Building the Mobile Assify OS

> **Context:** Reverse-engineered from Delulu Check's APK (Expo SDK 54, React Native Reanimated)  
> **Goal:** Complete architectural and UI blueprint to build a native mobile app for Assify that delivers Delulu's viral, game-like experience on your smartphone while powered by your private, local PC backend.

---

## 1. The Mobile Architecture Reality Check

You want an app that looks, feels, and acts like Delulu Check on your smartphone. But you also want 100% offline privacy and zero cloud API bills.

### Can your phone run `llama3.1:8b` directly on-device?
- **The Hardware Reality:** Running an 8-Billion parameter LLM locally requires 5.5GB+ of RAM strictly dedicated to the model. Android and iOS aggressively kill background apps using more than 2–3GB of memory. Even on flagship phones, on-device 8B models drain 15% battery in 5 minutes and cause extreme thermal throttling.
- **What Delulu Check Did:** Delulu's mobile app is **pure frontend** (React Native). It does zero AI processing on the phone. It uploads chats to their cloud servers (Vercel + Supabase) and calls OpenAI's cloud API.

### The Winning Solution for Assify: The "Private Home Base" Architecture

```
┌──────────────────────────────────────────────┐
│            YOUR MOBILE PHONE                 │
│                                              │
│   React Native (Expo SDK 54 + TypeScript)    │
│   • Dark Cyber-Romance Aesthetics            │
│   • 60 FPS Reanimated Gauges & Cards         │
│   • WhatsApp Direct Share Target             │
│   • God Mode Voice Mic (expo-av)             │
└──────────────────────┬───────────────────────┘
                       │
                       │ Encrypted Local Wi-Fi / Tailscale VPN
                       │ (Zero cloud servers, zero external data)
                       │
┌──────────────────────▼───────────────────────┐
│        YOUR LAPTOP / HOME PC ("HOME BASE")   │
│                                              │
│   FastAPI Local Server (Port 8000)           │
│   • SQLite Database 2.0 (WAL Mode)           │
│   • Mathematical Chronemics Engine           │
│   • 4-Pass Local Profiler (llama3.1:8b)      │
│   • Doctor Delulu Context Assembler          │
│   • Local faster-whisper STT                 │
└──────────────────────────────────────────────┘
```

### Why this architecture is unbeatable:
1. **You get Delulu's exact mobile experience:** The mobile app is snappy, gorgeous, lightweight, and native.
2. **Infinite Compute Power:** Your laptop GPU/CPU handles the heavy ingestion and reasoning in the background.
3. **100% Private & Free:** Not a single byte of your chat history ever touches OpenAI, Google, Apple, or Vercel servers.
4. **Anywhere Access:** By using **Tailscale** (a free, zero-config private mesh VPN), your phone can connect securely to your laptop from anywhere—whether you are on campus, in a coffee shop, or at home.

---

## 2. Mobile Tech Stack Blueprint (Mirroring Delulu)

Delulu's APK bundle confirms the following state-of-the-art mobile stack:

| Layer | Delulu Check (APK) | Your Assify Mobile Stack | Purpose |
|---|---|---|---|
| **Framework** | Expo SDK 54 (React Native 0.76+) | **Expo SDK 54 (TypeScript)** | Rapid native compilation for Android & iOS |
| **Routing** | Expo Router (File-based) | **Expo Router (`app/` directory)** | Seamless screen transitions & deep links |
| **Animations** | React Native Reanimated 3 | **`react-native-reanimated`** | 60 FPS circular Delulu Meter, swipeable cards |
| **Gestures** | React Native Gesture Handler | **`react-native-gesture-handler`** | Tinder-style swipe gestures for receipts |
| **Icons** | Lucide Icons & FontAwesome | **`lucide-react-native`** | Minimalist modern UI iconography |
| **Storage (Local)** | MMKV / SecureStore | **`react-native-mmkv`** | Instant local caching of past reports |
| **Audio** | Android `RECORD_AUDIO` | **`expo-av`** | God Mode voice note intent recording |
| **Haptics** | Android Vibrator | **`expo-haptics`** | Tactical physical feedback on revealing cards |

---

## 3. Visual Design System: Dark "Cyber-Romance" Theme

Delulu Check's visual appeal comes from its bold, high-contrast, gamified aesthetic. Avoid generic gray mobile screens. Use this curated palette:

```
/* ASSIFY MOBILE DESIGN SYSTEM TOKENS */
Background (Deep Canvas):     #0A0A0E  (Pitch OLED Black with subtle purple tint)
Surface Card:                #14141E  (Dark Obsidian)
Surface Card Elevated:       #1E1B2E  (Plum Charcoal with 1px border #2E2845)

Primary Accent (Delulu):     #FF2E93  (Hot Neon Pink)
Secondary Accent (Power):    #8B5CF6  (Electric Violet / Lavender)
Success / Green Flags:       #00F5A0  (Neon Emerald)
Danger / Red Flags:          #FF4343  (Blood Crimson)
Warning / Power Plays:       #FFB800  (Amber Gold)

Typography:
- Display/Headings:          Bebas Neue / Space Grotesk (Bold, uppercase theatrical)
- Numbers & Scores:          JetBrains Mono (Forensic terminal look)
- Body & Chat:               Inter (Crisp readability)
```

---

## 4. Screen-by-Screen UI & Component Blueprint

### Screen 1: The Import & Analysis Hub (`app/(tabs)/index.tsx`)
The entry point where conversations are ingested and reports are initiated.

```
┌──────────────────────────────────────────┐
│  ASSIFY                   [⚙️ Settings] │
│  Local Relationship OS     [⚡ Connected]│
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │   📥 DROP WHATSAPP CHAT (.txt)   │   │
│   │                                  │   │
│   │   Tap to browse file or          │   │
│   │   Share directly from WhatsApp   │   │
│   └──────────────────────────────────┘   │
│                                          │
│   VIBE CALIBRATION:                      │
│   ┌──────────────────┬─────────────────┐ │
│   │  🧠 Therapy Mode │ 🔥 Unhinged Mode│ │
│   └──────────────────┴─────────────────┘ │
│                                          │
│   [ 🔥 LAUNCH FORENSIC ANALYSIS ]        │
│                                          │
│   ACTIVE CONTACTS ANALYZED:              │
│   ┌──────────────────────────────────┐   │
│   │ 👤 Sarah                         │   │
│   │ Delulu Score: 78% | Situationship│   │
│   │ Last Analyzed: 2 days ago   [➜]  │   │
│   └──────────────────────────────────┘   │
│   ┌──────────────────────────────────┐   │
│   │ 👤 Jessica                       │   │
│   │ Delulu Score: 24% | Secure       │   │
│   │ Last Analyzed: Aug 12       [➜]  │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

#### Key Micro-Interaction during Analysis:
When analysis begins, show an animated glowing radar circle with witty, progressive status messages cycling every 3 seconds:
1. *"Parsing 14,291 WhatsApp messages..."*
2. *"Calculating who leaves who on read..."*
3. *"Detecting double-text panic events..."*
4. *"Measuring delusional tolerance levels..."*
5. *"Synthesizing Act 10 Red Flag Receipts..."*

---

### Screen 2: The Theatrical Act Report Card (`app/report/[id].tsx`)
A vertical scrolling dashboard organized into theatrical Acts with collapsible modules.

#### 1. Hero: The Glowing Delulu Meter (Act 2)
- An animated circular gauge (`0` to `100%`) built with `react-native-reanimated` and SVG.
- Center displays the large score: e.g. **`78%`**.
- Subtitle: *"DANGEROUSLY HOPEFUL"*
- Survival Odds pill: `14% chance of surviving 90 days`.

#### 2. Power Dynamics Bar (Act 1)
- A split progress bar showing the psychological balance of power:
  ```
  [ YOU: 32% ]████████░░░░░░░░░░░░░░░░[ HER: 68% ]
  ```
- Subtitle: *"You are currently the designated over-explainer; she holds the silence leverage."*

#### 3. Character RPG Stat Cards (Act 4)
- Two side-by-side player cards:
  - **Your Stats:**
    - Patience: `88/100`
    - Simp Factor: `92/100`
    - Boundary Setting: `14/100`
    - Paragraph Length: `95/100`
  - **Her Stats:**
    - Mixed Signals: `85/100`
    - Response Delay: `78/100`
    - Guilt Deflection: `91/100`
    - Vulnerability: `22/100`

#### 4. Evidence Locker: Swipeable Receipts (Act 10)
- Swipeable cards (Tinder-style gesture using `react-native-gesture-handler`):
  - Card Header: `🚨 RED FLAG #1: "The 48-Hour Vanish"` (Severity: 5/5)
  - Quoted Receipt:
    > *"Sorry was super busy with work all weekend"*  
    > *Sent: Sunday 11:42 PM (46 hours after your message)*
  - Forensic Commentary:
    *"She posted 4 Instagram stories while 'too busy' to reply to your 4-word question."*

#### 5. Strategy Handbook: Dos and Don'ts (Act 14)
- A two-column interactive checklist:
  - **DO:**
    - Match her response latency (if she takes 2 hours, do not reply in 30 seconds).
    - Keep texts to 1 sentence maximum.
  - **DON'T:**
    - Send clarifying follow-up texts when left on read.
    - Ask *"Are you mad at me?"*.

---

### Screen 3: Doctor Delulu AI Chatroom (`app/coach/[contact].tsx`)
A dedicated relationship coaching messenger interface.

```
┌──────────────────────────────────────────┐
│  [←]  DR. DELULU COACH        [Dossier]  │
│       Sarah • Situationship              │
├──────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐   │
│   │ 🩺 Dr. Delulu:                   │   │
│   │ I reviewed your 14,000 texts with│   │
│   │ Sarah. She has an avoidant style │   │
│   │ and currently holds 68% of the   │   │
│   │ conversational power. What's on  │   │
│   │ your mind today?                 │   │
│   └──────────────────────────────────┘   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │ 👤 You:                          │   │
│   │ She didn't reply to my morning   │   │
│   │ text. Should I call her tonight? │   │
│   └──────────────────────────────────┘   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │ 🩺 Dr. Delulu:                   │   │
│   │ Absolutely not. In Act 5, we     │   │
│   │ identified that calling her after│   │
│   │ radio silence triggers her       │   │
│   │ withdrawal reflex. Put the phone │   │
│   │ down. Let her initiate.          │   │
│   └──────────────────────────────────┘   │
│                                          │
│   QUICK PROMPTS:                         │
│   [ "Translate her last text" ]          │
│   [ "Am I being delusional?" ]           │
│   [ "Draft a chill reply" ]              │
│                                          │
│   ┌───────────────────────────┬──────┐   │
│   │ Ask Dr. Delulu...         │ [ ➜ ]│   │
│   └───────────────────────────┴──────┘   │
└──────────────────────────────────────────┘
```

---

### Screen 4: Ghost Writer & God Mode (`app/(tabs)/ghost.tsx`)
The tactical real-time message composer.

```
┌──────────────────────────────────────────┐
│  👻 GHOST WRITER          [Active: Sarah]│
├──────────────────────────────────────────┤
│  INCOMING MESSAGE (PULLED FROM DB):      │
│  ┌──────────────────────────────────┐    │
│  │ "yeah maybe if im free later"    │    │
│  └──────────────────────────────────┘    │
│                                          │
│  CALIBRATED REPLIES (3-OPTION TRIAD):    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ ⚡ RIZZ / WITTY                   │    │
│  │ "careful, don't overwhelm your   │    │
│  │ calendar 😏"                      │    │
│  │                            [COPY]│    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ 🛡️ THE CALM ANCHOR (BOUNDARIES)   │    │
│  │ "cool, let me know by 6 so I can │    │
│  │ lock in my evening"              │    │
│  │                            [COPY]│    │
│  └──────────────────────────────────┘    │
│                                          │
│  🎙️ GOD MODE (VOICE INTENT):             │
│  Speak your messy thought, we translate  │
│                                          │
│              ┌────────────┐              │
│              │    🎙️     │              │
│              │ HOLD TO TALK│             │
│              └────────────┘              │
│   "tell her sounds good but im also      │
│    making other plans so whatever"       │
└──────────────────────────────────────────┘
```

---

## 5. Direct WhatsApp Share Intent Integration

In Delulu, the user doesn't manually search for a file on their phone. They use the **native Android Share Sheet**:

### The User Flow:
1. Open WhatsApp chat with the person.
2. Tap the three dots (⋮) $\rightarrow$ **More** $\rightarrow$ **Export chat** $\rightarrow$ **Without media**.
3. Android opens the standard "Share via..." modal.
4. User taps **Assify**.
5. Assify opens, receives the file URI via `expo-sharing` / Android Intent filter, uploads it to your local server over Wi-Fi, and begins the analysis automatically!

### Expo Config Plugin for Android Intent Filter (`app.json`):
```json
{
  "expo": {
    "name": "Assify",
    "slug": "assify",
    "android": {
      "package": "com.assify.os",
      "intentFilters": [
        {
          "action": "SEND",
          "data": [
            { "mimeType": "text/plain" },
            { "mimeType": "application/zip" }
          ],
          "category": ["DEFAULT"]
        }
      ]
    }
  }
}
```

---

## 6. The REST API Bridge (`FastAPI` on your Laptop)

To link the Expo mobile app to your existing Python backend, you build a simple, clean **FastAPI server** on your PC (`backend/server.py`):

| Endpoint | Method | Input | Output | What it Calls in Your Code |
|---|---|---|---|---|
| `/api/upload` | `POST` | Multipart `.txt`/`.zip` | `{ task_id, contact_name }` | Calls `ingestion/pipeline.py` |
| `/api/status/{task_id}` | `GET` | `task_id` | `{ progress: 75, step: "Acts" }` | Returns background analysis status |
| `/api/contacts` | `GET` | None | `[ { name, delulu_score, status } ]` | Queries `relationship_profiles` |
| `/api/report/{contact}` | `GET` | `contact_name` | `{ acts: [...], chronemics: {...} }` | Queries `report_acts` & `chronemics_stats` |
| `/api/coach/chat` | `POST` | `{ contact, message, session_id }` | Stream of tokens / Text | Calls `agents/coach.py` (Ollama) |
| `/api/ghost/reply` | `POST` | `{ contact, vibe, incoming_msg }` | `{ replies: [Option A, B, C] }` | Calls `agents/ghost_writer.py` |
| `/api/ghost/voice` | `POST` | Audio file (`.wav`/`.m4a`) | `{ transcript, polished_reply }` | `faster-whisper` $\rightarrow$ LLM |

---

## 7. Phased Implementation Plan for the Mobile App

To keep your learning manageable and avoid feeling overwhelmed, build the mobile app in 3 disciplined phases:

### Phase A: The Backend REST API (Python)
- Wrap your existing Assify code into FastAPI routes.
- Test endpoints locally with Postman or `curl` to make sure your laptop returns JSON cleanly.

### Phase B: Initialize Expo & Build Screens with Mock Data
- Run `npx -y create-expo-app@latest assify-mobile --template blank-typescript`.
- Install UI libraries: `lucide-react-native`, `react-native-reanimated`, `expo-router`.
- Build the 4 screens with hardcoded JSON mock data so you can perfect the look, feel, animations, and typography first.

### Phase C: Wire Mobile to Local Server over Wi-Fi
- Use `fetch('http://<YOUR_LAPTOP_IP>:8000/api/...')` in your React Native app.
- Start Expo with `npx expo start`.
- Open the Expo Go app on your physical phone, scan the QR code on your terminal, and watch your mobile app come alive with your real WhatsApp data!
