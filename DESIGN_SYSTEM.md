# 📐 ASSIFY Production Design System & Visual Specification (DESIGN_SYSTEM.md)

> **The Single Source of Truth for ASSIFY UI/UX**  
> **Aesthetic Benchmark:** Apple.com Editorial Design + Apple Human Interface Guidelines (Light Edition)  
> **Philosophy:** Monochromatic luxury, pure white backgrounds, high-contrast typography, data-as-decoration, and surgical micro-accents.

---

## 🏛️ 1. Executive Visual Foundation

Every screen in ASSIFY is built from this non-negotiable visual baseline. No ad-hoc colors, arbitrary paddings, or foreign fonts may be introduced in any component.

### 1.1 Color Tokens & Palette

| Token Name | Hex / Value | Usage & Apple HIG Role |
| :--- | :--- | :--- |
| `background` | `#FFFFFF` | **Pure Canvas White** (Apple.com hero background). Crisp, premium, spacious. |
| `backgroundSecondary` | `#F5F5F7` | **Apple Grouped Slate** (Section fills, inset panels, pill containers). |
| `backgroundElevated` | `#FFFFFF` | **Card Surface** (Opaque white with soft ambient shadow). |
| `textPrimary` | `#000000` | **Jet Black** (Display titles, hero stats, active emphasis). |
| `textSecondary` | `#1D1D1F` | **Dark Slate** (Apple standard body copy, descriptions, card headers). |
| `textTertiary` | `#86868B` | **Apple Muted Gray** (Metadata, timestamps, subtle captions). |
| `textQuaternary` | `#C7C7CC` | **Ghost Gray** (Disabled states, decorative delimiters). |
| `borderHairline` | `rgba(0, 0, 0, 0.06)` | **Sub-pixel Separators** (1px crisp dividing lines). |
| `borderCard` | `rgba(0, 0, 0, 0.04)` | **Card Outline** (Combined with ambient shadow for crisp edge definition). |
| `accentGold` | `#BF9B28` | **Champagne / Mustard Gold** (Surgical high-value micro-accents, VIP badges, verified receipt seals). |
| `accentGoldSoft` | `rgba(191, 155, 40, 0.10)` | Gold badge backgrounds and pill highlights. |
| `accentRose` | `#E8A0BF` | **Blush / Dusty Rose** (Chemistry, emotional tension, romantic metrics). |
| `accentRoseSoft` | `rgba(232, 160, 191, 0.12)` | Rose badge backgrounds and tension indicator pills. |
| `accentSuccess` | `#34C759` | **Apple System Green** (Healthy reciprocity, low delulu indicators). |
| `accentWarning` | `#FF9500` | **Apple System Orange** (Moderate risk, one-sided effort cautions). |
| `accentDanger` | `#FF3B30` | **Apple System Red** (Critical red flags, 3:00 AM double-text alerts). |

#### 1.1.1 Score-Adaptive Dynamic Signature Accent
Rather than a fixed rainbow of colors, ASSIFY uses a **Dynamic Score Accent** that shifts based on the relationship's Delulu Score ($\Delta$):
- **0% – 34% (Grounded & Reciprocal):** `#34C759` (Apple Green) with `#F5F5F7` neutral bases.
- **35% – 64% (Simmering Delulu / Caution):** `#BF9B28` (Editorial Champagne Gold).
- **65% – 84% (High Chemistry / Severe Delulu):** `#E8A0BF` (Blush Rose) transitioning to `#FF9500` (Orange).
- **85% – 100% (Cinematic Downfall / Red Flag):** `#FF3B30` (Apple Red) with stark Jet Black contrast.

---

### 1.2 Typography Hierarchy (SF Pro / System Editorial)

All typography adheres to strict Apple Title Case conventions (zero shouting ALL-CAPS except for micro-badges $\le 11\text{px}$).

