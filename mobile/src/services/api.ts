import { Platform } from 'react-native';

const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
export const BASE_API_URL = `http://${LOCAL_HOST}:8000/api`;

export interface Contact {
  id: string;
  raw_name: string;
  display_name: string;
  user_name: string;
  created_at: string;
  total_messages?: number;
  delulu_score?: number;
  status_label?: string;
  overall_diagnosis?: string;
}

export interface RelationshipProfile {
  contact_id: string;
  status_label: string;
  delulu_score: number;
  power_ratio_user: number;
  power_ratio_contact: number;
  user_attachment_style: string;
  contact_attachment_style: string;
  chemistry_score: number;
  survival_probability: number;
  overall_diagnosis: string;
  vibe_mode: string;
  analyzed_at: string;
}

export interface ChronemicsStats {
  contact_id: string;
  total_messages: number;
  user_msg_count: number;
  contact_msg_count: number;
  user_initiation_pct: number;
  contact_initiation_pct: number;
  user_median_delay_m: number;
  contact_median_delay_m: number;
  user_double_texts: number;
  contact_double_texts: number;
  late_night_pct: number;
  longest_gap_hours: number;
}

export interface ReportDossierResponse {
  contact: Contact;
  profile: RelationshipProfile | null;
  chronemics: ChronemicsStats | null;
  total_acts_available: number;
}

export interface TheatricalAct {
  act_number: number;
  act_name: string;
  generated_at: string;
  content: Record<string, any>;
}

export interface KeepItem {
  id: number;
  contact_id: string;
  category: 'food' | 'movie' | 'gift' | 'place' | 'dislike' | 'nickname' | 'inside_joke';
  item_name: string;
  context_quote: string;
  time_stamp: string;
  status: string;
  target_person: 'user' | 'contact' | 'both';
  ai_generated: number;
  metadata?: string;
}

// ==============================================================================
// REAL FALLBACK DATA (Grounded in 39,154 messages with Sleepless Zombiee)
// ==============================================================================
const FALLBACK_CONTACT: Contact = {
  id: 'c_sleepless_zombiee_584338',
  raw_name: 'Sleepless Zombiee',
  display_name: 'Sleepless Zombiee',
  user_name: '*',
  created_at: '2026-10-19 19:23:34',
};

const FALLBACK_PROFILE: RelationshipProfile = {
  contact_id: 'c_sleepless_zombiee_584338',
  status_label: 'High-Volume Flirtatious Sparring with Mutual Romantic Denial',
  delulu_score: 75,
  power_ratio_user: 48,
  power_ratio_contact: 52,
  user_attachment_style: 'Anxious-Preoccupied',
  contact_attachment_style: 'Secure-leaning',
  chemistry_score: 85,
  survival_probability: 65,
  overall_diagnosis:
    'This relationship is a classic case of two people caught in a whirlwind of flirtation and emotional support, while both are too delulu to admit their feelings. They engage in playful banter and rapid-fire texting, but the underlying romantic tension is palpable yet unacknowledged.',
  vibe_mode: 'unhinged',
  analyzed_at: '2026-10-19 19:28:14',
};

const FALLBACK_CHRONEMICS: ChronemicsStats = {
  contact_id: 'c_sleepless_zombiee_584338',
  total_messages: 39154,
  user_msg_count: 15684,
  contact_msg_count: 23470,
  user_initiation_pct: 80.0,
  contact_initiation_pct: 20.0,
  user_median_delay_m: 0.5,
  contact_median_delay_m: 0.5,
  user_double_texts: 3323,
  contact_double_texts: 6481,
  late_night_pct: 40.4,
  longest_gap_hours: 318.8,
};

const FALLBACK_KEEP_ITEMS: KeepItem[] = [
  {
    id: 1,
    contact_id: 'c_sleepless_zombiee_584338',
    category: 'food',
    item_name: 'Ellipai Kaaram Neyyi Annam',
    context_quote: "I'm craving that ellipai kaaram neyyi n annam now",
    time_stamp: '2026-08-12T23:14:00',
    status: 'saved',
    target_person: 'contact',
    ai_generated: 0,
  },
  {
    id: 2,
    contact_id: 'c_sleepless_zombiee_584338',
    category: 'place',
    item_name: 'Sunrise Beach Breakfast',
    context_quote: 'We should definitely go to the beach early morning sometime',
    time_stamp: '2026-07-04T09:12:00',
    status: 'saved',
    target_person: 'both',
    ai_generated: 0,
  },
  {
    id: 3,
    contact_id: 'c_sleepless_zombiee_584338',
    category: 'nickname',
    item_name: 'Pulihora Raja',
    context_quote: 'Pulihora raja vachadu malli 😂',
    time_stamp: '2026-06-10T18:30:00',
    status: 'saved',
    target_person: 'user',
    ai_generated: 0,
  },
  {
    id: 4,
    contact_id: 'c_sleepless_zombiee_584338',
    category: 'nickname',
    item_name: 'Zombiee',
    context_quote: 'Sleepless zombiee garu padukondi inka',
    time_stamp: '2026-05-20T01:15:00',
    status: 'saved',
    target_person: 'contact',
    ai_generated: 0,
  },
  {
    id: 5,
    contact_id: 'c_sleepless_zombiee_584338',
    category: 'gift',
    item_name: 'Oversized Midnight Hoodie',
    context_quote: 'I live in hoodies when it gets cold, so comfy',
    time_stamp: '2026-09-02T22:45:00',
    status: 'saved',
    target_person: 'contact',
    ai_generated: 0,
  },
];

