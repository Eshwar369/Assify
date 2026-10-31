from functools import lru_cache
from pathlib import Path
from typing import Dict, Tuple, Optional
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# ------------------------------------------------------------------------------
# 1. Database & Storage Configuration
# ------------------------------------------------------------------------------
class DatabaseSettings(BaseModel):
    """SQLite WAL & Storage parameters."""
    sqlite_db_path: Path = Field(
        default=Path("backend/assify.db"),
        description="Path to the primary SQLite database file."
    )
    wal_mode_enabled: bool = Field(
        default=True,
        description="Enforces SQLite WAL (Write-Ahead-Logging) mode for concurrent access."
    )
    busy_timeout_ms: int = Field(
        default=10000,
        description="Busy timeout in milliseconds to prevent database locks."
    )


# ------------------------------------------------------------------------------
# 2. Ingestion & Preflight Gateway Configuration
# ------------------------------------------------------------------------------
class IngestionSettings(BaseModel):
    """Preflight gateway and file upload limits."""
    preflight_cache_ttl_seconds: int = Field(
        default=600,
        description="Time-To-Live for preflight memory session buffers (10 minutes)."
    )
    max_upload_size_bytes: int = Field(
        default=50 * 1024 * 1024,
        description="Maximum upload archive size in bytes (50 MB)."
    )
    allowed_file_extensions: Tuple[str, ...] = Field(
        default=(".txt", ".text", ".zip", ".json"),
        description="Supported chat export file extensions."
    )
    preflight_sample_lines_scan: int = Field(
        default=250,
        description="Number of header lines inspected during fast preflight discovery."
    )


# ------------------------------------------------------------------------------
# 3. Chronemics & Turn-Taking Hyperparameters
# ------------------------------------------------------------------------------
class ChronemicsSettings(BaseModel):
    """Mathematical micro-turn aggregation and interaction tempo."""
    turn_merge_threshold_seconds: int = Field(
        default=90,
        description="Max gap (seconds) between messages from the same sender to cluster into 1 turn."
    )
    sleep_window_start_hour: int = Field(
        default=23,
        description="Hour of day (24h) when late-night messaging classification begins (11:00 PM)."
    )
    sleep_window_end_hour: int = Field(
        default=7,
        description="Hour of day (24h) when morning cycle begins (7:00 AM)."
    )
    max_valid_response_delay_hours: float = Field(
        default=7.0,
        description="Upper bound on latency intervals to avoid skewing median response time with sleep."
    )


# ------------------------------------------------------------------------------
# 4. Dual-Signal Seams & Volatility Thresholds
# ------------------------------------------------------------------------------
class SeamSettings(BaseModel):
    """Meso-session segmentation triggers."""
    silence_seam_threshold_hours: float = Field(
        default=4.0,
        description="Silence duration (hours) triggering a natural session boundary."
    )
    latency_velocity_spike_multiplier: float = Field(
        default=3.0,
        description="Multiplier over rolling median latency (e.g. 300% jump) flagging a volatility seam."
    )
    double_text_burst_anomaly_count: int = Field(
        default=4,
        description="Consecutive unanswered messages across a pause signaling unresolved tension."
    )
    max_neuro_seams_classified: int = Field(
        default=40,
        description="Maximum transition seams sent to the LLM for initiation classification."
    )


# ------------------------------------------------------------------------------
# 5. Macro Relationship Episodes Hyperparameters
# ------------------------------------------------------------------------------
class MacroEpisodeSettings(BaseModel):
    """Master chronological narrative ledger targets."""
    target_macro_episodes_min: int = Field(
        default=30,
        description="Target minimum number of Macro Episodes across the relationship timeline."
    )
    target_macro_episodes_max: int = Field(
        default=60,
        description="Target maximum number of Macro Episodes across the relationship timeline."
    )
    min_turns_per_macro_episode: int = Field(
        default=3,
        description="Minimum number of conversational turns required to constitute a distinct episode."
    )
    tokens_per_episode_cluster_budget: int = Field(
        default=3500,
        description="Token window budget for batch LLM Map-Reduce episode clustering."
    )


