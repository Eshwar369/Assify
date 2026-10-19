import { Platform } from 'react-native';

// In Android emulator: 10.0.2.2 maps to host 127.0.0.1
// In Web / iOS simulator: 127.0.0.1 / localhost works directly
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
export const BASE_API_URL = `http://${LOCAL_HOST}:8000/api`;

export interface Contact {
  id: string;
  raw_name: string;
  display_name: string;
  user_name: string;
  created_at: string;
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

export interface DateOracleIdea {
  title: string;
  description: string;
  reason: string;
}

export interface KeepPayload {
  items: KeepItem[];
  date_ideas: DateOracleIdea[];
  gift_ideas: DateOracleIdea[];
}

/**
 * Fetch all available ingested contacts.
 */
export async function getContacts(): Promise<Contact[]> {
  const resp = await fetch(`${BASE_API_URL}/contacts/`);
  if (!resp.ok) throw new Error(`Failed to fetch contacts: ${resp.status}`);
  return await resp.json();
}

/**
 * Fetch the Master Relationship Dossier & Chronemics.
 */
export async function getReportDossier(contactId: string): Promise<ReportDossierResponse> {
  const resp = await fetch(`${BASE_API_URL}/report/${contactId}`);
  if (!resp.ok) throw new Error(`Failed to fetch dossier: ${resp.status}`);
  return await resp.json();
}

/**
 * Fetch all 17 Theatrical Acts ordered 1 to 17.
 */
export async function getAllActs(contactId: string): Promise<TheatricalAct[]> {
  const resp = await fetch(`${BASE_API_URL}/report/${contactId}/acts`);
  if (!resp.ok) throw new Error(`Failed to fetch acts: ${resp.status}`);
  return await resp.json();
}

/**
 * Fetch The Keep memory vault and Date/Gift Oracle ideas.
 */
export async function getKeepVault(contactId: string): Promise<KeepItem[]> {
  const resp = await fetch(`${BASE_API_URL}/keep/${contactId}`);
  if (!resp.ok) throw new Error(`Failed to fetch Keep items: ${resp.status}`);
  return await resp.json();
}

/**
 * Fetch Evidence Locker receipts.
 */
export async function getEvidenceLocker(contactId: string) {
  const resp = await fetch(`${BASE_API_URL}/evidence/${contactId}`);
  if (!resp.ok) throw new Error(`Failed to fetch evidence: ${resp.status}`);
  return await resp.json();
}

/**
 * Fetch Greatest Hits receipts.
 */
export async function getGreatestHits(contactId: string) {
  const resp = await fetch(`${BASE_API_URL}/evidence/greatest-hits/${contactId}`);
  if (!resp.ok) throw new Error(`Failed to fetch greatest hits: ${resp.status}`);
  return await resp.json();
}
