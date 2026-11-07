# Spec-Driven Development (SDD): Architectural Patterns, Industry Best Practices, and Operational Taxonomy

> **Document Type:** Production Engineering Standards & Architecture Guide  
> **Classification:** Authoritative Technical Manual  
> **Target Audience:** Software Architects, Staff/Principal Engineers, Engineering Managers, and Autonomous AI Agent Systems  
> **Related Standards:** GitHub Spec Kit (`github/spec-kit`, `specify-cli`), Thoughtworks Technology Radar, Fowler & Böckeler SDD Taxonomy, RFC 2119  
> **Status:** Ratified Production Standard  

---

## Table of Contents

1. [Executive Summary: The Structural Shift from "Vibe Coding" to SDD](#1-executive-summary-the-structural-shift-from-vibe-coding-to-sdd)
   - 1.1 The Breakdown of Conversational "Vibe Coding"
   - 1.2 Defining Spec-Driven Development (SDD)
   - 1.3 Comparative Matrix: SDD vs. Vibe Coding vs. TDD vs. BDD
2. [The 3 Tiers of SDD Adoption (Fowler & Böckeler Taxonomy)](#2-the-3-tiers-of-sdd-adoption-fowler--böckeler-taxonomy)
   - 2.1 Tier 1: Spec-First (Intent Alignment & Prompt Stabilization)
   - 2.2 Tier 2: Spec-Anchored (Repository Persistence & Brownfield Governance)
   - 2.3 Tier 3: Spec-as-Source (Deterministic Compilation & Bi-Directional Auditing)
3. [The Canonical 8-Stage SDD Lifecycle Funnel](#3-the-canonical-8-stage-sdd-lifecycle-funnel)
   - 3.1 Stage 0: Constitution (`.specify/memory/constitution.md`)
   - 3.2 Stage 1: Specify (`specs/<feature>/spec.md`)
   - 3.3 Stage 2: Clarify (`/speckit-clarify` & The 10 Ambiguity Dimensions)
   - 3.4 Stage 3: Checklist (`checklists/*.md` & Reviewer Ownership)
   - 3.5 Stage 4: Plan (`specs/<feature>/plan.md` & Phased Design Artifacts)
   - 3.6 Stage 5: Tasks (`specs/<feature>/tasks.md` & Granular Task Grammar)
   - 3.7 Stage 6: Analyze (`/speckit-analyze` & Read-Only Cross-Artifact Auditing)
   - 3.8 Stage 7: Implement (`/speckit-implement` & Micro-Context Execution)
   - 3.9 Stage 8: Converge (`/speckit-converge` & The Append-Only Feedback Loop)
   - 3.10 Lifecycle Orchestration: Extension Hooks (`extensions.yml`)
4. [Structural Conventions & Linguistic Phrasing for AI Agents](#4-structural-conventions--linguistic-phrasing-for-ai-agents)
   - 4.1 RFC 2119 Keyword Binding & Transformer Attention Grounding
   - 4.2 The "Always / Ask First / Never" Guardrail Triad
   - 4.3 Given-When-Then BDD Scenarios with Explicit `Evidence Check:` Links
   - 4.4 The Four-Quadrant Edge Case Matrix
   - 4.5 The Anti-Adjective Rule: Replacing Fluff with Quantitative Thresholds
   - 4.6 Declarative Positive Directives Paired with Negative Boundaries
   - 4.7 Scope Quarantine & Explicit Non-Goals
5. [The "What vs. How" Firewall](#5-the-what-vs-how-firewall)
   - 5.1 Architectural Principle of Decoupling Intent from Implementation
   - 5.2 Absolute Prohibition of Tech Stack Leakage in `spec.md`
   - 5.3 Concrete Transformation Examples: Spec Intent to Architectural Plan
6. [Requirements Checklists as "Unit Tests for English" & Reviewer Ownership](#6-requirements-checklists-as-unit-tests-for-english--reviewer-ownership)
   - 6.1 Testing Requirements Quality Before Code Execution
   - 6.2 Machine-Evaluated Checklists vs. Reviewer-Owned Domain Checklists
   - 6.3 The Reviewer Checkbox Contract & The Implementation Gate
7. [Comprehensive Taxonomy of SDD Anti-Patterns & Failure Modes](#7-comprehensive-taxonomy-of-sdd-anti-patterns--failure-modes)
   - 7.1 Anti-Pattern 1: The Monolithic Task Trap (Under-Decomposition)
   - 7.2 Anti-Pattern 2: The Keystroke Micro-Management Trap (Over-Decomposition)
   - 7.3 Anti-Pattern 3: The Flat-List Fallacy (Missing Dependency Graph)
   - 7.4 Anti-Pattern 4: "Waterfall Strikes Back" / Static Plan Rigidity
   - 7.5 Anti-Pattern 5: Context Window Exhaustion & Attention Degradation ("Lost in the Middle")
   - 7.6 Anti-Pattern 6: Specification Theater & Green-Check Blindness
   - 7.7 Anti-Pattern 7: Cognitive Surrender & Borrowed Confidence
   - 7.8 Anti-Pattern 8: Comprehension Debt & The Illusion of Control
   - 7.9 Anti-Pattern 9: The Maintenance Tax & Silent Spec Drift
   - 7.10 Anti-Pattern 10: "Great Specs, No MVP" Paralysis (& The "<50 LOC" Exemption)
8. [AI Agent Operational Directives: Verbatim Prompt Engineering Modules](#8-ai-agent-operational-directives-verbatim-prompt-engineering-modules)
   - 8.1 Verbatim Directives for `constitution.md`
   - 8.2 Verbatim Directives for `spec.md`
   - 8.3 Verbatim Directives for `plan.md`
   - 8.4 Verbatim Directives for `tasks.md`
   - 8.5 Verbatim Directives for Autonomous Worker / Implementation Agents
9. [The Engineering Playbook: Greenfield Bootstrapping vs. Brownfield Governance](#9-the-engineering-playbook-greenfield-bootstrapping-vs-brownfield-governance)
   - 9.1 Greenfield Initialization Protocol
   - 9.2 Brownfield Retrofit & Incremental Boundary Quarantine
   - 9.3 Operational Metrics: Evaluating SDD Return on Investment (ROI)

---

## 1. Executive Summary: The Structural Shift from "Vibe Coding" to SDD

### 1.1 The Breakdown of Conversational "Vibe Coding"

Between 2023 and 2025, the initial wave of generative artificial intelligence in software engineering was characterized by unstructured, conversational interaction—a workflow commonly termed **"vibe coding."** Engineers interacted with Large Language Models (LLMs) via interactive chat interfaces (ChatGPT, Claude, early GitHub Copilot chat, Cursor composer), providing natural language prompts, evaluating code snippets visually, copying compiler error messages back into the conversation, and accepting generative diffs based on general sentiment.

While conversational vibe coding provides an extraordinary accelerator for greenfield proof-of-concepts, single-file scripts, and disposable prototypes, empirical evidence from enterprise engineering teams (Thoughtworks, GitHub Next, Google, Meta, and extensive developer retrospectives across Hacker News and Reddit) demonstrates that it **collapses under the weight of production software systems**. The root causes of this collapse are structural and mathematical:

1. **The Context Rot and Attention Dead-Zone ("Lost in the Middle")**: As multi-turn chat sessions progress, context windows become polluted with stack traces, superseded code implementations, and conversational banter. Under the "Lost in the Middle" phenomenon (Liu et al., Stanford/Berkeley), transformer attention weights degrade significantly in the central 60% of large context windows. Crucial architectural constraints delivered in turn 2 are forgotten by turn 14, leading to regression cascades where fixing bug $A$ silently re-introduces bug $B$.
2. **The Hallucination Cascade of Implicit Assumptions**: When a developer prompts an LLM with *"Implement user authentication"*, the model encounters hundreds of unstated branching decisions: token expiration, refresh rotation, password hashing algorithm, session storage, rate limiting, and error payload structures. Lacking an explicit contract, the LLM samples probabilistically from its training distribution. When subsequent turns require consistency with earlier implicit choices, the model hallucinates non-existent APIs or fractures architectural layers.
3. **Architectural Erosion & Locality of Convenience**: Generative agents operate by maximizing token likelihood under the immediate prompt. Lacking strict architectural boundaries, they select the path of least resistance: writing database calls directly inside UI components, bypassing service layers, introducing inconsistent state managers, or hardcoding magic numbers.
4. **Comprehension Debt & Cognitive Surrender**: Because LLMs produce clean, well-commented, syntactically fluent code accompanied by persuasive explanations, human engineers succumb to "borrowed confidence." Reviewers stop mentally simulating the execution paths and skim diffs for basic structure, approving PRs that introduce catastrophic latent concurrency bugs, data race conditions, and unhandled edge cases.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      THE VIBE CODING ENTROPY SPIRAL                    │
├────────────────────────────────────────────────────────────────────────┤
│  Conversational Prompt  ──▶  Statistical Assumption Sampling          │
│                                            │                           │
│                                            ▼                           │
│  Regression Cascade    ◀──  Context Window Saturation / "Lost in Middle│
│         │                                                              │
│         ▼                                                              │
│  Ad-Hoc Error Patching ──▶  Locality of Convenience (Architectural Rot)│
│                                            │                           │
│                                            ▼                           │
│                           UNMAINTAINABLE CODEBASE & ABANDONMENT        │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Defining Spec-Driven Development (SDD)

In response to the failure of conversational generation, the industry has formalized **Spec-Driven Development (SDD)**, pioneered and open-sourced by GitHub Next through **GitHub Spec Kit** (`github/spec-kit`, `specify-cli`).

SDD reframes AI-assisted engineering from an ephemeral conversational chat into a **deterministic, compiler-like process governed by version-controlled Markdown contracts**. In SDD:
- **Markdown is the Source Code of Intent**: Markdown files are treated as formal, human-readable, AI-executable specifications.
- **Specifications Precede and Bound Implementation**: An autonomous agent is strictly forbidden from touching application source code until the specification, architecture plan, and task backlog have been formally co-authored, disambiguated, and audited.
- **The Filesystem Replaces Ephemeral Context**: Instead of storing instructions in chat transcripts, the project state resides in Git-tracked repositories (`.specify/memory/constitution.md`, `specs/<feature>/spec.md`, `plan.md`, `tasks.md`). Context window resets no longer destroy system memory.
- **Strict Separation of Concerns**: Intent (**WHAT/WHY**) is permanently firewalled from Technical Design (**HOW**), which is decoupled from Atomic Work Units (**WHEN/TASKS**), which is validated by Mathematical Audits (**CONVERGE**).

### 1.3 Comparative Matrix: SDD vs. Vibe Coding vs. TDD vs. BDD

| Engineering Dimension | Conversational Vibe Coding ❌ | Test-Driven Development (TDD) ⚖️ | Behavior-Driven Development (BDD) ⚖️ | Spec-Driven Development (SDD) ✅ |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Source of Truth** | Ephemeral chat window & prompt buffer | Unit test suites (`*.test.ts`) | Feature files (`*.feature`) | Git-tracked Markdown contracts (`spec.md`, `plan.md`) |
| **Human Role** | Reactive prompt engineer / error paster | Test author & code implementer | Product/QA translator to Gherkin | Strategic architect, specification author, and gate reviewer |
| **AI Agent Role** | Unconstrained code generator | Autocomplete / test implementer | Step definition generator | Deterministic compiler executing structured tasks |
| **Handling of Architectural Invariants** | Uncontrolled; hallucinated ad-hoc | Implicitly enforced via test harness | Focused on user behavior, blind to system architecture | Explicitly governed via Supreme Constitution (`constitution.md`) |
| **Context Management** | Cumulative unpruned chat transcript | N/A (Manual file loading) | N/A (Manual file loading) | Progressive disclosure; single-task micro-contexts |
| **Drift & Regression Resilience** | Near zero; regressions compound | High within tested boundaries; poor on unwritten edge cases | High on business logic; blind to code architecture | Absolute; programmatic bi-directional convergence audits |
| **Optimal Project Scale** | Disposable scripts, <200 LOC prototypes | Greenfield or modular brownfield modules | Enterprise enterprise workflows with QA teams | Production-scale applications, multi-agent systems, complex domain models |

---

## 2. The 3 Tiers of SDD Adoption (Fowler & Böckeler Taxonomy)

In their seminal analysis of generative software engineering, Martin Fowler and Thoughtworks Distinguished Engineer Birgitta Böckeler categorize team adoption of Spec-Driven Development into three progressive tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE THREE TIERS OF SDD ADOPTION                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   TIER 3: SPEC-AS-SOURCE                                               │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ • Spec is the primary compiler input                           │   │
│   │ • Source code, tests, and schemas deterministically compiled   │   │
│   │ • Bi-directional convergence audits fail CI on manual edits    │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                  ▲                                     │
│                                  │                                     │
│   TIER 2: SPEC-ANCHORED          │                                     │
│   ┌──────────────────────────────┴─────────────────────────────────┐   │
│   │ • Specifications version-controlled alongside source code      │   │
│   │ • Markdown files survive agent context window resets           │   │
│   │ • Maintenance cycles update spec first before code patching    │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                  ▲                                     │
│                                  │                                     │
│   TIER 1: SPEC-FIRST             │                                     │
│   ┌──────────────────────────────┴─────────────────────────────────┐   │
│   │ • Spec drafted prior to initiating code generation             │   │
│   │ • Human and AI align on requirements before touching files     │   │
│   │ • Spec discarded or treated as static documentation post-merge │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Tier 1: Spec-First (Intent Alignment & Prompt Stabilization)
In Tier 1, developers abandon zero-shot conversational prompting. Before asking an agent to write code, the engineer collaborates with the AI to author a structured specification (`spec.md`) defining the user story, functional requirements, and edge cases. 
- **Value**: Prevents immediate hallucinations and forces upfront deliberation.
- **Limitation**: Once code is generated, the specification is often treated as static documentation and allowed to rot during subsequent maintenance cycles.

### 2.2 Tier 2: Spec-Anchored (Repository Persistence & Brownfield Governance)
In Tier 2, the specification is elevated to a first-class, version-controlled repository citizen (stored in `.specify/` and `specs/`). When bug fixes, feature extensions, or refactoring tasks arise:
- **The Spec-First Rule of Maintenance**: Engineers are prohibited from editing source code directly. The specification and implementation plan must be modified and reviewed *first*.
- **Immunity to Context Window Resets**: Because intent is anchored in the repository filesystem, an agent session can crash, restart, or switch LLM providers (e.g., from Claude 3.5 Sonnet to GPT-4o or Gemini 2.0) without losing the system's operational constraints.

### 2.3 Tier 3: Spec-as-Source (Deterministic Compilation & Bi-Directional Auditing)
In Tier 3—the apex of Spec-Driven Development—the specification acts as the primary programming source from which implementation code, unit tests, integration contracts, and documentation are deterministically compiled and audited.
- **Continuous Convergence**: The build system runs automated convergence checks (`/speckit-converge`). Any discrepancy between source code reality and specification intent causes build failure.
- **Zero Drift**: Code cannot drift from intent because unrequested code additions or missing specification requirements are treated as compiler errors.

---

## 3. The Canonical 8-Stage SDD Lifecycle Funnel

GitHub Spec Kit structures software engineering as a linear, 8-stage progressive funnel that eliminates ambiguity before a single line of application source code is written.

```
STAGE 0: CONSTITUTION (.specify/memory/constitution.md)
  │ Codifies non-negotiable architectural mandates, tech stack, and quality gates.
  ▼
STAGE 1: SPECIFY (/speckit-specify -> specs/<feature>/spec.md)
  │ Authors technology-agnostic user stories, functional requirements (FR), success criteria (SC).
  ▼
STAGE 2: CLARIFY (/speckit-clarify)
  │ Executes 10-dimension ambiguity scan; bounds clarification to max 3-5 high-impact questions.
  ▼
STAGE 3: CHECKLIST (/speckit-checklist -> checklists/*.md)
  │ Generates requirements quality tests ("Unit Tests for English"); human signs off.
  ▼
STAGE 4: PLAN (/speckit-plan -> plan.md, contracts/, data-model.md)
  │ Phase 0 research, Phase 1 technical design, evaluates programmatic Constitution Gate.
  ▼
STAGE 5: TASKS (/speckit-tasks -> tasks.md)
  │ Decomposes plan into dependency-ordered, test-driven, micro-scoped task graph.
  ▼
STAGE 6: ANALYZE (/speckit-analyze)
  │ Read-only cross-artifact consistency audit (Spec vs. Plan vs. Tasks vs. Constitution).
  ▼
STAGE 7: IMPLEMENT (/speckit-implement)
  │ Verifies checklist gate, executes tasks in micro-contexts, marks checkboxes [x].
  ▼
STAGE 8: CONVERGE (/speckit-converge)
  │ Audits codebase reality vs. spec intent; appends Phase N: Convergence tasks if gaps exist.
```

### 3.1 Stage 0: Constitution (`.specify/memory/constitution.md`)
The Project Constitution is the supreme governance contract of the repository. It codifies non-negotiable architectural principles, technology stack locks, security invariants, design system mandates, and quality gates.
- **Precedence**: The Constitution binds all developers, autonomous agents, and toolchains. It supersedes any conversational prompt, task description, or agent heuristic.
- **Immutability**: Agents cannot alter the Constitution during standard feature lifecycles. Amendments require formal architectural governance, semantic version bumps, and a Sync Impact Report.

### 3.2 Stage 1: Specify (`specs/<feature>/spec.md`)
Triggered via `/speckit-specify <description>`, this stage translates a natural language feature request into a formal behavioral specification.
- **The "What vs. How" Firewall**: Must describe user needs, business constraints, observable inputs/outputs, and edge cases in technology-agnostic terms. Technical implementation details (database tables, React hooks, REST routes) are strictly prohibited.
- **P1 MVP Slicing**: User stories must be prioritized (`P1`, `P2`, `P3`). User Story 1 (P1) is explicitly designed as the Minimum Viable Product (MVP) slice.

### 3.3 Stage 2: Clarify (`/speckit-clarify`)
Autonomous agents routinely fail when encountering underspecified requirements. The clarify stage conducts an adversarial scan across **10 Ambiguity Dimensions**:
1. *Boundary & Limit Conditions* (0 items, 1 item, max limits)
2. *Network & Transient Failures* (offline, timeouts, retry limits)
3. *Concurrency & Race Conditions* (double-clicks, out-of-order events)
4. *Security & Permission Boundaries* (unauthenticated, forbidden roles)
5. *Data Retention & Lifecycle* (caching, purge rules, soft-delete)
6. *Error States & Degradation* (fallback UI, partial failures)
7. *Scale & Volume Thresholds* (burst traffic, payload size limits)
8. *State Transitions & Invariants* (valid state machine paths)
9. *UX Friction & User Feedback* (loading states, confirmations)
10. *Platform & Device Constraints* (screen sizes, battery, permissions)

- **The Ambiguity Cap**: To prevent infinite question loops, the agent is restricted to asking a **maximum of 3 to 5 high-impact questions**. For secondary ambiguities, the agent must adopt standard industry defaults and record them in the `## Assumptions` section.

### 3.4 Stage 3: Checklist (`checklists/*.md`)
Generates formal validation checklists that act as **"Unit Tests for English."**
- Checklists evaluate the **clarity, completeness, and measurability of the specification**, NOT the behavior of the code.
- Establishes human reviewer ownership. An agent is strictly forbidden from checking custom domain review boxes.

### 3.5 Stage 4: Plan (`specs/<feature>/plan.md`)
Triggered via `/speckit-plan`, this stage translates the technology-agnostic specification into a concrete technical architecture.
- **Phase 0 Research (`research.md`)**: Resolves all technical unknowns via structured triplets: *Decision*, *Rationale*, *Alternatives Considered*.
- **Phase 1 System Design**: Generates concrete entity models (`data-model.md`), machine-readable interface contracts (`contracts/`), and validation runbooks (`quickstart.md`).
- **The Constitution Check Gate**: Evaluates every constitutional article before Phase 0 research and again after Phase 1 design. Any constitutional violation halts the planning process unless justified in the Complexity Tracking table.

### 3.6 Stage 5: Tasks (`specs/<feature>/tasks.md`)
Triggered via `/speckit-tasks`, this stage decomposes the implementation plan into an executable, dependency-ordered backlog.
- **Strict Grammar**: Every task follows `- [ ] [TaskID] [P?] [Story?] Description with exact/relative/path`.
- **Phase Organization**: Phase 1 (Setup) $\rightarrow$ Phase 2 (Foundational Gate) $\rightarrow$ Phase 3 (User Story 1 MVP) $\rightarrow$ Phase 4+ (Subsequent User Stories) $\rightarrow$ Phase N (Polish & Cross-Cutting).
- **TDD Red-Green-Refactor Coupling**: Within each user story, test-creation tasks precede implementation tasks.

### 3.7 Stage 6: Analyze (`/speckit-analyze`)
A strictly read-only, non-destructive audit examining cross-artifact consistency between `spec.md`, `plan.md`, `tasks.md`, and `constitution.md`.
- Detects duplication, unquantified adjectives, underspecified error cases, unmapped requirements (FRs with 0 tasks), and orphan tasks (tasks referencing files not in plan).
- Reports findings by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`). Any `CRITICAL` finding blocks implementation.

### 3.8 Stage 7: Implement (`/speckit-implement`)
Executes the tasks in `tasks.md` phase by phase, adhering to the single-task micro-context pattern.
- Verifies checklist gates before writing code.
- Executes automated test commands to confirm Red-Green transitions.
- Marks checkboxes `[x]` only after the verification command returns status code 0.

### 3.9 Stage 8: Converge (`/speckit-converge`)
Post-implementation forensic audit evaluating whether the codebase matches the specification.
- **The Append-Only Convergence Contract**: If gaps or deviations are discovered, `/speckit-converge` never alters past tasks or rewrites history. It appends `## Phase N: Convergence` with newly discovered tasks (`T###`) to the bottom of `tasks.md`.
- Gaps are classified as: `missing` (unimplemented requirement), `partial` (fails edge case), `contradicts` (violates spec or constitution), or `unrequested` (unauthorized scope creep).

### 3.10 Lifecycle Orchestration: Extension Hooks (`extensions.yml`)
Spec Kit supports lifecycle event interception via `.specify/extensions.yml`:
```yaml
hooks:
  before_specify:
    - command: "git checkout -b feature/${FEATURE_ID}"
      optional: false
  after_plan:
    - command: "npm run lint:contracts"
      optional: false
  before_implement:
    - command: "powershell .specify/scripts/check-checklists.ps1"
      optional: false
  after_implement:
    - command: "git add . && git commit -m 'feat: implement ${FEATURE_ID}'"
      optional: true
```

---

## 4. Structural Conventions & Linguistic Phrasing for AI Agents

LLMs do not parse text like human developers; they calculate statistical probability vectors across attention heads. Standard natural language prompts ("Please make sure this is robust") fail because they lack normative decision boundaries. SDD enforces rigorous linguistic conventions:

### 4.1 RFC 2119 Keyword Binding & Transformer Attention Grounding
Specifications and constitutional articles must use uppercase **RFC 2119 keywords**. Empirical testing shows these terms dramatically alter transformer attention weights:

| Keyword | Operational Weight | Behavioral Constraint on AI Coding Agent |
| :--- | :--- | :--- |
| **`MUST` / `REQUIRED` / `SHALL`** | P0 Absolute Invariant | Unconditional compliance. Any attempt to bypass triggers an immediate abort. |
| **`MUST NOT` / `SHALL NOT`** | P0 Absolute Prohibition | Hard architectural or security boundary. The agent is blocked from taking this path. |
| **`SHOULD` / `RECOMMENDED`** | P1 Strong Default | Standard engineering practice; deviations require explicit architectural justification. |
| **`MAY` / `OPTIONAL`** | P2 Permissible Discretion | Discretionary choice left to implementation agent optimization. |

### 4.2 The "Always / Ask First / Never" Guardrail Triad
Popularized by Google’s Addy Osmani, this triad defines explicit operational zones:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE THREE OPERATIONAL GUARDRAIL ZONES                │
├────────────────────────────────────────────────────────────────────────┤
│ 🟢 ALWAYS (Autonomous Green Zone):                                     │
│    • Run typechecks and unit tests after every atomic file edit.       │
│    • Import centralized tokens and shared UI layout primitives.        │
│    • Preserve backwards compatibility on public APIs and interfaces.   │
├────────────────────────────────────────────────────────────────────────┤
│ 🟡 ASK FIRST (Human-in-the-Loop Yellow Zone):                          │
│    • Altering database schemas or adding new migration scripts.        │
│    • Introducing new external package dependencies in package.json.   │
│    • Deleting existing public functions or deprecating endpoints.      │
├────────────────────────────────────────────────────────────────────────┤
│ 🔴 NEVER (Prohibited Red Zone):                                        │
│    • Commit credentials, API keys, or raw secrets.                     │
│    • Bypass failing tests using --no-verify, @ts-ignore, or mocks.    │
│    • Perform unrequested refactoring outside the active task's files.  │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Given-When-Then BDD Scenarios with Explicit `Evidence Check:` Links
Prose acceptance criteria lead directly to hallucinated test assertions. SDD mandates structured Gherkin scenarios paired with concrete verification commands:

```markdown
### AC-104: Offline SQLite Fallback on Network Loss
- **Given** an active user session with 15 unread messages in local cache
- **When** the device enters Airplane Mode and the user opens the conversation
- **Then** the UI MUST render all 15 cached messages in under 50ms, display a top offline banner (`#F5F5F7` background), and disable the cloud sync toggle.
- **Evidence Check**: `mobile/__tests__/offline-cache.test.ts` scenario "renders cached messages on airplane mode" exits with status code 0.
```

### 4.4 The Four-Quadrant Edge Case Matrix
Autonomous agents excel at happy-path logic but fail catastrophically at system boundaries unless explicitly instructed across four standard quadrants:

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│ QUADRANT 1: BOUNDARY & LIMITS         │ QUADRANT 2: NETWORK & TRANSIENT       │
│ • Empty state (0 records)             │ • Mid-stream socket disconnection     │
│ • Exactly 1 record (singular UI)      │ • HTTP 429 Rate Limit backoff         │
│ • Maximum limit (e.g., 10,000 items)  │ • HTTP 504 Gateway Timeout            │
│ • Integer/string payload overflows    │ • Airplane mode / offline vault       │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ QUADRANT 3: CONCURRENCY & RACES       │ QUADRANT 4: PERMISSIONS & SECURITY    │
│ • Rapid double-tap on submit button   │ • Expired JWT / invalid refresh token │
│ • Out-of-order asynchronous payloads  │ • Unauthorized tenant ID access (IDOR)│
│ • Simultaneous read/write on SQLite   │ • Malformed / tampered auth headers   │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

### 4.5 The Anti-Adjective Rule: Replacing Fluff with Quantitative Thresholds
Subjective adjectives are strictly prohibited in SDD specifications. Every qualitative statement must be translated into an objective, measurable metric:

```markdown
<!-- INCORRECT (Subjective Fluff - Causes Agent Hallucination) -->
The chat parser must be fast and handle errors gracefully.

<!-- CORRECT (Objective Operational Contract) -->
The chat parser MUST parse 10,000 raw WhatsApp message lines in under 800ms on Hermes engine. 
On malformed unicode lines, it MUST increment `parse_error_count`, skip the corrupted line, 
and continue parsing without raising an uncaught exception.
```

### 4.6 Declarative Positive Directives Paired with Negative Boundaries
LLMs interpret purely negative constraints unpredictably. Effective prompts pair a positive imperative with an explicit negative prohibition:
```markdown
All screen layouts MUST import structural containers from `mobile/src/components/ui/` (e.g. `<StatStrip>`, `<EditorialSection>`). 
Screens MUST NOT declare bespoke cards, border radii, or box shadows in local `StyleSheet.create()` blocks.
```

### 4.7 Scope Quarantine & Explicit Non-Goals
Autonomous agents suffer from scope creep. Every specification must enshrine an explicit quarantine block:
```markdown
## Non-Goals (Out of Scope for this Feature)
- ❌ Dark Mode theme implementation (strictly Light Apple HIG `#FFFFFF` canvas).
- ❌ Audio or video voice-note transcription.
- ❌ Modifying the universal database provider abstract class interface.
```

---

## 5. The "What vs. How" Firewall

The most critical architectural failure in naive SDD is the **leakage of technical implementation details into the behavioral specification (`spec.md`)**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       THE WHAT VS. HOW FIREWALL                        │
├──────────────────────────────────┬─────────────────────────────────────┤
│ SPECIFICATION (`spec.md`)        │ IMPLEMENTATION PLAN (`plan.md`)     │
│ WHAT users need & WHY            │ HOW the system builds it            │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Domain business rules          │ • Concrete programming language/ver │
│ • Observable user interactions   │ • Directory structures & file paths │
│ • Input validation rules         │ • Third-party library & SDK choices │
│ • Quantitative success metrics   │ • SQLite schemas, DDL, migrations   │
│ • Edge case behaviors            │ • Zustand state stores, hooks, APIs │
│ • Functional Requirements (FR)   │ • Component boundaries & interfaces │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 🚫 FORBIDDEN IN SPEC:            │ 🎯 MANDATORY IN PLAN:               │
│ "Use React hooks", "Query SQLite"│ "Use useReducer in ChatStore.ts"    │
│ "Return HTTP 200 with JSON"      │ "FastAPI async route /api/v1/chat"  │
│ "Style with Tailwind bg-white"   │ "Apply design token canvas #FFFFFF" │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 5.1 Architectural Principle of Decoupling Intent from Implementation
When a specification dictates implementation details (e.g., *"FR-004: Save user token to localStorage via redux-persist"*), it produces three severe failures:
1. **Premature Architectural Lock-In**: It blinds the planning agent from choosing superior patterns (e.g., synchronous MMKV storage or SecureStore).
2. **Review Inaccessibility**: Business stakeholders, product managers, and compliance auditors cannot evaluate the specification without stumbling over technical jargon.
3. **Fragile Verification**: When technical libraries change, the entire business specification becomes invalidated even though user requirements remain unchanged.

### 5.2 Absolute Prohibition of Tech Stack Leakage in `spec.md`
Linter and review agents must enforce the following absolute prohibitions in `spec.md`:
- **Prohibited**: Class names, function names, file paths, variable names (`chat_service.py`, `useChatState`).
- **Prohibited**: Framework and library names (`React`, `Expo`, `FastAPI`, `Pydantic`, `SQLAlchemy`, `Axios`).
- **Prohibited**: Database dialects and syntax (`SQLite`, `PostgreSQL`, `SELECT * FROM`, `FOREIGN KEY`).
- **Prohibited**: Protocol specifics unless the feature is explicitly a protocol adapter (`HTTP 200`, `REST endpoint`, `gRPC stream`).

### 5.3 Concrete Transformation Examples: Spec Intent to Architectural Plan

| Business Intent in `spec.md` (WHAT) | Technical Architecture in `plan.md` (HOW) |
| :--- | :--- |
| **FR-001**: System MUST verify that exported chat file contains exactly two human participants. | **Validator**: `mobile/src/services/ChatValidator.ts` regex parsing sender identifiers, extracting unique set. If `participants.size != 2`, dispatches `ParticipantCountError`. |
| **FR-002**: System MUST calculate the median response latency between alternating conversation turns. | **Chronemics Engine**: `backend/src/telemetry/chronemics.py` `calculate_median_latency()` clamping turns <30s and filtering overnight sleep gaps (11 PM - 8 AM >4h). |
| **FR-003**: System MUST permit the user to permanently purge all stored conversations in 1 tap. | **Hard Wipe Controller**: `PurgeService.ts` executing `db.runAsync("DELETE FROM messages; VACUUM;")` and deleting `FileSystem.cacheDirectory` files. |

---

## 6. Requirements Checklists as "Unit Tests for English" & Reviewer Ownership

One of the most consequential contributions of GitHub Spec Kit is reframing markdown checklists:

> **Checklists test the QUALITY of the requirements, NOT the behavior of the implemented code.**

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SPECIFICATION QUALITY GOVERNANCE                     │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 1. Machine-Evaluated Checklists  │ 2. Reviewer-Owned Domain Checklists │
│    (`checklists/requirements.md`)│    (`checklists/security.md`, etc.) │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Evaluated by AI agent/linter   │ • Owned EXCLUSIVELY by humans       │
│ • Tests syntax, tech-neutrality, │ • Tests domain depth, compliance,   │
│   measurability, FR/SC formatting│   security invariants, UX edge cases│
│ • Automatically toggled by agent │ • AI agent is STRICTLY FORBIDDEN    │
│   during specify/clarify passes  │   from checking these boxes         │
│ • Validates spec completeness    │ • Serves as human approval GATE     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 6.1 Testing Requirements Quality Before Code Execution
Traditional software teams write unit tests to verify that code fulfills requirements. SDD introduces a preceding layer: **unit testing the English requirements themselves**.
A requirements checklist asks:
- Are all requirements uniquely identified (`FR-001`)?
- Are all requirements technology-agnostic?
- Is there at least one measurable success criterion for every user story?
- Are edge cases categorized across all four quadrants?
- Has ambiguity been resolved or bounded to $\le 3$ questions?

### 6.2 Machine-Evaluated Checklists vs. Reviewer-Owned Domain Checklists
Spec Kit bifurcates checklists into two governance tiers:
1. **Machine-Evaluated Checklists (`checklists/requirements.md`)**: Automatically audited and toggled by `/speckit-specify` and `/speckit-analyze`. These ensure formal schema compliance.
2. **Reviewer-Owned Domain Checklists (`checklists/security.md`, `checklists/privacy.md`)**: Maintained strictly for human architects, security leads, and compliance officers. **An AI coding agent is strictly forbidden from checking these boxes autonomously.**

### 6.3 The Reviewer Checkbox Contract & The Implementation Gate
- **Unchecked (`- [ ]`)**: Signifies that the requirement is unreviewed, unverified, or ambiguous.
- **Checked (`- [x]`)**: Signifies that a human engineer has audited the requirement text and confirmed it is sound. **It does NOT mean the code is written!**
- **The Implementation Gate**: When `/speckit-implement` is triggered, the agent inspects all `checklists/*.md`. If any custom checklist contains unchecked boxes (`- [ ]`), the agent halts and demands human confirmation before proceeding.

---

## 7. Comprehensive Taxonomy of SDD Anti-Patterns & Failure Modes

Synthesizing post-mortems from production agent deployments, the following 10 anti-patterns represent the primary failure modes in Spec-Driven Development:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 10 SDD ANTI-PATTERNS TAXONOMY                    │
├────┬────────────────────────────────────┬──────────────────────────────┤
│ #  │ Anti-Pattern Name                  │ Primary Failure Mechanism    │
├────┼────────────────────────────────────┼──────────────────────────────┤
│ 1  │ Monolithic Task Trap               │ Under-decomposition          │
│ 2  │ Keystroke Micro-Management Trap    │ Over-decomposition           │
│ 3  │ Flat-List Fallacy                  │ Missing dependency graph     │
│ 4  │ "Waterfall Strikes Back" / Rigidity│ Inflexible batch execution   │
│ 5  │ Context Window Exhaustion          │ "Lost in the Middle" rot     │
│ 6  │ Specification Theater              │ Formalism without auditing   │
│ 7  │ Cognitive Surrender                │ Blind trust in AI output     │
│ 8  │ Comprehension Debt                 │ Code growth > human mental mo│
│ 9  │ The Maintenance Tax & Spec Drift   │ Bypassing spec on bug fixes  │
│ 10 │ "Great Specs, No MVP" Paralysis    │ Over-ceremony on trivial code│
└────┴────────────────────────────────────┴──────────────────────────────┘
```

### 7.1 Anti-Pattern 1: The Monolithic Task Trap (Under-Decomposition)
- **Manifestation**: Authoring tasks with broad, composite scopes: `- [ ] T002 Implement full WhatsApp chat parser and database storage in backend/`.
- **Root Cause**: Planner agent laziness, delegating architectural synthesis to the worker agent during code execution.
- **Agent Failure Mode**: The implementation agent accumulates massive context across multiple files. Stack traces, lint errors, and partial edits saturate the context window, causing attention degradation, dropped edge cases, and half-implemented components.
- **Remedy**: **The 1-File / 1-Test Rule**. Decompose tasks such that every leaf task touches no more than 1–3 closely coupled files and can be executed and verified within a single isolated prompt turn.

### 7.2 Anti-Pattern 2: The Keystroke Micro-Management Trap (Over-Decomposition)
- **Manifestation**: Slicing tasks into keystroke-level steps: `- [ ] Step 1: Add import statement in file.ts`, `- [ ] Step 2: Define interface`, `- [ ] Step 3: Implement method`.
- **Root Cause**: Over-correcting for agent hallucination by attempting to script the agent like a deterministic compiler.
- **Agent Failure Mode**: Enormous token consumption passing coordination state back and forth. The agent loses sight of the cohesive component architecture, producing syntactically valid code fragments that fail to integrate.
- **Remedy**: **Executable Leaf Nodes**. Task slicing stops when a task describes a cohesive, testable functional unit (e.g., `- [ ] T008 [P] [US1] Implement TurnClusteringService with 90s merge threshold in src/services/turn_cluster.ts`).

### 7.3 Anti-Pattern 3: The Flat-List Fallacy (Missing Dependency Graph)
- **Manifestation**: Providing an unorganized, flat list of checkboxes in `tasks.md` without declaring execution order or blocking prerequisites.
- **Root Cause**: Assuming the coding agent will read the entire backlog and deduce the optimal build order.
- **Agent Failure Mode**: The agent executes tasks out of sequence (e.g., writing UI screen routes before domain models exist, or writing database queries before migrations are executed), triggering compilation crashes and wasted debugging cycles.
- **Remedy**: **Phase-Coupled Hierarchical Decomposition**. Organize tasks into sequential architectural phases: Phase 1 (Setup) $\rightarrow$ Phase 2 (Foundational Gate) $\rightarrow$ Phase 3 (US1 MVP) $\rightarrow$ Phase 4+ (Subsequent Stories) $\rightarrow$ Phase N (Polish). Explicitly flag parallel opportunities with `[P]`.

### 7.4 Anti-Pattern 4: "Waterfall Strikes Back" / Static Plan Rigidity
- **Manifestation**: Generating a monolithic 40-step plan upfront and blindly executing tasks 1 through 40 regardless of discoveries or compiler errors encountered along the way.
- **Root Cause**: Treating SDD as traditional Big Design Up Front (BDUF) rather than an iterative, just-in-time compile loop.
- **Agent Failure Mode**: If Task 4 reveals that an assumed third-party library API signature does not exist, a rigid agent continues executing Tasks 5–40, producing hundreds of lines of code dependent on the fictional method.
- **Remedy**: **Phase Checkpoints & Adaptive Convergence**. Enforce execution checkpoints: after completing a user story phase, the agent audits the codebase state before initiating the next phase.

### 7.5 Anti-Pattern 5: Context Window Exhaustion & Attention Degradation ("Lost in the Middle")
- **Manifestation**: Concatenating the entire repository codebase, complete constitution, full spec, architectural plan, and all past task histories into every single tool call.
- **Root Cause**: Naive context loading without filtering or progressive disclosure.
- **Agent Failure Mode**: Early constitutional invariants get pushed into the "Lost in the Middle" attention dead-zone. The agent begins violating core design system tokens or security rules despite them being present in the prompt.
- **Remedy**: **Single-Task Micro-Context Injection**. Pass only: (1) Core constitutional RFC 2119 rules, (2) The single active task block, (3) Directly referenced interface contracts, and (4) The target implementation file.

### 7.6 Anti-Pattern 6: Specification Theater & Green-Check Blindness
- **Manifestation**: Teams generate exhaustive 50-page specs and 100-item task lists with AI, skim them without reading, and approve all PRs as long as automated unit tests show green checkmarks.
- **Root Cause**: **Cognitive Surrender**. The speed of AI generation outpaces human cognitive absorption.
- **Agent Failure Mode**: The agent writes tautological unit tests (`expect(true).toBe(true)` or tests that mock out the very bug they were meant to catch), passing CI while introducing fatal architectural flaws.
- **Remedy**: **The Maker-Checker Segregation & "Explain It Back" Gate**. The agent generating code cannot author the acceptance test without independent human review, or a secondary adversarial auditor agent checks test rigor.

### 7.7 Anti-Pattern 7: Cognitive Surrender & Borrowed Confidence
- **Manifestation**: Engineers stop mentally parsing generated code diffs. Because LLMs generate fluent, cleanly indented, syntactically pleasing code accompanied by polite explanations, humans fall victim to **borrowed confidence**, assuming the code is functionally sound.
- **Root Cause**: Psychological fatigue from reviewing massive volumes of generative code.
- **Remedy**: **Deliberate Friction Gates**. Enforce high-signal PR summaries requiring developers to explain the architectural trade-offs made in plain English.

### 7.8 Anti-Pattern 8: Comprehension Debt & The Illusion of Control
- **Manifestation**: A codebase expands from 5,000 to 50,000 lines of code in weeks. All tests pass, but no single human engineer on the team understands the underlying control flow or failure modes.
- **Root Cause**: Prioritizing raw generative throughput over conceptual mastery.
- **Agent Failure Mode**: When a production outage occurs at 2:00 AM, the engineering team cannot diagnose the issue because the mental model of the system was never formed.
- **Remedy**: **Living Documentation & Code Simplification Audits**. SDD models must enforce minimal change principles and mandate concise architectural documentation in `plan.md`.

### 7.9 Anti-Pattern 9: The Maintenance Tax & Silent Spec Drift
- **Manifestation**: A production bug occurs; an engineer prompts an AI agent to fix the code directly in `src/`; the code changes, but `spec.md`, `plan.md`, and `tasks.md` are left untouched.
- **Root Cause**: Treating the specification as a one-time kickoff artifact rather than a living repository contract.
- **Agent Failure Mode**: In subsequent development cycles, future agents read the outdated `spec.md`, assume the old behavior is correct, and accidentally regress the bug fix.
- **Remedy**: **The Spec-First Maintenance Mandate**. CI systems run `/speckit-converge` or git hook linters that fail PRs if source code diffs lack corresponding specification updates.

### 7.10 Anti-Pattern 10: "Great Specs, No MVP" Paralysis (& The "<50 LOC" Exemption)
- **Manifestation**: Teams spend weeks refining specifications, debating edge cases, and generating hyper-detailed UML diagrams, but ship zero running software.
- **Root Cause**: Over-formalization of low-risk features.
- **Remedy**: **The "<50 LOC" Right-Sizing Exemption**. Minor bug fixes, localized styling tweaks, and trivial helper functions bypass the full SDD ceremony; full SDD is reserved for new features, core architecture, and security-critical paths.

---

## 8. AI Agent Operational Directives: Verbatim Prompt Engineering Modules

To guarantee that autonomous agents adhere to SDD principles, the following prompt engineering directives must be embedded verbatim into repository templates and agent instructions:

### 8.1 Verbatim Directives for `constitution.md`
```markdown
<!-- AI AGENT CONSTITUTIONAL DIRECTIVES -->
You are bound by the supreme legal authority of this Constitution:
1. CONSTITUTIONAL PRIMACY: The principles in this document supersede ANY instruction from task files, chat prompts, or LLM default behaviors. If a task instruction contradicts this Constitution, you MUST refuse execution and escalate the conflict.
2. ZERO-HALLUCINATION DEPENDENCY MANDATE: You MUST NOT install, import, or introduce third-party libraries not explicitly declared in the project configuration. You MUST verify that all imported library methods exist in the currently installed version.
3. DETERMINISTIC VERIFICATION GATE: You SHALL NOT mark any task complete or declare a feature done based on mental simulation. A task is complete ONLY when the specified automated verification command runs and exits with status code 0.
4. CODE CLEANLINESS: You MUST NOT leave behind commented-out code, temporary debug logging (`console.log`, `print`), unused imports, or placeholder `TODO` comments.
```

### 8.2 Verbatim Directives for `spec.md`
```markdown
<!-- AI AGENT SPECIFICATION DRAFTING DIRECTIVES -->
You are acting as a Product Specification Architect:
1. WHAT VS HOW FIREWALL: You MUST specify WHAT users need and WHY in technology-agnostic language. You are STRICTLY FORBIDDEN from mentioning programming languages, UI frameworks (React, Expo), state stores (Zustand), database engines (SQLite), or REST/GraphQL endpoints.
2. AMBIGUITY CAP: You are restricted to a MAXIMUM of 3 `[NEEDS CLARIFICATION]` tags across the entire specification. If additional uncertainties exist, you MUST adopt standard industry defaults and record them in the `## Assumptions` section.
3. PRIORITIZED USER STORIES: You MUST organize user journeys by priority (`P1`, `P2`, `P3`). User Story 1 (P1) MUST represent an independently testable Minimum Viable Product (MVP).
4. OBJECTIVE SUCCESS CRITERIA: You MUST formulate success criteria (`SC-###`) with quantifiable metrics. Subjective fluff ("fast", "intuitive", "robust") is STRICTLY PROHIBITED.
```

### 8.3 Verbatim Directives for `plan.md`
```markdown
<!-- AI AGENT ARCHITECTURAL PLANNING DIRECTIVES -->
You are acting as a Principal Systems Architect:
1. CONSTITUTION CHECK GATE: Before drafting technical designs, you MUST evaluate every Article in `constitution.md`. You MUST explicitly record verification evidence in the Constitution Check table. Any violation halts planning immediately.
2. COMPONENT BOUNDARIES: You MUST define concrete directory structures and module boundaries. Screen components MUST NOT query databases or network clients directly; all access MUST flow through designated domain services.
3. DESIGN SYSTEM INTEGRITY: All UI components MUST consume centralized design tokens. You MUST NOT propose bespoke cards, local border radii, or inline color literals in screen styles.
```

### 8.4 Verbatim Directives for `tasks.md`
```markdown
<!-- AI AGENT TASK DECOMPOSITION DIRECTIVES -->
You are acting as an Engineering Lead Task Decomposer:
1. STRICT TASK GRAMMAR: Every task MUST follow the syntax: `- [ ] [TaskID] [P?] [Story?] Description with exact/relative/path`.
2. EXACT RELATIVE PATHS: Every single task MUST explicitly state the relative filesystem path of the file to create or modify. Vague tasks lacking paths are syntax violations.
3. TDD SEQUENCING: Within each user story phase, test-creation tasks MUST precede implementation tasks. The test MUST be designed to fail prior to implementation.
4. DEPENDENCY ISOLATION: The parallel flag `[P]` MAY be assigned ONLY to tasks that operate on isolated files with zero unresolved dependencies within the same phase.
```

### 8.5 Verbatim Directives for Autonomous Worker / Implementation Agents
```markdown
<!-- AI AGENT WORKER IMPLEMENTATION DIRECTIVES -->
You are acting as an Autonomous Implementation Worker:
1. SINGLE TASK FOCUS: You MUST execute exactly ONE task per turn. Do not look ahead, modify unrelated files, or execute subsequent tasks until the active task is verified.
2. VERIFICATION PROTOCOL:
   - Step 1: Inspect target files and verify prerequisite dependencies.
   - Step 2: Implement minimal functional code adhering strictly to the task description.
   - Step 3: Run the exact verification command specified in the task block.
   - Step 4: If the verification fails, fix the code and rerun until passing.
   - Step 5: Mark the task checkbox `[x]` ONLY after the command exits with code 0.
3. SCOPE QUARANTINE: You MUST NOT touch any file not explicitly listed in the active task's description.
```

---

## 9. The Engineering Playbook: Greenfield Bootstrapping vs. Brownfield Governance

### 9.1 Greenfield Initialization Protocol
When bootstrapping a brand-new software system using Spec-Driven Development:
1. **Initialize Governance (`Stage 0`)**: Author `.specify/memory/constitution.md` enshrining non-negotiable architectural layers, UI tokens, security rules, and test mandates.
2. **Author Feature 001 (`Stage 1-5`)**:
   - `spec.md`: Define the core user journey as `User Story 1 (P1) 🎯 MVP`.
   - `plan.md`: Set up directory scaffolds, package dependencies, and evaluate the Constitution Check gate.
   - `tasks.md`: Organize into:
     - *Phase 1: Setup* (Project initialization, tooling, lint configs)
     - *Phase 2: Foundational* (Database schemas, core domain models, abstract providers)
     - *Phase 3: User Story 1 MVP* (Tests first, then domain logic, then UI primitives, then screen routing)
3. **Execute & Verify (`Stage 6-8`)**:
   - Run `/speckit-analyze` to verify 100% coverage of FRs to tasks.
   - Execute Phase 1 and Phase 2. Confirm foundational gate passes.
   - Execute Phase 3. Validate running MVP software.
   - Run `/speckit-converge` to lock in the converged state.

### 9.2 Brownfield Retrofit & Incremental Boundary Quarantine
Attempting to rewrite an entire legacy codebase with SDD all at once is an anti-pattern. Brownfield adoption requires **Incremental Boundary Quarantine**:
1. **Ratify a Baseline Constitution**: Author `.specify/memory/constitution.md` codifying rules for *new* code, while explicitly declaring legacy quarantine zones (e.g., *"New features MUST NOT import legacy database models directly"*).
2. **The Feature Slicing Rule**: Apply SDD exclusively to new features or major refactoring milestones. Each new feature creates an isolated specification folder under `specs/<NNN-feature>/`.
3. **Quarantine Adapters**: When a new feature must communicate with legacy systems, create an explicit anti-corruption adapter layer (`legacy_adapter.ts`) rather than allowing legacy spaghetti to infect the new specification.
4. **The Spec-First Rule of Bug Fixes**: When fixing a bug in an existing SDD-governed module, update `spec.md` with an edge case scenario *before* modifying code.

### 9.3 Operational Metrics: Evaluating SDD Return on Investment (ROI)
Engineering leaders should monitor three primary metrics to assess SDD effectiveness:
- **First-Pass Convergence Rate**: Percentage of tasks that pass their verification command on the first execution attempt (Target: $\ge 85\%$).
- **Regression Cascade Frequency**: Number of unintended regressions introduced per 100 tasks executed (Target: $<2\%$).
- **PR Review Turnaround Time**: Time required for human architects to review and merge agent PRs, enabled by explicit traceability between PR diffs and Acceptance Criteria (Target: $<15\text{ minutes}$).

---

*Authored and verified by AI Systems Research & Architecture Taskforce. Approved for production deployment.*
