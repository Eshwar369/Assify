# 🔬 Delulu Check — Complete Reverse Engineering Analysis

> **Source:** APK `com.dirtcube.deluluapp_2.1.1.xapk` (v2.1.1, build 96)  
> **Company:** Arkhai Technologies (DirtCube Studios / parikhorg)  
> **Package:** `com.dirtcube.deluluapp`  
> **Tagline:** *"Your AI Dating Co-Pilot"*

---

## 1. What Delulu Check Actually Is

Delulu Check is a **cloud-based AI relationship analysis app**. Users upload conversation exports (WhatsApp `.txt`/`.zip`, Instagram DMs), and the app sends them to a server that runs GPT-based analysis, producing a massive multi-section "report card" about their relationship dynamics.

### The Core Value Proposition
- "Your friends lie to you. We won't."
- Upload your chat → Get a "brutally honest" AI-generated relationship analysis
- 17 report sections, 50+ metrics, 8 pages of analysis
- AI dating coach ("Doctor Delulu") that knows your report
- AI keyboard ("Ghost Writer") that composes messages for you

### Critical Architectural Difference from ASSIFY
| | **Delulu Check** | **Your ASSIFY** |
|---|---|---|
| **Processing** | ☁️ 100% Cloud (Supabase + Vercel + GPT) | 🏠 100% Local (Ollama + SQLite) |
| **Privacy** | They claim "auto-deleted after analysis" | Truly air-gapped, zero-cloud |
| **Model** | OpenAI GPT (cloud API calls) | phi3-mini / llama3 (local Ollama) |
| **Use Case** | One-shot report generation | Continuous real-time copilot |
| **Input** | Upload once, get a report | Persistent memory, ongoing queries |
| **Storage** | Server-side Supabase (PostgreSQL) | Local SQLite + ChromaDB |
|   |   |   |

---

## 2. The Tech Stack (Extracted from APK)

### Frontend (Mobile App)
- **Framework:** React Native + **Expo SDK 54** (latest)
- **Language:** JavaScript/TypeScript (13MB bundled JS)
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Likely Zustand or React Context (no Redux detected)
- **UI Libraries:**
  - React Navigation (stack + tab navigators)
  - Expo Vector Icons (FontAwesome, Ionicons, MaterialIcons, etc.)
  - Coil3 (image loading)
  - Custom fonts: Inter, Bangers, Bebas Neue, Caveat, Oswald, JetBrains Mono, CalSans
- **Animations:** React Native Reanimated (heavily used throughout)

### Backend (Server-Side)
- **API Server:** Next.js on Vercel (`delulucheck.com`)
- **Database:** Supabase (PostgreSQL + Auth)
  - Supabase URL: `fzmxnhmaamqxqnuqgzjb.supabase.co`
  - Auth via Supabase (email + Google OAuth)
- **AI Processing:** OpenAI GPT API (server-side, NOT on-device)
  - GPT is called from the Vercel backend, NOT from the app
  - The string `gpt-chat` appears in API routes
  - Chat completion streaming: `processChatCompletionChunk`, `processChatCompletionToolCalls`
- **Payments:** Google Play Billing + Apple IAP (no RevenueCat — custom billing API)
- **Analytics:** Mixpanel (17 references), Sentry (error tracking, 70 references)
- **Push Notifications:** FCM (Firebase Cloud Messaging) + Expo Notifications

### Platform Features
- **Share Extension:** Share screenshots directly from WhatsApp/Instagram → Delulu
- **Custom Keyboard:** "Delulu Keyboard" — a custom iOS/Android keyboard that generates replies
- **Live Activities (iOS):** Real-time analysis progress on lock screen
- **Quick Actions:** Home screen shortcuts
- **Biometric Auth:** Fingerprint/Face unlock support
- **Deep Links:** `delulucheck.com/results/*`, `delulucheck.com/r/*`
- **Barcode/QR Scanning:** MLKit barcode models bundled (390KB TFLite model)

---

## 3. The Complete API Surface (Extracted from JS Bundle)

### Authentication
| Endpoint | Purpose |
|---|---|
| `/api/auth/send-otp` | Email OTP authentication |
| `/api/auth/resend-otp` | Resend OTP |
| `/api/auth/verify-otp` | Verify OTP code |
| Google OAuth | via `@react-native-google-signin` |

