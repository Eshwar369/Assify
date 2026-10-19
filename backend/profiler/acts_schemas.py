from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


# ==============================================================================
# PASS 1: High-Level Relationship Dossier (Table: relationship_profiles)
# ==============================================================================
class RelationshipProfileDossier(BaseModel):
    contact_id: str
    status_label: str = Field(description="e.g. 'Situationship with Asymmetric Investment'")
    delulu_score: int = Field(ge=0, le=100, description="Overall Delusion index (0-100)")
    power_ratio_user: int = Field(ge=0, le=100, description="User power percentage (0-100)")
    power_ratio_contact: int = Field(ge=0, le=100, description="Contact power percentage (0-100)")
    user_attachment_style: str = Field(description="e.g. 'Anxious-Preoccupied'")
    contact_attachment_style: str = Field(description="e.g. 'Dismissive-Avoidant'")
    chemistry_score: int = Field(ge=0, le=100, description="Romantic & Banter chemistry score (0-100)")
    survival_probability: int = Field(ge=0, le=100, description="3-month survival probability (0-100)")
    overall_diagnosis: str = Field(description="Brutal 1-2 sentence executive diagnosis")
    vibe_mode: str = Field(default="unhinged", description="'therapy' | 'unhinged'")


# ==============================================================================
# PASS 2: Acts 1 to 6 (The Surface, Dynamics & Conflict Playbook)
# ==============================================================================
class Act1Opening(BaseModel):
    act_number: int = 1
    act_name: str = "Opening & Power Dynamics"
    diagnosis: str
    power_balance: Dict[str, int] = Field(description="{'user': 35, 'contact': 65}")
    status_tag: str
    user_archetype: str
    contact_archetype: str
    summary_verdict: str


class Act2DeluluMeter(BaseModel):
    act_number: int = 2
    act_name: str = "The Delulu Meter"
    delulu_score: int = Field(ge=0, le=100)
    circus_level: str = Field(description="e.g. 'Ringmaster of the Delusion Circus'")
    dimensions: Dict[str, int] = Field(description="5 sub-dimensions (0-100): expectation_vs_reality, mixed_signal_rationalization, future_faking_tolerance, investment_asymmetry, excuses_manufactured")
    survival_odds: str
    projected_outcome: str


class Act3BehavioralProfiles(BaseModel):
    act_number: int = 3
    act_name: str = "Behavioral & Attachment Profiles"
    user_profile: Dict[str, str] = Field(description="attachment_style, core_insecurity, primary_trigger, blindspot, toxic_loop")
    contact_profile: Dict[str, str] = Field(description="attachment_style, core_insecurity, primary_trigger, blindspot, toxic_loop")
    clash_mechanism: str


class Act4HiddenDynamics(BaseModel):
    act_number: int = 4
    act_name: str = "Hidden Dynamics & Subtext Decoders"
    manipulation_tactics: List[str]
    conversational_traps: List[str]
    subtext_decoders: List[Dict[str, str]] = Field(description="List of {'what_was_said': '...', 'what_it_actually_meant': '...'}")
    the_raw_truth: str


class Act5PowerPlays(BaseModel):
    act_number: int = 5
    act_name: str = "Power Plays & Vulnerability Ledger"
    power_plays_catalog: List[str]
    conflict_escalation_breakdown: str
    validation_imbalance: str
    vulnerability_asymmetry: str


class Act6CommunicationBreakdown(BaseModel):
    act_number: int = 6
    act_name: str = "Communication Breakdown & Clash Vectors"
    friction_point: str
    linguistic_differences: Dict[str, str] = Field(description="message_length, emoji_usage, responsiveness")
    danger_topics: List[str]
    defensive_playbooks: Dict[str, str] = Field(description="user_playbook, contact_playbook")


