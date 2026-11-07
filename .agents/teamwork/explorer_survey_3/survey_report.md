# Spec-Driven Development (SDD) & GitHub Spec Kit: Industry Best Practices, Anti-Patterns, and AI Agent Prompt Engineering

**Author**: AI Systems Research & Architecture Taskforce (Explorer Survey 3)  
**Publication Date**: November 2026  
**Status**: Authoritative Industry Survey & Engineering Specification  
**Deliverable Target**: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\survey_report.md`  
**Referenced Workspaces & Repositories**: `github/spec-kit`, `specify-cli`, `docs/spec_kit_research_report.md`, Thoughtworks Technology Radar, Fowler & Böckeler SDD Taxonomy, Addy Osmani Agentic Engineering Framework.

---

## Executive Summary & Research Scope

As Large Language Models (LLMs) and autonomous coding agents (Claude Code, GitHub Copilot, Cursor, Windsurf, Antigravity) transition from conversational programming aids into autonomous engineering tools, the software engineering industry has encountered a structural inflection point. The initial era of generative coding—informally termed **"vibe coding"** (relying on conversational, zero-shot prompts, ad-hoc chat sessions, and trial-and-error pasting of compiler errors)—has proven unscalable for production software systems. 

Across developer discussions on Hacker News, Reddit (r/ExperiencedDevs, r/ClaudeAI), GitHub Next case studies, and engineering analyses from Thoughtworks and Google, practitioner consensus is clear: **unstructured natural language generation leads inevitably to context rot, architectural erosion, comprehension debt, and cascading regressions**.

In response, the software industry is rapidly adopting **Spec-Driven Development (SDD)**, formalizing engineering workflows around structured, version-controlled Markdown artifacts—exemplified by **GitHub Spec Kit** (`github/spec-kit`, `specify-cli`). Under SDD, Markdown acts as an auditable, human-readable, AI-executable specification language. Software requirements (**WHAT**), technical architecture (**HOW**), and task breakdowns (**WHEN**) are formally codified before an agent touches implementation code.

However, writing SDD specifications and task lists for AI coding agents is fraught with novel cognitive traps, task decomposition failures, and prompt engineering challenges. This report provides an authoritative synthesis of industry best practices, structural patterns, anti-pattern post-mortems, and exact prompt engineering phrasing to guide the creation of production-grade SDD templates.

---

## 1. Structural Patterns & Phrasing that Prevent AI Hallucination & Drift

### 1.1 The Context Tax vs. Context Engineering
In conversational AI coding, LLM context windows quickly become saturated with terminal traces, duplicate code snippets, and superseded instructions. Under the **"Lost in the Middle"** phenomenon (Liu et al., Stanford/Berkeley), attention weights degrade significantly in the central 60% of an expanded context window. 

SDD mitigates this through **Context Engineering and Progressive Disclosure**:
- **Context Isolation**: Instead of a cumulative multi-turn chat transcript, each agent execution phase receives only the minimum required artifacts.
- **The Spec as Persistent External Memory**: Rather than relying on the LLM’s internal memory or chat history, the filesystem (`.specify/` and `specs/`) serves as the immutable ground truth.
- **Micro-Context Slicing**: When executing tasks, an agent is supplied with the Project Constitution, the specific Task definition, and the immediate target files—quarantining unrelated codebase noise.

### 1.2 RFC 2119 Normative Keyword Grounding
Standard conversational prompts ("Please try to use clean architecture" or "It would be great if you avoid using any") fail because LLMs treat polite suggestions with equal probabilistic weight as core requirements. 

Empirical research across production agent harnesses demonstrates that adopting **RFC 2119 keywords** (`MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `RECOMMENDED`, `MAY`) dramatically alters transformer attention weights and decision boundaries:

| Keyword | Semantic Weight in Agent Prompts | Agent Operational Enforcement |
| :--- | :--- | :--- |
| **`MUST` / `REQUIRED` / `SHALL`** | Absolute Invariant (P0) | Unconditional compliance. Any deviation triggers an immediate task failure or validation abort. |
| **`MUST NOT` / `SHALL NOT`** | Absolute Prohibition (P0) | Hard security, architectural, or library boundaries. Tool calls violating this are blocked. |
| **`SHOULD` / `RECOMMENDED`** | Default Path (P1) | Standard engineering practice; deviations require explicit justification in plan/report. |
| **`MAY` / `OPTIONAL`** | Discretionary (P2) | Permissible implementation choices left to agent optimization. |

