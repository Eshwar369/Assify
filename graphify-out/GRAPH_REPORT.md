# Graph Report - Assify  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 710 nodes · 1568 edges · 66 communities (26 shown, 40 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f871fc9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 27
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43

## God Nodes (most connected - your core abstractions)
1. `get_db_connection()` - 40 edges
2. `ProfilerSynthesizer` - 30 edges
3. `react-native` - 30 edges
4. `react` - 30 edges
5. `Colors` - 27 edges
6. `expo-haptics` - 20 edges
7. `Radius` - 20 edges
8. `lucide-react-native` - 17 edges
9. `ingest_chat()` - 16 edges
10. `RadarScreen()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `FastChatAgent` --uses--> `VectorStore`  [INFERRED]
  legacy/agents/Fast_agent.py → legacy/memory/vector_store.py
- `parse_whatsapp_file()` --uses--> `MessageObject`  [INFERRED]
  legacy/ingestion/whatsapp_parser.py → legacy/ingestion/normalizer.py
- `ProfilerSynthesizer` --uses--> `Act10RedFlagsLocker`  [INFERRED]
  backend/profiler/synthesizer.py → backend/profiler/acts_schemas.py
- `ProfilerSynthesizer` --uses--> `Act11GreenFlags`  [INFERRED]
  backend/profiler/synthesizer.py → backend/profiler/acts_schemas.py
- `ProfilerSynthesizer` --uses--> `Act12PopCultureMirror`  [INFERRED]
  backend/profiler/synthesizer.py → backend/profiler/acts_schemas.py

## Import Cycles
- None detected.

## Communities (66 total, 40 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (30): aggregate_conversational_turns(), classify_seams_with_llm(), ConversationalTurn, detect_silence_seams(), _heuristic_seam_classification(), parse_iso_or_datetime(), synthesize_chronemics_metrics(), run() (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (24): FastChatAgent, get_llm(), OllamaLLM, OpenAILLM, RouteDecision, Router, RouteType, RAGTracer (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (32): GlassCardProps, styles, AppHeaderProps, styles, AnimatedPressable, AppleElevatedCardProps, styles, EditorialSectionProps (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (26): Act10RedFlagsLocker, Act11GreenFlags, Act12PopCultureMirror, Act13SimulationEngine, Act14StrategyHandbook, Act15GreatestHits, Act16AwardsCeremony, Act17FinalVerdict (+18 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (36): ChatMessage, COACH_MODES, CoachScreen(), DEFAULT_TRIAD, GhostReplyOption, INITIAL_MESSAGES, QUICK_PROMPTS, styles (+28 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (13): sanitize_messages(), sanitize_text(), clean_text_for_display(), generate_html_viewer(), main(), query_messages(), try_parse_date(), test_sanitize_does_not_break_innocent_dates_and_times() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (12): ChronemicsSettings, DatabaseSettings, EvidenceSettings, get_settings(), IngestionSettings, LLMSettings, MacroEpisodeSettings, SeamSettings (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (24): SAMPLE_PAYLOAD, styles, UnboxingPreviewScreen(), AnimatedPressable, AppleGlassCard(), AppleGlassCardProps, styles, AnimatedCircle (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (22): ActsModal(), loadActs(), renderActContent(), styles, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, BASE_API_URL, ChronemicsStats, Contact (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (11): assess_date(), compute_daily_chronemics(), DailyBehaviorFlag, DayAssessmentReport, fetch_messages_for_date(), generate_markdown_report(), IconicReceipt, main() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (7): get_evidence_locker(), get_greatest_hits(), get_db_connection(), recover_stale_tasks(), update_task_progress(), test_persistence_across_distinct_connections(), test_recover_stale_tasks()

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (4): get_contact(), list_contacts(), healthcheck(), lifespan()

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (11): config, { getDefaultConfig }, path, exampleAssets, exampleDirPath, fs, oldDirs, path (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (9): complete_task(), create_task(), fail_task(), get_task(), _row_to_dict(), test_complete_task(), test_create_and_get_task(), test_fail_task() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (16): dependencies, expo-font@~58.0.9, expo-glass-effect@~58.0.4, expo-haptics@^58.0.7, expo-image@~58.0.16, expo-router@~58.0.24, lucide-react-native@^1.59.0, react@19.3.0 (+8 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (12): AnimatedCircle, DeluluMeter(), DeluluMeterProps, styles, PowerSliderProps, styles, SegmentedControlProps, SegmentOption (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (5): init_db(), setup_db(), test_upload_and_async_polling_workflow(), test_upload_invalid_file_extension(), setup_test_db()

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (5): add_keep_item(), delete_keep_item(), KeepItemCreate, KeepItemUpdate, update_keep_item()

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (12): icon, min_sdk_version, name, package_name, permissions, split_apks, split_configs, target_sdk_version (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.24
Nodes (9): styles, TabsLayout(), TabsLayoutInner(), TabBarContext, TabBarContextType, TabBarProvider(), useTabBar(), expo-router (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.23
Nodes (4): get_keep_items(), get_all_acts(), get_relationship_dossier(), get_single_act()

### Community 22 - "Community 22"
Cohesion: 0.20
Nodes (11): @expo/ui@~58.0.21, devDependencies, @types/react@~19.3.0, typescript@~6.0.3, main, name, private, version (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, extends, include, @/assets/*, expo/tsconfig.base

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (3): expo-web-browser@~58.0.6, Props, expo-web-browser

## Knowledge Gaps
- **1 isolated node(s):** `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get_db_connection()` connect `Community 11` to `Community 0`, `Community 3`, `Community 10`, `Community 12`, `Community 14`, `Community 17`, `Community 18`, `Community 21`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `ProfilerSynthesizer` (e.g. with `Act10RedFlagsLocker` and `Act11GreenFlags`) actually correct?**
  _`ProfilerSynthesizer` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `expo/tsconfig.base` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.054203180785459264 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `Community 2` to `Community 4`, `Community 7`, `Community 9`, `Community 15`, `Community 16`, `Community 20`, `Community 22`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05516431924882629 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Community 20` to `Community 2`, `Community 4`, `Community 7`, `Community 9`, `Community 15`, `Community 16`, `Community 22`, `Community 27`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._