### Chat Upload & Analysis
| Endpoint | Purpose |
|---|---|
| `/api/upload/init` | Initialize a new upload session |
| `/api/upload/complete` | Mark upload as complete |
| `/api/upload/finalize` | Finalize the upload for processing |
| `/api/upload/flag` | Flag uploaded content |
| `/api/check-status` | Poll analysis progress |
| `/api/analyze-queue` | Queue a chat for analysis |
| `/api/get-user-analyses` | Get all user's past analyses |
| `/api/get-user-contacts` | Get all analyzed contacts |

### Report & Results
| Endpoint | Purpose |
|---|---|
| `/api/share/list` | List shared reports |
| `/api/share/invite` | Share report via email |
| `/api/share/verify` | Verify shared access |
| `/api/share/revoke` | Revoke shared access |
| `/api/share/shared-with` | See who a report is shared with |
| `/api/facts/get-batch` | Get fun facts for the report |

### Doctor Delulu (AI Chat Coach)
| Endpoint | Purpose |
|---|---|
| `/api/chat/all-persons` | List all analyzed contacts |
| `/api/chat/conversations` | Get conversation threads |
| `/api/chat/create-conversation` | Start new coaching session |
| `/api/chat/delete-conversation` | Delete coaching session |
| `/api/chat/messages` | Get/send messages |
| `/api/gpt-chat` | Direct GPT chat endpoint |

### Ghost Writer (AI Reply Generator)
| Endpoint | Purpose |
|---|---|
| `/api/keyboard/provision-session` | Activate keyboard session |
| `/api/keyboard/revoke-session` | Deactivate keyboard session |

### Billing & Monetization
| Endpoint | Purpose |
|---|---|
| `/api/billing/plans` | Get available subscription plans |
| `/api/billing/entitlements` | Check user entitlements |
| `/api/billing/subscription/register` | Register new subscription |
| `/api/billing/cancel-subscription` | Cancel subscription |
| `/api/billing/detect-currency` | Auto-detect user currency |
| `/api/billing/validate-receipt` | Validate App Store/Play receipt |
| `/api/billing/unlock-report` | Unlock a specific report |
| `/api/billing/unlock-astrology` | Unlock astrology features |
| `/api/billing/redeem-code` | Redeem promo/gift code |
| `/api/billing/redeem-gift-credits` | Redeem gift credits |
| `/api/billing/referral/code` | Get referral code |
| `/api/billing/referral/configure` | Configure referral settings |
| `/api/billing/purchases` | Track purchases |

### Astrology (Cosmic Hub)
| Endpoint | Purpose |
|---|---|
| `/api/astrology/calculate` | Calculate astrology data |
| `/api/astrology/chats` | Astrology chat threads |
| `/api/astrology/get-result` | Get astrology reading result |
| `/api/astrology/hub` | Cosmic hub data |
| `/api/astrology/log-event` | Log astrology events |
| `/api/astrology/person/admin` | Person management |
| `/api/astrology/prefs` | Astrology preferences |
| `/api/astrology/save-reading` | Save a reading |
| `/api/astrology/sky-window` | Sky/celestial data |
| `/api/astrology/track` | Track astrology interactions |

### Miscellaneous
| Endpoint | Purpose |
|---|---|
| `/api/announcements/active` | In-app announcements |
| `/api/announcements/events` | Announcement events |
| `/api/blog/articles` | Blog content |
| `/api/blog/subscribe` | Email newsletter |
| `/api/broadcast` | Push broadcast |
| `/api/complaints` | User complaints |
| `/api/cosmic-beta-signup` | Beta feature signup |
| `/api/email/send-welcome` | Welcome email |
| `/api/live-activity/register-token` | iOS Live Activity tokens |
| `/api/push/opened` | Track push notification opens |
| `/api/v2/push/updateDeviceToken` | Update FCM token |

---

## 4. The Report — All 17 Sections ("Acts")

The analysis report is structured as a theatrical "play" with numbered Acts:

| Act# | Section Name | What It Analyzes |
|---|---|---|
| **Act 1** | **Power Dynamics** | Who has the power in the relationship, who initiates more, who yields |
| **Act 2** | **Delulu Meter** | A "delusion score" — how realistic are your expectations vs. what's actually happening |
| **Act 3** | **Behavioral Profiles** | Personality/behavioral analysis of both people in the chat |
| **Act 4** | **Character Stats** | RPG-style stat cards for each person (dimensions: dim1-dim4) |
| **Act 5** | **Power Plays** | Specific instances where someone exerted control or manipulation |
| **Act 6** | **Communication Breakdown** | Where and how communication fails between the two |
| **Act 7** | **Sexual Tension / Flirting Forensics** | Analysis of flirtatious behavior, receptivity metrics |
| **Act 9** | *(Unknown — fewer references)* | Possibly "Elephant in the Room" |
| **Act 10** | **Red Flags & Evidence Locker** | Specific red flags with cited evidence from the chat |
| **Act 12** | **Pop Culture Receipts** | Compares your relationship to pop culture/movie dynamics |
| **Act 13** | **Simulation Engine / Reality Check** | "What if" scenarios and reality-checking delusions |
| **Act 14** | **Strategy Handbook** | Actionable advice: avoid, concerning, positive, prep, responses |
| **Act 15** | **Predictions + Greatest Hits** | Future predictions (probability, timeframe, verdict) + funniest/cringiest moments |
| **Act 16** | **Awards Ceremony** | Fun awards for both people (12 different award categories) |

### Report Vibe Modes
Users choose a "vibe" before analysis:
- **🧠 Therapy Mode** — "PhD Level Insights. The clarity therapy gives you."
- **🔥 Unhinged Mode** — "The Roast of Your Relationship. No filter. No mercy. NSFW."

### Report-Preview Assets (found in manifest)
- `delulu-meter-real.png`
- `elephant-real.png` (the elephant in the room)
- `red-flags-real.png`
- `predictions-real.png`
- `character-stats-real.png`
- `decode-real.png`
- `timeline-real.png`
- `power-plays-real.png`
- `dos-donts-real.png`
- `hidden-dynamics-real.png`
- `pop-culture-real.png`
- `verdict-real.png`

---

## 5. The Ghost Writer Feature — How It Works

Ghost Writer is an AI message composer with multiple modes:

### Modes (extracted from tracking events + strings)
1. **Psychic** — Reads the conversation context and predicts what you should say
2. **Quick Reply** — Fast, contextual reply suggestions
3. **Rizz** — Flirty/charming message generation
4. **Compose** — Full message composition
5. **Reply** — Contextual reply to a specific message
6. **God Mode** — Voice-to-text: speak your intent, it generates the message

### How God Mode Works (from website)
1. User speaks: *"tell her I'm running late but make it flirty and crack a joke"*
2. The app applies selected vibes: `FLIRTY`, `FUNNY`, `CHILL`
3. AI generates: *"running late 😏 the mirror and i got into a staring contest and neither of us would lose. worth the wait, promise"*
4. User taps to send — "You never typed a word"

### Ghost Writer Tracking Events
- `trackGhostWriterOpened`
- `trackGhostWriterContactSelected`
- `trackGhostWriterModeSelected`
- `trackGhostWriterSessionFinish`
- `trackMessageGenerated`
- `trackMessageCopied`

---

## 6. Doctor Delulu — AI Dating Coach

A conversational AI chatbot that:
- **Knows your report inside out** — it has context of the full analysis
- Acts as a "relationship intelligence" coach
- Described as "your relationship coach + astro doctor"
- Has its own chat interface with conversation threads
- Users select a contact they've analyzed, then chat with Dr. Delulu about them
- Uses streaming chat completions from GPT

### How It Differs From Your FastChatAgent
| | **Doctor Delulu** | **Your FastChatAgent** |
|---|---|---|
| **Context Source** | Pre-generated report + original chat | Live vector search against raw messages |
| **Model** | GPT (cloud) | phi3:mini (local) |
| **Context Building** | Report is already a summary → feeds to GPT | RAG retrieval each query → feeds to LLM |
| **Persistence** | Conversation threads saved server-side | In-memory history with sliding window |
| **Pre-processing** | Chat already fully analyzed into structured sections | Raw retrieval on every query |