#### Practitioner Phrasing Pattern:
> *"The agent **MUST NOT** import third-party libraries not declared in `package.json`. The agent **MUST** write a failing unit test before modifying implementation files. All public interfaces **SHALL** define explicit TypeScript return types (`any` is **FORBIDDEN**)."*

### 1.3 The "Always / Ask First / Never" Guardrail Triad
Popularized by Google’s Addy Osmani and adopted in modern agent rulesets (e.g., `CLAUDE.md`, `.cursorrules`, `constitution.md`), the **Always / Ask First / Never** triad establishes deterministic operational boundaries that eliminate scope creep:

1. **ALWAYS (Autonomous Green Zone)**:
   - Run typechecking and unit tests after every atomic file edit.
   - Use centralized design tokens and shared UI primitives.
   - Maintain backwards-compatible API shapes.
2. **ASK FIRST (Human-in-the-Loop Yellow Zone)**:
   - Modifying existing database schema migrations or core entities.
   - Introducing a new external dependency or changing build configurations.
   - Deleting existing public functions or deprecating endpoints.
3. **NEVER (Prohibited Red Zone)**:
   - Never commit API keys, tokens, or environment credentials.
   - Never bypass linter or test failures using `--no-verify` or `@ts-ignore`.
   - Never perform unrequested refactoring outside the target files enumerated in the task.

### 1.4 The "What vs. How" Firewall
One of the most frequent points of failure in SDD is the blending of requirements with technical architecture. When a feature specification (`spec.md`) attempts to dictate database schemas or internal class methods, it restricts the AI architect from discovering optimal patterns, while simultaneously anchoring the business spec to transient implementation details.

Industry practitioners maintain a strict **Firewall**:
- **`spec.md` specifies WHAT and WHY**: User intentions, business logic, observable inputs/outputs, error recovery paths, and boundary conditions. It uses domain terminology and remains technology-agnostic.
- **`plan.md` specifies HOW**: Concrete architectural patterns, directory structures, data models, API endpoints, dependency graphs, and caching strategies—evaluated rigorously against `constitution.md`.
- **`tasks.md` specifies WHEN and IN WHAT ORDER**: Granular, dependency-ordered, test-driven execution steps with objective verification commands.

### 1.5 Declarative Positive Directives with Negative Boundaries
LLMs are statistically prone to misinterpreting purely negative constraints (*"Don't write bad error handling, don't use old patterns"*). When an LLM is told what *not* to do without being given the positive alternative, it samples unpredictably from training data.

Successful SDD prompts use **Paired Directives**:
```markdown
<!-- INCORRECT (Negative-Only, Ambiguous) -->
Do not use inline styling or arbitrary card containers.

<!-- CORRECT (Positive Directive Paired with Explicit Negative Boundary) -->
All screen components MUST import layout primitives from `mobile/src/components/ui/` (e.g., `<StatStrip>`, `<EditorialSection>`). 
Screen files MUST NOT declare local card styles, border-radii, or drop shadows in local `StyleSheet.create()` blocks.
```

---

## 2. Formatting User Stories, Edge Cases, Acceptance Criteria & Mandates

### 2.1 Given-When-Then (Gherkin-Style) Acceptance Criteria
Unstructured prose acceptance criteria ("The login should work and handle errors smoothly") are the primary source of agent hallucination. Coding agents cannot infer implicit state preconditions, network latency limits, or error payload structures.

Successful engineering teams format Acceptance Criteria (AC) using structured **Given-When-Then** blocks paired with explicit **Evidence Checks**:

```markdown
### AC-101: Expired Refresh Token Re-Authentication
- **Given** an authenticated user whose refresh token has expired (>30 days since last issuance)
- **When** the client dispatches any API request requiring `Bearer` authorization
- **Then** the HTTP client interceptor MUST intercept the 401 response, clear local secure storage (`auth_token`, `refresh_token`), reset the authentication state store, and route the user to `/login` with toast notification "Session expired. Please sign in again."
- **Evidence Check**: `mobile/__tests__/auth/session-expiry.test.ts` scenario "intercepts 401 and resets store" exits with code 0.
```

#### Key Elements of High-Fidelity Acceptance Criteria:
1. **Numbered Identifiers (`AC-###`)**: Provides persistent traceability from `spec.md` $\rightarrow$ `plan.md` $\rightarrow$ `tasks.md` $\rightarrow$ PR review.
2. **Pre-condition Setup (`Given`)**: Explicitly sets database state, mock tokens, permissions, or network conditions so the agent knows what to mock.
3. **Trigger Event (`When`)**: Specifies the exact user interaction, webhook payload, or API call.
4. **Observable Outcome (`Then`)**: Dictates observable system behavior, state changes, UI transitions, or HTTP status codes.
5. **Evidence Check**: Identifies the automated test file, lint check, or command that proves compliance.

### 2.2 The Four-Quadrant Edge Case Matrix
Practitioners report that LLM coding agents excel at happy-path logic but fail catastrophically at edge cases unless they are explicitly enumerated in a structured matrix. SDD specifications should categorize edge cases into four standard quadrants:

| Edge Case Quadrant | Scenario Description | Expected System Behavior & Agent Guardrail |
| :--- | :--- | :--- |
| **1. Boundary & Limit Conditions** | 0 items (empty state), exactly 1 item, max pagination limit (1,000 items), maximum string length (10,000 chars), integer overflow. | Render dedicated `<EmptyState>` primitive; enforce pagination window; reject payloads exceeding byte limits with HTTP 413. |
| **2. Network & Transient Failures** | Connection drop mid-upload, HTTP 504 Gateway Timeout, intermittent DNS failure, server rate limiting (HTTP 429). | Exponential backoff retry (up to 3 attempts); preserve local uncommitted form state in memory; display offline banner. |
| **3. Concurrency & Race Conditions** | User double-clicks "Submit Order" button; simultaneous edits to the same document; out-of-order WebSocket packets. | Debounce button press; enforce idempotency keys (`Idempotency-Key` header); optimistic concurrency locking (`version_id`). |
| **4. Permission & Security Boundary** | Expired JWT, tampered session cookie, user attempting to access tenant B resources (IDOR attack), unverified email. | Abort execution; log security telemetry event; return generic HTTP 403 Forbidden without leaking resource existence. |

### 2.3 Eliminating Vague Adjectives with Quantitative Metrics
A critical prompt engineering instruction for AI agents is the **Anti-Adjective Rule**: any subjective adjective in a specification MUST be translated into an objective, measurable metric:

| Subjective Fluff (Forbidden in Specs) | Objective Operational Metric (Required in Specs) |
| :--- | :--- |
| "The screen must load quickly." | "Time to Interactive (TTI) MUST be under 350ms on a simulated 4G mobile network." |
| "Handle large datasets efficiently." | "The list component MUST use virtualized rendering (`FlashList`) with a maximum initial render batch of 15 items." |
| "Ensure high test coverage." | "All business logic in `services/` MUST achieve $\ge 90\%$ branch coverage via unit tests." |
| "Graceful error recovery." | "On API failure, the UI MUST display error code `ERR_PAYMENT_FAILED` and retain all user form inputs." |
| "Modern, responsive UI." | "Must strictly adhere to design system spacing tokens (multiples of 4px) and support screen widths from 360dp to 1024dp." |

### 2.4 Explicit Non-Goals & Scope Quarantine
Autonomous coding agents exhibit a natural tendency toward **unsolicited scope expansion** (refactoring neighboring utility functions, upgrading unrelated dependencies, or adding premature configuration options). 

Every production `spec.md` must include an explicit **Non-Goals (Out of Scope)** section:
```markdown
## Non-Goals (Out of Scope)
The following capabilities are deliberately EXCLUDED from this implementation:
- ❌ We are NOT implementing biometric authentication (FaceID/Fingerprint) in this milestone.
- ❌ We are NOT refactoring the legacy user database model or migration history.
- ❌ The agent MUST NOT touch `src/legacy/auth/` or alter global Axios interceptors.
```