```
Display Large:   38px | 800 (Bold)     | -0.8px tracking | Line Height: 44px
Display Medium:  30px | 700 (Bold)     | -0.6px tracking | Line Height: 36px
Title Large:     24px | 700 (Bold)     | -0.4px tracking | Line Height: 30px
Title Medium:    20px | 600 (Semibold) | -0.3px tracking | Line Height: 26px
Headline:        17px | 600 (Semibold) | -0.2px tracking | Line Height: 22px
Body Large:      16px | 400 (Regular)  | -0.1px tracking | Line Height: 24px
Body Medium:     14px | 400 (Regular)  |  0.0px tracking | Line Height: 20px
Caption:         12px | 500 (Medium)   | +0.2px tracking | Line Height: 16px
Micro Label:     10px | 600 (Semibold) | +0.8px tracking | Uppercase (Badges only)
```

---

### 1.3 Surface Geometry & Shadows (Shadow-Elevated Opaque)

Glassmorphism is retired on light background surfaces in favor of Apple's **Shadow-Elevated Opaque** recipe to guarantee pristine readability and 60fps scrolling:

```typescript
// Apple Soft Ambient Elevation Token
export const Elevation = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    // iOS shadow:
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    // Android elevation:
    elevation: 2,
  },
  cardFloating: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  pill: {
    backgroundColor: '#F5F5F7',
    borderRadius: 9999,
  }
};
```

---

### 1.4 Spacing & Grid System (Airy & Generous)

Rooted in Apple.com's generous breathing room:
- **Micro Space (`xs`):** `4px`
- **Compact Space (`sm`):** `8px`
- **Standard Padding (`md`):** `16px`
- **Card Gutter (`lg`):** `24px`
- **Section Breathing Room (`xl`):** `36px`
- **Hero Stanza Gap (`xxl`):** `48px`
- **Screen Gutter:** `20px` horizontal screen margin.
- **Web Desktop Canvas Constraint:** Centered mobile container with `maxWidth: 480px` on desktop viewport.

---

### 1.5 Navigation Pattern: Profile Avatar Trigger + Navigation Drawer

1. **Top Navigation Header (Persistent across all main screens):**
   - Left: Screen Title or ASSIFY Monogram (`"ASSIFY"` in 18px 700 bold).
   - Right: **User Profile Avatar Circle** (36x36px with user initials or photo, subtle border).
2. **The Drawer / Navigation Sheet (Triggered by Avatar tap):**
   - Smooth right-to-left slide or full-screen Apple modal transition.
   - Contains:
     - User Identity Card & Quick Stats.
     - Section Navigation Links:
       - 🎯 **Radar** (Relationship Forensics & Command Center)
       - 💬 **Coach** (Doctor Delulu & Ghost Writer Reply Triad)
       - 📈 **Timeline** (Longitudinal Fever Chart & Turning Points)
       - 🗄️ **The Keep** (Partner Vault: Tastes, Gifts, Dates & Red Lines)
       - 🎬 **Replay Unboxing** (The 5-Beat Theatrical Reveal)
     - App Settings, Export/PII Data Controls, and Subscription status.

---

## 📱 2. Screen Specifications (The 6-Dimension Framework)

---

### Screen 1: Radar (Command Center & Forensic Verdict)

#### 1. Goal
Provide immediate, irrefutable clarity on relationship balance through a single heroic visual metric (The Delulu Gauge) backed by mathematical chronemics (response latency, initiation ratio, word counts).

#### 2. Audience
The anxious or curious user who just uploaded a WhatsApp/iMessage chat and wants an authoritative, no-BS answer: *"Are they actually into me, or am I being delusional?"*

#### 3. Content
1. **Hero Delulu Gauge (Centerpiece):** Circular animated meter tracking Delulu Score (0–100%) with dynamic status label (*"Simmering Delulu"*, *"Reciprocal Chemistry"*, *"Textbook Clownery"*).
2. **Key Metric Triad (3-Card Horizontal Grid):**
   - *Response Latency Gap* (e.g., You: 4m vs. Them: 3h 42m).
   - *Initiation Balance* (e.g., You: 78% vs. Them: 22%).
   - *Effort Ratio* (Average words per message: 28 words vs. 4 words).