# ==============================================================================
# PASS 3: Acts 7 to 12 (Chemistry, Chronemics, Receipts & Pop Culture)
# ==============================================================================
class Act7ChemistryAudit(BaseModel):
    act_number: int = 7
    act_name: str = "Romantic & Chemistry Audit"
    chemistry_score: int = Field(ge=0, le=100)
    flirting_reciprocity: str
    escalation_analysis: str
    missed_signals: List[str]
    peak_chemistry_window: str


class Act8DigitalRhythm(BaseModel):
    act_number: int = 8
    act_name: str = "Chronemics & Digital Rhythm"
    grounded_stats: Dict[str, Any] = Field(description="Hard metrics from chronemics_stats table")
    pacing_analysis: str
    late_night_dynamic: str
    double_text_psychology: str


class Act9TimelineOfDecay(BaseModel):
    act_number: int = 9
    act_name: str = "Timeline & Relational Phases"
    phases: List[Dict[str, str]] = Field(description="List of {'phase_name': '...', 'dates': '...', 'narrative': '...'}")
    current_phase: str
    trajectory: str


class EvidenceItem(BaseModel):
    quote: str
    sender: str
    severity: int = Field(ge=1, le=5)
    flag_type: str = Field(description="'red' | 'green'")
    commentary: str


class Act10RedFlagsLocker(BaseModel):
    act_number: int = 10
    act_name: str = "Red Flags & The Evidence Locker"
    critical_red_flag: str
    user_red_flags: List[EvidenceItem]
    contact_red_flags: List[EvidenceItem]


class Act11GreenFlags(BaseModel):
    act_number: int = 11
    act_name: str = "Green Flags & Relational Strengths"
    observed_green_flags: List[EvidenceItem]
    silver_linings: str


class Act12PopCultureMirror(BaseModel):
    act_number: int = 12
    act_name: str = "Pop Culture Receipts & Movie Parallels"
    movie_parallel: str
    celebrity_parallel: str
    the_delusion_gap: Dict[str, str] = Field(description="{'what_you_think_it_is': '...', 'what_it_actually_is': '...'}")
    soundtrack_song: str


# ==============================================================================
# PASS 4: Acts 13 to 17 (Simulation, Playbook, Greatest Hits & Verdict)
# ==============================================================================
class Act13SimulationEngine(BaseModel):
    act_number: int = 13
    act_name: str = "The 'What-If' Simulation Engine"
    scenarios: List[Dict[str, Any]] = Field(description="List of {'scenario': '...', 'contact_reaction_probability': 24, 'predicted_response': '...', 'consequence': '...'}")


class Act14StrategyHandbook(BaseModel):
    act_number: int = 14
    act_name: str = "Strategy Handbook & Rules of Engagement"
    behaviors_to_stop_immediately: List[str]
    dos_and_donts: List[Dict[str, str]] = Field(description="List of {'do': '...', 'dont': '...'}")
    calibrated_responses: List[Dict[str, str]] = Field(description="List of {'incoming_text': '...', 'optimal_reply': '...', 'psychological_rationale': '...'}")


class GreatestHitItem(BaseModel):
    hit_type: str = Field(description="'cringe' | 'delusional' | 'comeback' | 'self_own'")
    quote: str
    sender: str
    roast_commentary: str


class Act15GreatestHits(BaseModel):
    act_number: int = 15
    act_name: str = "Greatest Hits & Cringe Receipts"
    hits: List[GreatestHitItem]


class AwardItem(BaseModel):
    title: str
    recipient: str = Field(description="'user' | 'contact'")
    citation: str


class Act16AwardsCeremony(BaseModel):
    act_number: int = 16
    act_name: str = "The Relationship Superlatives & Awards"
    awards: List[AwardItem] = Field(description="10-12 satirical awards distributed between both")


class Act17FinalVerdict(BaseModel):
    act_number: int = 17
    act_name: str = "The Final Verdict & Survival Forecast"
    survival_probability: int = Field(ge=0, le=100)
    time_horizon_to_breakdown: str
    definitive_ruling: str
    closing_roast_or_blessing: str