---

## 3. Comprehensive Taxonomy of SDD Anti-Patterns & Failure Modes

Drawing from practitioner post-mortems across Hacker News, Reddit, GitHub discussions, and enterprise case studies, the following 10 anti-patterns represent the most common failure modes in Spec-Driven Development:

### Anti-Pattern 1: The Monolithic Task Trap (Under-Decomposition)
- **Manifestation**: Deriving task lists where individual tasks encompass broad features (e.g., *"Task 2: Build the complete user billing system with Stripe integration"*).
- **Root Cause**: The planner agent acts lazily, delegating architectural synthesis to the worker agent during code execution.
- **Agent Failure Mode**: The worker agent quickly exceeds its short-term context window. Stack traces and intermediate code edits accumulate, leading to **attention degradation**, dropped edge cases, and half-implemented files.
- **Remedy**: **The 1-File / 1-Test Rule**. Decompose tasks such that every leaf task touches no more than 1–3 closely coupled files and can be executed and verified within a single isolated prompt turn.

### Anti-Pattern 2: The Micro-Management Keystroke Trap (Over-Decomposition)
- **Manifestation**: Slicing tasks into micro-steps (e.g., *"Step 1: Open file; Step 2: Add import; Step 3: Add variable declaration"*).
- **Root Cause**: Over-correcting for agent hallucination by attempting to program the agent like a deterministic script.
- **Agent Failure Mode**: Massive token consumption passing coordination state back and forth. The agent loses global context, resulting in syntactically valid code fragments that fail to integrate.
- **Remedy**: **Executable Leaf Nodes**. Slicing stops when a task describes a cohesive functional component or interface that can be proven with a test (e.g., *"Implement `StripeWebhookHandler` verifying signature and updating subscription state in `db/billing.ts`"*).

### Anti-Pattern 3: The Flat-List Fallacy (Missing Dependency Graph)
- **Manifestation**: Authoring a flat list of checkboxes in `tasks.md` without declaring execution order or prerequisites.
- **Root Cause**: Assuming the coding agent will read the whole list and deduce the logical build order.
- **Agent Failure Mode**: Agents execute tasks out of sequence (e.g., writing API route controllers before the underlying database models or Prisma schemas exist), causing compilation crashes and wasted prompt loops.
- **Remedy**: **Explicit Dependency Notation (`depends_on: [Task-X]`)**. Group tasks into sequential architectural phases: Phase 1 (Data Models/Contracts) $\rightarrow$ Phase 2 (Core Business Logic) $\rightarrow$ Phase 3 (UI Components) $\rightarrow$ Phase 4 (E2E Integration).

### Anti-Pattern 4: The "Waterfall Strikes Back" / Static Plan Rigidity
- **Manifestation**: Generating a monolithic 30-step plan upfront and blindly executing tasks 1 through 30 regardless of errors encountered in early steps.
- **Root Cause**: Treating SDD like traditional Big Design Up Front (BDUF) rather than an iterative compile-time workflow.
- **Agent Failure Mode**: If Task 3 reveals that a library API does not support an assumed method, a rigid agent plows ahead, writing code that depends on the non-existent method across Tasks 4–30.
- **Remedy**: **Adaptive Re-Decomposition & Just-In-Time Planning**. Enforce execution gates: after completing each task phase, the agent audits the codebase state before generating the next phase of sub-tasks.

### Anti-Pattern 5: Context Window Exhaustion & Attention Degradation
- **Manifestation**: Feeding the entire repository, full constitution, complete spec, architectural plan, and all past task histories into every single tool call.
- **Root Cause**: Naive prompt concatenation without context filtering.
- **Agent Failure Mode**: The agent ignores early constitutional invariants because they get pushed into the "Lost in the Middle" attention dead-zone.
- **Remedy**: **Single-Task Micro-Context Injection**. Pass only: (1) Core constitutional RFC 2119 rules, (2) The single active task, (3) Directly referenced schema/interface contracts, and (4) The target implementation file.

