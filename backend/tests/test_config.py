import pytest
from pathlib import Path
from backend.config import (
    Settings,
    IngestionSettings,
    ChronemicsSettings,
    SeamSettings,
    MacroEpisodeSettings,
    TheKeepSettings,
    EvidenceSettings,
    LLMSettings,
    DatabaseSettings,
    get_settings,
)


def test_settings_default_values():
    """Verify that all default settings initialize with verified production values."""
    settings = Settings()

    # Database
    assert isinstance(settings.database, DatabaseSettings)
    assert settings.database.wal_mode_enabled is True
    assert settings.database.busy_timeout_ms == 10000

    # Ingestion & Preflight
    assert isinstance(settings.ingestion, IngestionSettings)
    assert settings.ingestion.preflight_cache_ttl_seconds == 600
    assert settings.ingestion.max_upload_size_bytes == 50 * 1024 * 1024
    assert ".txt" in settings.ingestion.allowed_file_extensions
    assert ".zip" in settings.ingestion.allowed_file_extensions

    # Chronemics
    assert isinstance(settings.chronemics, ChronemicsSettings)
    assert settings.chronemics.turn_merge_threshold_seconds == 90
    assert settings.chronemics.sleep_window_start_hour == 23
    assert settings.chronemics.sleep_window_end_hour == 7

    # Seams & Volatility
    assert isinstance(settings.seam, SeamSettings)
    assert settings.seam.silence_seam_threshold_hours == 4.0
    assert settings.seam.latency_velocity_spike_multiplier == 3.0
    assert settings.seam.double_text_burst_anomaly_count == 4

    # Macro Episodes
    assert isinstance(settings.episodes, MacroEpisodeSettings)
    assert settings.episodes.target_macro_episodes_min == 30
    assert settings.episodes.target_macro_episodes_max == 60

    # The Keep & Evidence
    assert isinstance(settings.keep, TheKeepSettings)
    assert settings.keep.max_keep_candidate_snippets == 70
    assert settings.keep.category_quotas["food"] == 25
    assert settings.evidence.max_evidence_locker_quotes == 50

    # LLM & Resilience
    assert isinstance(settings.llm, LLMSettings)
    assert settings.llm.default_model_name == "gpt-4o-mini"
    assert settings.llm.circuit_breaker_max_failures == 5


def test_singleton_get_settings():
    """Verify that get_settings() returns the same cached instance (Law 3)."""
    s1 = get_settings()
    s2 = get_settings()
    assert s1 is s2