# ------------------------------------------------------------------------------
# 6. The Keep & Evidence Mining Configuration
# ------------------------------------------------------------------------------
class TheKeepSettings(BaseModel):
    """Neuro-symbolic memory and taste vault mining quotas."""
    max_keep_candidate_snippets: int = Field(
        default=70,
        description="Maximum keyword-mined message snippets sent to LLM memory extractor."
    )
    category_quotas: Dict[str, int] = Field(
        default={
            "food": 25,
            "movie": 25,
            "gift": 25,
            "place": 20,
            "dislike": 15,
            "nickname": 15,
        },
        description="Stratified sampling quotas across the 6 memory chambers."
    )
    oracle_date_ideas_count: int = Field(
        default=3,
        description="Number of AI date blueprints synthesized by Date Oracle."
    )
    oracle_gift_ideas_count: int = Field(
        default=3,
        description="Number of AI gift recommendations synthesized by Gift Oracle."
    )


class EvidenceSettings(BaseModel):
    """Evidence Locker receipt mining limits."""
    max_evidence_locker_quotes: int = Field(
        default=50,
        description="Maximum verified verbatim quotes indexed in Evidence Locker."
    )


# ------------------------------------------------------------------------------
# 7. AI Models & Resilience Configuration
# ------------------------------------------------------------------------------
class LLMSettings(BaseModel):
    """OpenAI models, temperatures, and circuit breaker policies (Laws 7 & 10)."""
    default_model_name: str = Field(
        default="gpt-4o-mini",
        description="Primary model for extraction, chronemics, and episode synthesis."
    )
    reasoning_model_name: str = Field(
        default="gpt-4o",
        description="Higher-capability model for deep psychological profiling."
    )
    llm_temperature_extraction: float = Field(
        default=0.1,
        description="Sampling temperature for deterministic structured JSON extraction."
    )
    llm_temperature_creative: float = Field(
        default=0.7,
        description="Sampling temperature for narrative and coaching synthesis."
    )
    llm_timeout_seconds: float = Field(
        default=35.0,
        description="Timeout per remote LLM HTTP request."
    )
    circuit_breaker_max_failures: int = Field(
        default=5,
        description="Number of consecutive remote failures before opening the circuit breaker."
    )
    circuit_breaker_recovery_timeout_seconds: float = Field(
        default=60.0,
        description="Cooldown duration before the circuit breaker attempts recovery (HALF-OPEN)."
    )


# ------------------------------------------------------------------------------
# 8. Master Centralized Settings (Law 3 Singleton via Depends)
# ------------------------------------------------------------------------------
class Settings(BaseSettings):
    """
    Master Application & Ingestion Settings.
    Houses 100% of pipeline tunables in one single file.
    Supports environment variable overrides:
      e.g. ASSIFY_LLM__DEFAULT_MODEL_NAME="gpt-4o"
    """
    app_name: str = "ASSIFY Relationship Intelligence OS"
    app_version: str = "3.0.0"
    debug: bool = False

    # Sub-namespace settings groups
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    ingestion: IngestionSettings = Field(default_factory=IngestionSettings)
    chronemics: ChronemicsSettings = Field(default_factory=ChronemicsSettings)
    seam: SeamSettings = Field(default_factory=SeamSettings)
    episodes: MacroEpisodeSettings = Field(default_factory=MacroEpisodeSettings)
    keep: TheKeepSettings = Field(default_factory=TheKeepSettings)
    evidence: EvidenceSettings = Field(default_factory=EvidenceSettings)
    llm: LLMSettings = Field(default_factory=LLMSettings)

    model_config = SettingsConfigDict(
        env_prefix="ASSIFY_",
        env_nested_delimiter="__",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    FastAPI Dependency Provider (Law 3: Singleton Pattern via Depends).
    Cached via lru_cache to ensure a single immutable configuration instance.
    """
    return Settings()