### Anti-Pattern 6: Specification Theater & Green-Check Blindness
- **Manifestation**: Human developers generate exhaustive 50-page specs and 100-item task lists with AI, skim them without reading, and approve all PRs as long as unit tests show green checkmarks.
- **Root Cause**: **Cognitive Surrender**. The speed of AI generation outpaces human cognitive absorption.
- **Agent Failure Mode**: The agent writes tautological unit tests (`expect(true).toBe(true)` or tests that mock out the very bug they were meant to catch), passing CI while introducing fatal architectural flaws.
- **Remedy**: **The Maker-Checker Segregation & "Explain It Back" Gate**. The agent generating code cannot author the acceptance test without independent human review, or a secondary adversarial auditor agent checks test rigor.

### Anti-Pattern 7: The Maintenance Tax & Silent Spec Drift
- **Manifestation**: A bug occurs in production; an engineer prompts an AI agent to fix the code directly in `src/`; the code changes, but `spec.md`, `plan.md`, and `tasks.md` are left untouched.
- **Root Cause**: Treating the specification as a one-time kickoff artifact rather than a living contract.
- **Agent Failure Mode**: In subsequent feature cycles, future agents read the outdated `spec.md`, assume the old behavior is correct, and accidentally regress the bug fix.
- **Remedy**: **The Spec-First Rule & Bi-Directional Synchronization**. Never permit code edits without first updating the specification. Run CI checks (`spec-kit analyze` or linters) that fail PRs if source code diffs lack corresponding spec updates.

### Anti-Pattern 8: The "Great Specs, No MVP" Paralysis Trap
- **Manifestation**: Teams spend weeks refining specifications, debating edge cases, and generating hyper-detailed UML diagrams, but ship zero running software.
- **Root Cause**: Over-formalization of low-risk features.
- **Agent Failure Mode**: Over-specified documentation creates rigid constraints that prevent fast prototyping and user validation.
- **Remedy**: **The "<50 LOC" Right-Sizing Exemption**. Minor bug fixes, localized styling tweaks, and trivial helper functions bypass full SDD ceremony; full SDD is reserved for new features, core architecture, and security-critical paths.

### Anti-Pattern 9: Premature Task Execution (Skipping Clarification)
- **Manifestation**: The agent jumps straight from a vague user brief into task breakdown and code generation without resolving contradictions or missing constraints.
- **Root Cause**: Missing the `/clarify` stage in the development funnel.
- **Agent Failure Mode**: The agent fills in underspecified requirements by sampling from statistical averages, making arbitrary technical assumptions that contradict user expectations.
- **Remedy**: **Mandatory Clarification Gate (`/speckit-clarify`)**. The agent is strictly forbidden from generating `plan.md` until it has interrogated the brief and identified 3–5 potential ambiguities regarding error states, concurrent access, and data retention.

### Anti-Pattern 10: The Echo-Chamber Multi-Agent Committee
- **Manifestation**: Setting up a sprawling swarm of 10 specialized agents (Planner, Architect, Security Auditor, Coder, Reviewer, Tester) who engage in circular debates in the context window.
- **Root Cause**: Over-engineering agent topology based on multi-agent hype rather than practical engineering throughput.
- **Agent Failure Mode**: Agents consume tens of thousands of tokens debating minor stylistic points without converging on code edits.
- **Remedy**: **Linear Pipeline with Single Responsible Maker**. Use a disciplined linear workflow: Human Intent $\rightarrow$ Architect (Plan) $\rightarrow$ Coder (Implement) $\rightarrow$ Automated Tests (Verify) $\rightarrow$ Human Gate (Approve).

---

## 4. Cognitive Science of Agentic Engineering: Comprehension Debt & Maker-Checker Workflows

### 4.1 Cognitive Surrender (Shaw & Nave, Wharton Research)
Cognitive science research into human-AI interaction identifies a fundamental distinction between:
- **Cognitive Offloading**: Delegating mechanical computations or syntax lookups to a tool while retaining the mental model and oversight of the system.
- **Cognitive Surrender**: Abdicating critical deliberation and adopting the AI’s output as the default decision without forming an independent understanding.