---

## 7. Monetization Strategy

### Revenue Model: Credits + Subscriptions
- **Free tier:** 1 free analysis (no card needed)
- **Credits system:** Buy credits to unlock reports (`credit`, `credits`, `unlock`)
- **Subscriptions:** Monthly/annual plans via Google Play Billing / Apple IAP
- **Gift codes:** Redeemable promo/gift codes
- **Referral system:** Referral codes with reward tracking
- **Token Bunny:** Appears to be their virtual currency mascot (`tokenbunny.png`)

### Billing API Endpoints (22 total!)
Custom billing backend — NOT using RevenueCat. They built their own:
- Server-side receipt validation
- Currency detection (localized pricing)
- Entitlement checking
- Subscription management
- Feature-level unlocking (individual reports, astrology, etc.)

### Analytics & Growth
- **Mixpanel** for product analytics (17 references)
- **Facebook SDK** for ad attribution (App ID: `2011408846427443`)
- **Sentry** for error monitoring (organization: `arkhai-technologies`)
- **Google Ad Services** tracking
- **SKAdNetwork** (36 different ad network IDs for iOS attribution)
- **Tracking Transparency** permission dialog

---

## 8. Privacy Architecture

### What They Claim
- "256-bit encryption"
- "No human review"
- "Auto-deleted" after analysis
- "Zero chat data retention"

### What The APK Actually Shows
- Chats are uploaded to Supabase (cloud PostgreSQL)
- Processing happens on Vercel serverless functions
- GPT API calls are made server-side (OpenAI sees the chat content)
- Analysis results ARE stored server-side (shareable via links)
- Facebook Pixel, Google Ads, Mixpanel all track user behavior
- `AD_ID` permission requested (advertising identifier)
- Multiple ad network SDKs integrated

### The Privacy Contrast With ASSIFY
This is your **biggest competitive advantage**. Delulu sends your intimate chats to:
1. Supabase servers (cloud PostgreSQL)
2. OpenAI's GPT API (chat content as prompts)
3. Vercel serverless functions (processing)
4. Analytics services (Mixpanel, Facebook, Google)

ASSIFY processes everything locally with Ollama — zero network calls, zero cloud storage.

---

## 9. Complete Permissions List (from XAPK manifest)

| Permission | Why |
|---|---|
| `INTERNET` | Cloud API calls |
| `RECORD_AUDIO` | Voice-to-text in Ghost Writer |
| `CAMERA` | QR code scanning |
| `READ_MEDIA_IMAGES` | Screenshot upload |
| `POST_NOTIFICATIONS` | Push notifications |
| `VIBRATE` | Haptic feedback |
| `USE_BIOMETRIC` / `USE_FINGERPRINT` | App lock |
| `BILLING` | In-app purchases |
| `AD_ID` | Advertising tracking |
| `RECEIVE_BOOT_COMPLETED` | Background services |
| `WAKE_LOCK` | Keep alive during analysis |
| `ACCESS_NETWORK_STATE` / `ACCESS_WIFI_STATE` | Network status |
| Badge permissions (Samsung, HTC, Sony, Huawei, Oppo) | Notification badges |

---

## 10. The Upload Flow (Reconstructed)

```
User selects platform: "WhatsApp" or "Instagram"
    │
    ▼
If WhatsApp: Upload .txt or .zip export file
If Instagram: Export from IG settings → upload JSON
    │
    ▼
POST /api/upload/init  →  Get upload session ID
    │
    ▼
Upload file chunks to server
    │
    ▼
POST /api/upload/complete  →  Mark upload done
    │
    ▼
POST /api/upload/finalize  →  Trigger analysis
    │
    ▼
Server processes chat:
  1. Parse messages (sender attribution, timestamps)
  2. Feed to GPT with structured prompts for each Act
  3. Generate all 17 sections
  4. Store results in Supabase
    │
    ▼
Client polls: GET /api/check-status
  → Live Activity updates on iOS lock screen
  → Progress notifications
    │
    ▼
Report ready → Navigate to results screen
  → Share via deep link: delulucheck.com/r/{id}
```