3. **The Executive Roast / Verdict Card:** 2-3 line psychological diagnosis written by Doctor Delulu.
4. **Key Red Flags & Green Flags Chips:** Horizontal pill list with micro-counters.
5. **Quick Action Bar:** *"Ask Doctor Delulu"* button + *"View Chat Receipts"* button.

#### 4. Layout & Structure
- **Top:** Sticky white navigation bar with ASSIFY wordmark + Profile Avatar.
- **Hero Section (Airy, 40px top padding):** Centered circular Delulu Gauge with subtitle.
- **Middle Section (24px gap):** Three equal-width summary cards in a row.
- **Bottom Section (32px padding):** White shadow-elevated verdict card with subtle `#BF9B28` gold badge.

#### 5. Interaction & Motion
- **On Screen Load:** Subtle spring entrance of the gauge needle/arc (`stiffness: 90, damping: 15`).
- **Metric Cards:** Staggered fade and slide up (`delay: 100ms`).
- **Tap on Metric Card:** Expands modal with deep-dive chart.

#### 6. Emotion
Authoritative, calm, clarifying, subtly witty. Relieves anxiety by replacing speculation with empirical data.

---

### Screen 2: Coach (Doctor Delulu & The De-Escalation Triad)

#### 1. Goal
Turn relationship panic into calm tactical mastery. Provide real-time AI strategic advice and copy-pasteable message replies tailored to high-stakes moments.

#### 2. Audience
The user staring at their phone at 11:30 PM with their finger on the send button, wondering what to say next to de-escalate an argument or reignite interest without appearing desperate.

#### 3. Content
1. **The Tactical Reply Triad (Hero Feature):**
   - *Option A: The De-escalator* (Validates feelings, reduces defensiveness, takes healthy accountability).
   - *Option B: The Playful Defuser* (Warm banter, cuts through passive-aggressive loops).
   - *Option C: The Calm Anchor* (Firm boundaries with zero hostility).
   - Each option includes a one-tap **"Copy to Clipboard"** action with haptic confirmation.
2. **Doctor Delulu Chat Thread:** Real-time conversational AI coach trained on attachment theory and conversational chronemics.
3. **Context Banner:** Current active topic or detected relationship tension.

#### 4. Layout & Structure
- **Top:** Minimal header with Doctor Delulu avatar badge + Active Tension Pill.
- **Hero Stanza:** The 3 Reply Cards rendered as stacked white elevated cards with accent tags (`#BF9B28` for Anchor, `#E8A0BF` for Playful, `#34C759` for De-escalator).
- **Bottom:** Interactive message input bar with suggestion pills above the keyboard.

#### 5. Interaction & Motion
- **Copy Action:** Micro-haptic tick (`Haptics.impactAsync(Light)`), button morphs to checkmark for 1.5s with spring scale.
- **Chat Bubbles:** User messages use `#000000` fill with `#FFFFFF` text. Doctor Delulu responses use `#F5F5F7` cards with `#1D1D1F` text.

#### 6. Emotion
Grounding, tactical, protective, empowering. Eliminates the frantic *"what do I say?"* spiral.

---

### Screen 3: Timeline (Longitudinal Fever Chart & Relationship Arc)

#### 1. Goal
Chart the trajectory of the relationship over weeks or months to reveal whether emotional investment is compounding or decaying.

#### 2. Audience
Users looking back over an entire connection (months of chat history) to pinpoint when the dynamic shifted, or partners tracking their communication health over time.

#### 3. Content
1. **The Longitudinal Fever Chart (Interactive Line/Curve):** Delulu score or initiation ratio plotted across dates.
2. **Turning Point Markers:** Interactive pins on dates where significant behavioral shifts occurred (e.g., *"Aug 14: Latency spiked from 12m to 4h"*, *"Oct 02: First dropped call"*).
3. **Weekly Volume Breakdown:** Bar chart showing message count by week and day-of-week heatmaps.
4. **Relationship Milestones Card:** First message date, peak messaging period, longest silent streak.

#### 4. Layout & Structure
- **Top:** Header with date range selector (`"All Time"`, `"Last 90 Days"`, `"Last 30 Days"`).
- **Hero Section:** Smooth Apple-style bezier curve chart with horizontal reference gridlines and date labels on X-axis.
- **Below Chart:** List of timestamped "Turning Point" cards with verified message snippets.