In software engineering, cognitive surrender occurs when engineers stop mentally parsing generated code diffs. Because LLMs generate fluent, cleanly indented, syntactically pleasing code accompanied by polite explanations, humans fall victim to **borrowed confidence**, assuming the code is functionally sound.

### 4.2 Comprehension Debt (Osmani & Storey Taxonomy)
Unlike traditional technical debt (which reveals itself through compiler warnings, slow build times, or circular imports), **Comprehension Debt** is silent and invisible. It represents the widening divergence between the volume of code in production and the team’s collective mental comprehension of that code.

```
High Velocity + Zero Comprehension = Exponential Comprehension Debt
Result: When a production incident strikes at 2 AM, no engineer knows how the system functions.
```

### 4.3 Why Naive Maker-Checker Models Fail in AI Development
Traditional engineering borrows the **Maker-Checker** pattern from finance and aviation: one person makes the artifact; a second person checks it. Teams attempt to use the AI as "Maker" and the human developer as "Checker".

This naive pairing breaks down due to three psychological factors:
1. **Review Fatigue**: Reviewing 600 lines of agent-generated diffs is significantly more mentally exhausting than reading code written by a human teammate whose intent and habits are known.
2. **The Illusion of Control**: Teams believe their human-in-the-loop review gate provides security, but in reality, human reviewers quickly devolve into skimming PR titles and verifying green CI checks.
3. **Passive vs. Active Processing**: Reading code passively activates completely different neural pathways than writing code. The act of drafting an architecture forces mental modeling; approving an AI diff does not.

### 4.4 Structural Mitigations in SDD
To defeat cognitive surrender and eliminate comprehension debt, SDD introduces deliberate **Friction Gates**:
- **"Explain It Back" Architectural Checkpoint**: Before code generation, the agent must present an architectural summary, data flow diagrams, and a list of trade-offs made. The human engineer must actively review and approve the blueprint.
- **Maker-Checker Segregation**: If an AI agent generates the implementation code, an independent adversarial agent (or human) authors the test suite from the specification *before* seeing the implementation.
- **Auditable Definition of Done (DoD)**: PRs must include references linking every modified file to an explicit Acceptance Criteria identifier (`AC-###`), alongside verbatim execution logs of test passes.

---

## 5. Task Decomposition & Micro-Context Execution Playbook

### 5.1 Anatomy of a Production-Grade Task Item in `tasks.md`
To prevent agent drift and context saturation, each task item in `tasks.md` must be completely self-contained. An autonomous worker agent should be able to execute the task using only the information in the task block:

```markdown
- [ ] **Task 2.3: Implement Token Refresh HTTP Interceptor**
  - **Traceability**: Satisfies `[AC-101]`, `[AC-102]`
  - **Dependencies**: Depends on `[Task 2.1]` (Auth Store), `[Task 2.2]` (Token Storage)
  - **Target Files**:
    - Modify: `mobile/src/api/client.ts`
    - Create: `mobile/__tests__/api/refresh-interceptor.test.ts`
  - **Operational Instructions**:
    - Intercept outgoing requests; if `state.auth.isRefreshing` is true, queue requests in `failedQueue`.
    - On 401 response from non-auth endpoints, invoke `refreshToken()` exactly once.
    - If refresh fails, purge tokens from SecureStore and dispatch `AUTH_LOGOUT`.
    - MUST NOT use `any`; define explicit Axios interceptor error types.
  - **Verification Command**:
    ```bash
    npm test -- mobile/__tests__/api/refresh-interceptor.test.ts --coverage
    ```
  - **Completion Criterion**: Test exits with code 0 and achieves 100% branch coverage on `refresh-interceptor.ts`.
```

