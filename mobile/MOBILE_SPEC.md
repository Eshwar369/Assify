# 📱 ASSIFY — Mobile Architecture & Design System Specification

> **Product:** ASSIFY Mobile Client (iOS & Android)  
> **Framework:** React Native with Expo SDK 54, TypeScript, Expo Router  
> **Aesthetic Philosophy:** Apple-Grade Minimalist Luxury with a Playful Edge  
> **Brand Identity:** Sophisticated, sleek, and brutally insightful. Feels like an Apple Design Award winner with witty relationship intelligence.

---

## 🎨 1. Design System & Token Hierarchy

### 1.1 Color Palette
The color scheme blends deep midnight obsidian with warm radiant citron and electric rose accents:

```typescript
export const Colors = {
  // Canvas & Backgrounds (Apple Deep Obsidian / Midnight Navy)
  background: "#08090E",       // Ultra-deep void background
  surface: "#0E1017",          // Primary card background
  surfaceElevated: "#151824",  // Raised modals, action sheets
  surfaceGlass: "rgba(21, 24, 36, 0.75)", // Translucent frosted glass

  // Borders & Dividers
  borderSubtle: "rgba(255, 255, 255, 0.06)", // Hairline divider
  borderActive: "rgba(255, 214, 10, 0.35)",  // Subtle yellow glow
  borderRose: "rgba(255, 55, 95, 0.35)",    // Subtle rose glow

  // Primary Accents (The ASSIFY Signature Duo)
  accentYellow: "#FFD60A",     // Radiant Citron Gold (Scores, highlights, brilliance)
  accentYellowMuted: "#C7A600", // Darker gold for borders and subtle tags
  accentRose: "#FF375F",       // Electric Rose / Vivid Pink (Chemistry, romantic tension)
  accentRoseMuted: "#D62249",  // Subtle rose for soft chips and badges

  // Secondary Accents
  accentCyan: "#32ADE6",       // Digital rhythm, chronemics, logic
  accentGreen: "#30D158",      // Green flags, healthy patterns
  accentOrange: "#FF9F0A",     // Red flags, power warnings

  // Text Hierarchy (Apple SF Pro Spec)
  textPrimary: "#F5F5F7",      // High-contrast clean white
  textSecondary: "#A1A1A6",    // Elegant secondary gray
  textTertiary: "#636366",     // Subtle timestamps and meta
  textMuted: "#48484A",        // Watermarks and faint captions
};
```

### 1.2 Typography Hierarchy
- **Display 1 (Hero Numbers & Scores):** 48pt, Bold / Heavy, `-0.5` tracking.
- **Title 1 (Act Titles & Section Headers):** 28pt, SemiBold, `-0.3` tracking.
- **Title 2 (Card Headers & Contact Alias):** 20pt, SemiBold.
- **Body Large (Diagnosis & Quotes):** 16pt, Regular / Medium, line height 22pt.
- **Caption / Meta (Timestamps & Badges):** 12pt, Medium / SemiBold, uppercase tracking `+0.5`.

---

## 🏛️ 2. Core Navigation Architecture (4-Pillar Intelligence Suite)

```
                       ┌───────────────────────┐
                       │   ASSIFY App Root     │
                       └──────────┬────────────┘
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       │                          │                          │
┌──────┴───────┐           ┌──────┴───────┐           ┌──────┴───────┐
│ 1. Profiler  │           │ 2. The Keep  │           │  3. Coach    │
│  (Dossier &  │           │(Vault & Date │           │ (Doctor Ass- │
│   17 Acts)   │           │   Oracle)    │           │    ify)      │
└──────────────┘           └──────────────┘           └──────────────┘
                                  │
                           ┌──────┴───────┐
                           │ 4. Timeline  │
                           │(Story Diary  │
                           │ & Evolution) │
                           └──────────────┘
```

### Tab 1: The Profiler (Home)
- **Top Header:** Contact Switcher pill (`"Sleepless Zombiee" ▾`) + Quick Ingest button.
- **Master Dossier Card:**
  - Animated Radial Gauge showing **Delulu Score** (0–100) with glowing pulse.
  - **Power Balance Slider:** User 48% vs Contact 52% with bidirectional glow.
  - **Archetype Badges:** User (*The Flirtatious Sparring Partner*) vs Contact (*The Chaotic Firehose*).
  - **Primary Action Button:** *"Launch Theatrical Dossier (17 Acts)"* (triggers full-screen story mode).
- **Executive Summary:** Brutal 2-sentence reality check.
- **Quick Metric Grid:** Chemistry (85%), Survival Odds (65%), Median Reply Speed (0.5m), Double-Texts (6,481).

### Tab 2: The Keep (Relationship Memory Vault)
- **Category Filter Chips:** All, Food, Movies, Gifts, Nicknames, Dislikes.
- **Curated Memory Cards:**
  - Target Badge (*For Contact* vs *For User*).
  - Exact quoted chat context with timestamp.
  - Category icon (Lucide icons: `Utensils`, `Film`, `Gift`, `Heart`, `MapPin`).
- **The Date & Gift Oracle Carousel:**
  - AI-generated bespoke date blueprints based on extracted cravings.
  - Creative gift recommendations.

### Tab 3: The Coach (Doctor Assify)
- **Role:** Real-time conversational wingman and tactical advisor.
- **Context Injection:** Ingests the 17 Acts and The Keep into prompt context.
- **Quick Action Prompts:**
  - *"Decode her last message"*
  - *"How should I reply to keep the banter alive?"*
  - *"Are we actually heading towards dating or staying friends?"*
- **Streaming Chat UI:** Apple iMessage-inspired sleek bubbles with markdown formatting.

### Tab 4: The Timeline (Story Diary)
- **Monthly Story Chapters:** AI-narrated chapters tracking how the connection evolved month-by-month.
- **Trajectory Visualizer:** Graphical curve showing chemistry and communication intensity shifts across epochs.

---

## 🎭 3. The 17-Act Immersive Story Swiper Specification

### 3.1 Interaction Design
- **Paging:** Vertical full-screen snapping cards (`snapToInterval={SCREEN_HEIGHT}`).
- **Progress Header:** 17 thin indicator ticks along the top edge (active act highlighted in Citron Gold).
- **Haptic Feedback:** Subtle sensory click (`expo-haptics`) on every page snap.
- **Social Export:** 1-tap screenshot generation to export individual cards formatted for Instagram/Snapchat Stories (`9:16` aspect ratio with clean watermark and QR).

### 3.2 Act Cards Layout Template
- **Card Header:** Act number (`ACT 01 OF 17`) + Act Title in sleek uppercase.
- **Card Centerpiece:**
  - Acts 1–3: Animated Delulu Meter & Archetype Clash diagrams.
  - Acts 4–6: Interactive Subtext Decoder (tap to reveal what was *actually* meant).
  - Acts 7–9: Chronemics Radar & 4-Epoch Timeline Cards.
  - Acts 10–11: Forensic Evidence Receipts Locker (tap quote to view original context).
  - Act 12: Pop Culture Movie Poster comparison (*Crazy, Stupid, Love*).
  - Acts 13–14: Scenario Simulator with probability sliders.
  - Act 15: Greatest Hits & Cringe Hall of Fame.
  - Act 16: Golden Trophy Awards.
  - Act 17: Final Verdict & Survival Forecast.