#### 5. Interaction & Motion
- **Touch-to-Scrub:** Dragging finger across the fever chart scrubs a vertical hairline indicator with real-time tooltip updating score and timestamp.
- **Haptics:** Gentle haptic tick on scrubbing over milestone points.

#### 6. Emotion
Reflective, forensic, sobering, objective. Gives the user perspective beyond the emotional rollercoaster of the day.

---

### Screen 4: The Keep (Partner Vault & Preference Ledger)

#### 1. Goal
Serve as the ultimate relationship intelligence vault, automatically cataloging partner tastes, gift ideas, favorite foods, movies, and hard boundaries mined from conversation.

#### 2. Audience
The thoughtful partner who wants to never forget a gift idea, favorite date spot, or casual remark their partner dropped three months ago.

#### 3. Content
1. **Category Filter Tabs:**
   - 🎁 *Gifts & Wished Items*
   - 🎬 *Movies & Watchlist*
   - 🍕 *Food & Dining Tastes*
   - 📍 *Date Ideas & Travel*
   - 🚫 *Red Lines & Pet Peeves*
2. **Keep Item Cards:** Each item features:
   - Item Name & Category Icon.
   - Status Toggle: `Saved` $\leftrightarrow$ `Purchased / Completed`.
   - **Verified Chat Receipt Callout:** Monospaced quote showing the exact message where they mentioned it with date.
3. **Quick-Add Floating Action Pill:** Quick manual entry button.

#### 4. Layout & Structure
- **Top:** Header with vault stats (*"24 items captured from 12,400 messages"*).
- **Subheader:** Horizontal scrolling category pill bar (`#F5F5F7` background, active pill in Jet Black `#000000` with white text).
- **Body:** 2-column or 1-column card feed with white elevated cards and delicate hairline dividers.

#### 5. Interaction & Motion
- **Checkbox Toggle:** Spring check animation with light haptic thump.
- **Filter Switch:** Layout animation as items reorder smoothly (`LayoutAnimation.configureNext`).

#### 6. Emotion
Warm, organized, attentive, romantic. Transforms mundane data into thoughtful real-world acts.

---

### Screen 5: The Theatrical Unboxing Sequence (5-Beat Reveal)

#### 1. Goal
Deliver the viral "Spotify Wrapped" dramatic crescendo that users record, share, and screenshot when a new chat export is analyzed.

#### 2. Audience
The excited user eagerly awaiting their verdict, ready to share the dramatic reveal with friends or on social media.

#### 3. Content & The 5 Dramatic Beats
1. **Beat 1 — Telemetry Pulse (The Scan):**
   - Live scanning steps with progressive counts: *"Parsing 14,821 messages"*, *"Calculating $\Delta t$ response latency"*, *"Auditing 3:00 AM double-texts"*.
   - Rhythmic light haptic pulses.
2. **Beat 2 — Suspense Build (Spring Gauge Wind-Up):**
   - Delulu Gauge spins up from 0 to target score with physical spring physics.
   - Color shifts smoothly from neutral champagne gold to the final score's dynamic accent.
   - Accelerating haptic frequency.
3. **Beat 3 — The Verdict Slam:**
   - Sudden pause $\to$ Heavy haptic thump $\to$ High-contrast title drop (e.g., *"CLASSIFICATION: CLOWN ACADEMY DEAN"*).
4. **Beat 4 — Evidence Locker Unfolding (The Receipts):**
   - Sequential chapter cards slide in with timestamped quotes of the most unhinged or sweet exchanges.
5. **Beat 5 — The 9:16 Viral Receipt Card:**
   - One-tap export to Instagram Story / TikTok format with editorial typography, minimal white border, Delulu Gauge, and subtle `ASSIFY // assify.app` mark.

#### 4. Layout & Structure
- Fullscreen immersive takeover (no navigation bar, no tab bar).
- Centered stage layout with dark or bright high-contrast focal points.
- Bottom floating sticky CTA: *"Export Viral Receipt"* and *"Enter Command Center"*.