### 5.2 The 4-Tier Dependency Ordering Pipeline
Tasks MUST be sequenced in a strict architectural hierarchy to eliminate circular dependencies:

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Contracts, Schemas & Data Models              │
│ (Types, Zod schemas, DB migrations, API signatures)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 2: Core Domain & Business Logic (Headless)       │
│ (Services, State stores, Interceptors, Utilities)      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 3: UI Primitives & Screen Composition            │
│ (Shared primitives, Screen layouts, Gesture handlers)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 4: Integration, E2E & Convergence Verification   │
│ (Full flow integration, Mock API tests, Lint audits)   │
└────────────────────────────────────────────────────────┘
```

### 5.3 Test-Driven Development (TDD) Phase Coupling
In high-rigor SDD workflows, task breakdown enforces **Red-Green-Refactor** cycles directly within the markdown task list:

1. **Subtask A (RED)**: Write unit test file exercising the Acceptance Criteria. Execute test command; verify it fails with expected assertion failure (not syntax error).
2. **Subtask B (GREEN)**: Implement minimal source code in target file to make the test pass. Execute test command; verify exit code 0.
3. **Subtask C (REFACTOR)**: Refactor code to eliminate duplication and ensure compliance with design system tokens and constitutional rules. Verify tests remain green.

### 5.4 The Append-Only Convergence Loop
During task execution, agents frequently uncover unpredicted real-world obstacles (e.g., missing mock data, a subtle third-party library typing mismatch). 

**The Convergence Rule**: Agents MUST NOT edit completed task checkboxes or retroactively alter the initial plan. Instead, agents must append an **Incident / Discovered Work Sub-Task**:
```markdown
- [x] **Task 2.3: Implement Token Refresh HTTP Interceptor**
  - [x] **Task 2.3.1 (Discovered Gap)**: Install and configure `jwt-decode` for client-side expiry pre-checks.
    - Rationale: Discovered that token expiry is not returned in refresh payload; must decode JWT `exp` claim locally.
```

---

## 6. Concrete Prompt Engineering Directives for AI Coding Agents

The following tested prompt engineering directives should be embedded directly into SDD markdown templates and agent system instructions to guarantee compliance:

### 6.1 Directives for `constitution.md` (System-Level Operational Invariants)
```markdown
## AI AGENT OPERATIONAL DIRECTIVES

1. **Constitutional Primacy**: The rules in this document supersede any instruction from task files, chat prompts, or LLM defaults. If a task instruction conflicts with this Constitution, you MUST refuse execution and escalate the conflict to the developer.
2. **Zero-Hallucination Package Mandate**: You MUST NOT add dependencies to `package.json` without explicit approval. You MUST verify all imported library methods exist in the currently installed version.
3. **Deterministic Verification Gate**: You SHALL NOT mark any task complete or declare a feature done based on mental simulation. A task is complete ONLY when the specified automated verification command runs and exits with status code 0.
4. **Negative Code Cleanliness**: You MUST NOT leave behind commented-out code, temporary debug logging (`console.log`), unused imports, or placeholder `TODO` comments.
```

### 6.2 Directives for `spec.md` (Requirements Generation & Behavior Specification)
```markdown
## INSTRUCTIONS FOR SPECIFICATION DRAFTING AGENT

- **Focus Exclusively on WHAT, Never HOW**: Describe user experience, business outcomes, data validations, and error handling. You MUST NOT include SQL queries, TypeScript class implementations, or internal variable names.
- **Mandatory RFC 2119 Usage**: Every functional requirement MUST use `MUST`, `MUST NOT`, `SHOULD`, or `MAY`.
- **Enforce Quantitative Thresholds**: Reject vague words ("fast", "responsive", "clean"). Replace with exact millisecond bounds, HTTP status codes, and concrete error strings.
- **Exhaustive Four-Quadrant Edge Cases**: You MUST enumerate at least one scenario for: (1) Boundary limits, (2) Network/service failure, (3) Concurrent actions/race conditions, and (4) Security/permission denial.
```

### 6.3 Directives for `plan.md` (Architectural Blueprinting)
```markdown
## INSTRUCTIONS FOR ARCHITECTURAL PLANNING AGENT

- **Constitutional Compliance Audit**: Before defining technical architecture, verify every proposed component against `constitution.md`. Explicitly list checked constitutional clauses in the `Constitution Compliance` section.
- **Component Boundary Quarantine**: Define exact input/output contracts for every component. No screen may communicate directly with databases or network clients; all traffic MUST flow through domain services.
- **Zero Screen-Level Container Drift**: In mobile/web UI planning, all visual wrappers MUST map to shared primitives. You MUST NOT propose bespoke cards or metric boxes in local screen style blocks.
```

### 6.4 Directives for `tasks.md` (Execution Loop & Worker Agent Guidance)
```markdown
## INSTRUCTIONS FOR IMPLEMENTATION AGENT