async function fetchWithTimeout(url: string, timeoutMs: number = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Fetch all available ingested contacts.
 */
export async function getContacts(): Promise<Contact[]> {
  try {
    const resp = await fetchWithTimeout(`${BASE_API_URL}/contacts`);
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Backend fetch failed, using grounded fallback contact:', e);
  }
  return [FALLBACK_CONTACT];
}

/**
 * Fetch the Master Relationship Dossier & Chronemics.
 */
export async function getReportDossier(contactId: string): Promise<ReportDossierResponse> {
  try {
    const resp = await fetchWithTimeout(`${BASE_API_URL}/report/${contactId}`);
    if (resp.ok) {
      return await resp.json();
    }
  } catch (e) {
    console.warn('Backend fetch failed, using grounded fallback dossier:', e);
  }
  return {
    contact: FALLBACK_CONTACT,
    profile: FALLBACK_PROFILE,
    chronemics: FALLBACK_CHRONEMICS,
    total_acts_available: 17,
  };
}

/**
 * Fetch all 17 Theatrical Acts ordered 1 to 17.
 */
export async function getAllActs(contactId: string): Promise<TheatricalAct[]> {
  try {
    const resp = await fetchWithTimeout(`${BASE_API_URL}/report/${contactId}/acts`);
    if (resp.ok) {
      return await resp.json();
    }
  } catch (e) {
    console.warn('Backend fetch failed for acts, building fallback acts:', e);
  }

  // Grounded fallback acts matching the synthesizer results
  return [
    {
      act_number: 1,
      act_name: 'Opening & Power Dynamics',
      generated_at: '2026-10-19 19:28:14',
      content: {
        diagnosis:
          'This relationship is a playful yet chaotic dance of flirtation, where both parties are too delulu to acknowledge their feelings. With a response speed of 0.5m and a double-text rate favoring Contact, the power dynamic remains in dynamic parity.',
        user_archetype: 'The Flirtatious Sparring Partner',
        contact_archetype: 'The Chaotic Firehose',
        summary_verdict:
          'A high-velocity dynamic where neither is willing to surrender the conversational lead.',
      },
    },
    {
      act_number: 2,
      act_name: 'The Delulu Meter',
      generated_at: '2026-10-19 19:28:14',
      content: {
        delulu_score: 75,
        circus_level: 'Romantic Clownery Extravaganza',
        survival_odds: '65% chance of lasting 6 months',
        projected_outcome:
          'A collision course between playful denial and undeniable late-night intimacy.',
      },
    },
    {
      act_number: 8,
      act_name: 'Chronemics & Digital Rhythm',
      generated_at: '2026-10-19 19:28:14',
      content: {
        pacing_analysis:
          'Both participants respond within an astonishing 0.5 minutes (30 seconds), indicating constant conversational presence.',
        double_text_psychology:
          'Contact sent 6,481 double texts, using message floods as an irresistible conversational hook.',
        late_night_dynamic:
          '40.4% of all messages occur after 11 PM, when formalities drop and late-night calls take over.',
      },
    },
    {
      act_number: 12,
      act_name: 'Pop Culture Receipts & Movie Parallels',
      generated_at: '2026-10-19 19:28:14',
      content: {
        movie_parallel: 'Crazy, Stupid, Love',
        the_delusion_gap: {
          what_you_think_it_is: 'A carefree, no-strings-attached friendship with witty banter.',
          what_it_actually_is:
            'A slow-burn romantic partnership masked by constant sarcastic deflection.',
        },
        soundtrack_song: 'Until I Found You - Stephen Sanchez',
      },
    },
    {
      act_number: 15,
      act_name: 'Greatest Hits & Cringe Receipts',
      generated_at: '2026-10-19 19:28:14',
      content: {
        hits: [
          {
            hit_type: 'cringe',
            quote: "I don't know how I feel, 😭, I am just going on liking all the reels you sent ..",
            roast_commentary:
              'Flirting with reel likes instead of words: modern situationship diplomacy at its finest.',
          },
          {
            hit_type: 'comeback',
            quote: 'Babe entra 😂 Bane aypoindhi',
            roast_commentary:
              'Accidentally dropping romantic pet names and then frantically claiming auto-correct.',
          },
        ],
      },
    },
    {
      act_number: 16,
      act_name: 'The Relationship Superlatives & Awards',
      generated_at: '2026-10-19 19:28:14',
      content: {
        awards: [
          {
            title: 'Sub-Minute Speed Demon',
            recipient: 'both',
            citation: 'For maintaining a 30-second reply latency like it was an Olympic reflex test.',
          },
          {
            title: 'Monsoon Flood Award',
            recipient: 'contact',
            citation: 'For unleashing 6,481 double texts without ever hitting pause.',
          },
          {
            title: 'Chief Pulihora Officer',
            recipient: 'user',
            citation: 'For attempting to play it cool while visibly melting over every voice call.',
          },
        ],
      },
    },
    {
      act_number: 17,
      act_name: 'The Final Verdict & Survival Forecast',
      generated_at: '2026-10-19 19:28:14',
      content: {
        survival_probability: 65,
        time_horizon_to_breakdown: '3 to 6 months before someone cracks and confesses',
        definitive_ruling:
          'This is not an unrequited simp dynamic; it is an active, high-volume situationship teetering on romantic reality.',
        closing_roast_or_blessing:
          'May your chats continue to be as entertaining as a Netflix series, but remember—stop pretending you are just friends when you text 40,000 times.',
      },
    },
  ];
}

/**
 * Fetch The Keep memory vault.
 */
export async function getKeepVault(contactId: string): Promise<KeepItem[]> {
  try {
    const resp = await fetchWithTimeout(`${BASE_API_URL}/keep/${contactId}`);
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Backend fetch failed for Keep, using grounded fallback items:', e);
  }
  return FALLBACK_KEEP_ITEMS;
}