#### 5. Interaction & Motion
- Complete orchestrated sequence with Reanimated 3 springs and `expo-haptics`.
- Gesture: Swipe down to dismiss and enter the Radar.

#### 6. Emotion
Electrifying, suspenseful, laugh-out-loud funny, deeply shareable.

---

### Screen 6: Onboarding & First-Time Experience

#### 1. Goal
Educate the user on ASSIFY's value proposition in 3 screens and guide them through exporting their first WhatsApp or iMessage chat in under 30 seconds with zero privacy anxiety.

#### 2. Audience
New users who saw ASSIFY on TikTok/Instagram or were recommended by a friend and want to test it immediately.

#### 3. Content
1. **Screen 1 — Value Hook:** *"The Relationship Intelligence Engine."* Clear editorial preview of the Delulu Gauge and forensic chronemics.
2. **Screen 2 — Zero-Trust Privacy Promise:** Explicit breakdown that chats are analyzed with local PII scrubbing (phone numbers, full names, locations masked on-device).
3. **Screen 3 — Guided Upload (Dropzone):** Visual 3-step walkthrough for WhatsApp (`Export Chat -> Without Media -> Share to ASSIFY`) + File Picker button.

#### 4. Layout & Structure
- Clean white viewport with Apple-style step indicators (3 delicate dots).
- Bottom sticky primary CTA: *"Get Started"* $\to$ *"Upload Chat File"*.

#### 5. Interaction & Motion
- Horizontal paginated swipe with spring deceleration.
- Dropzone pulses gently on hover/press.

#### 6. Emotion
Safe, trustworthy, ultra-modern, effortless.

---

### Screen 7: Profile & Navigation Drawer

#### 1. Goal
Provide seamless, non-intrusive navigation between all app modules, account settings, and relationship switching without cluttering the bottom of the screen with a bulky tab bar.

#### 2. Audience
Users navigating between analysis tools or managing their profile.

#### 3. Content
1. **User Header:** Avatar, Name, Active Relationship Tag (e.g., *"Analyzing: Sarah"* with dropdown to switch partners).
2. **Core Navigation Items:**
   - 🎯 Radar (Command Center)
   - 💬 Coach (Doctor Delulu & Reply Triad)
   - 📈 Timeline (Fever Chart)
   - 🗄️ The Keep (Partner Vault)
   - 🎬 Replay Unboxing
3. **System Links:** Upload New Chat, Privacy & PII Settings, Help, About ASSIFY.
4. **App Version & Build Tag.**

#### 4. Layout & Structure
- Slides out smoothly from the right or acts as a modal overlay on top of the current screen.
- Navigation items formatted as Apple-style grouped rows (`#FFFFFF` on `#F5F5F7` background with trailing chevron).

#### 5. Interaction & Motion
- Spring slide-in (`damping: 20, stiffness: 120`).
- Background backdrop dims to `rgba(0, 0, 0, 0.25)`.
- Tap on item navigates and smoothly auto-closes the drawer.

#### 6. Emotion
Clean, tucked-away, premium, distraction-free.

---

## 🛠️ 3. Component Architecture & Implementation Standard

To guarantee 100% fidelity to this design system, all screens must import shared primitives from `@/components/ui/` rather than creating inline card styles:

1. **`AppleElevatedCard`**: Standard white opaque container with `#0000000A` ambient drop shadow, 16px radius, and sub-pixel hairline.
2. **`DeluluGaugeLight`**: Light-mode SVG/Canvas gauge with crisp black numerals, subtle gold/rose progress arc, and spring needle physics.
3. **`AppHeader`**: Persistent header bar containing ASSIFY title + profile avatar trigger.
4. **`NavigationDrawer`**: Reanimated slide-out drawer providing routing across all 5 modules.
5. **`MetricPill`**: Grouped micro-stat badge with `#F5F5F7` fill and SF Pro caption styling.
6. **`ReceiptCallout`**: Light editorial blockquote with monospaced timestamp and verified seal.

---

*This document is locked and serves as the architectural contract for all subsequent frontend engineering sprints.*