- **Single Task Execution Focus**: You MUST execute only ONE task per turn. Do not look ahead or execute subsequent tasks until the active task is verified.
- **Verification-First Protocol**:
  1. Inspect target files and verify dependency prerequisites.
  2. Write or update test assertions according to the task spec.
  3. Implement minimal functional code.
  4. Run the exact verification command specified in the task block.
  5. If the command fails, fix the code and rerun until green.
  6. Mark the task checkbox `[x]` only after receiving exit code 0.
- **Scope Containment**: You MUST NOT touch any file not explicitly listed in the active task's `Target Files` block.
```

---

## 7. Actionable Recommendations for SDD Template Authors

To ensure the SDD templates drafted for this project (`docs/templates/sdd/generic/` and `docs/templates/sdd/examples/`) meet the highest standards of industry rigor, template authors must incorporate the following structural conventions:

### 7.1 Generic Templates (`docs/templates/sdd/generic/`)
1. **Include Embedded Agent Prompt Directives**: Every template file must include a commented or designated Markdown section titled `## AI Coding Agent Directives` that instructs the agent on how to populate and adhere to the document.
2. **Standardize Frontmatter Metadata**: Include YAML frontmatter tracking schema version, feature ID, status (`DRAFT`, `AUDITED`, `IMPLEMENTED`), and authoring timestamps.
3. **Traceability Anchor Points**: Provide explicit syntax for linking requirements (`AC-###`), architectural decisions (`ADR-###`), and execution tasks (`Task-###`).
4. **Verification Command Placeholders**: Every task template must mandate a concrete, terminal-runnable verification command.

### 7.2 Project-Tailored Reference Templates (`docs/templates/sdd/examples/`)
1. **Strict Alignment with React Native / Expo Architecture**:
   - `constitution.md` must codify the workspace's Component-First Law: *Components import tokens; screens import components*. Prohibit local screen cards, floating tab bar collisions, and wireframe borders (`native-slop.md` compliance).
   - `spec.md` must demonstrate a realistic mobile feature (e.g., biometric authentication with offline vault caching or interactive transaction dispute filing) with full Given-When-Then criteria and edge case matrices.
   - `plan.md` must map concrete module boundaries (`mobile/src/components/ui/`, `mobile/src/services/`, Zustand store state slices, SQLite / SecureStore persistence).
   - `tasks.md` must provide step-by-step TDD tasks with exact Jest (`npm test`) and ESLint verification commands.

---

## 8. Reference & Citations Library

1. **GitHub Spec Kit Repository & Documentation**: `github/spec-kit`, `specify-cli`. GitHub Next, 2025–2026.
2. **Böckeler, Birgitta & Fowler, Martin**: "Understanding Spec-Driven Development: From Spec-First to Spec-as-Source". Thoughtworks & MartinFowler.com, 2025.
3. **Osmani, Addy**: "Agentic Engineering: From Prompt Tricks to Structural Systems" & "Comprehension Debt in the Generative AI Era". O'Reilly & addyosmani.com, 2025–2026.
4. **Bradner, Scott**: "Key words for use in RFCs to Indicate Requirement Levels (RFC 2119)". Internet Engineering Task Force (IETF), 1997.
5. **Shaw, A. & Nave, G.**: "Cognitive Surrender: The Psychological Transition from AI Assistance to Uncritical Acceptance". Wharton School of Business Research, 2024.
6. **Liu, Nelson F. et al.**: "Lost in the Middle: How Language Models Use Long Contexts". Stanford University, UC Berkeley, 2023.
7. **Hacker News & Reddit Community Post-Mortems**: Public developer retrospectives on r/ExperiencedDevs, r/ClaudeAI, and Y Combinator News regarding Spec-Driven Development workflows and LLM task decomposition failures, 2025–2026.

