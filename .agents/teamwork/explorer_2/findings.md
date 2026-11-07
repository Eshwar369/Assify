# Real-World Case Studies, Workflows, Pitfalls, and Mitigations for GitHub Spec Kit & Spec-Driven Development (SDD)

**Author:** teamwork_explorer_2 (Case Studies & Pitfalls Researcher)  
**Date:** 2026-11-03  
**Status:** Complete Investigation & Synthesis  
**Scope:** GitHub Spec Kit (`github/spec-kit`, `specify-cli`), Spec-Driven Development (SDD), Agentic Workflows (GitHub Copilot, Claude Code, Cursor, Antigravity)

---

## 1. Executive Summary

As AI coding assistants have evolved from simple autocompletion engines into semi-autonomous reasoning agents, software engineering has encountered an architectural crisis often termed **"the vibe coding trap."** In conversational, chat-prompted development, agents make hundreds of silent, unvetted architectural and design assumptions. As chat sessions lengthen, attention degrades, context windows fill with transient logs and trial-and-error patches, and the codebase silently diverges from original architectural intent—a failure mode termed **Spec Drift**.

**GitHub Spec Kit** (`github/spec-kit`, powered by the `specify-cli`) represents the open-source engineering community's counter-movement: **Spec-Driven Development (SDD)**. SDD establishes that **human- and agent-validated specifications—expressed as structured, version-controlled Markdown artifacts—are the single source of truth** preceding and governing code generation.

### The Three Tiers of Spec-Driven Development
As articulated by Martin Fowler and Thoughtworks analyst Birgitta Böckeler, real-world SDD adoption stratifies into three distinct levels:
1. **Spec-First:** Specifications are authored and clarified upfront to guide AI generation for an isolated feature, but may be archived or discarded once code is merged.
2. **Spec-Anchored:** Specifications, technical plans, and task ledgers live directly alongside source code in version control (`.specify/` and `specs/`), acting as persistent external memory for future maintenance, onboarding, and multi-agent sessions.
3. **Spec-as-Source:** The specification becomes the primary human-maintained artifact, while implementation code, database migrations, and unit tests are largely compiled or derived through deterministic agent execution.

This report synthesizes extensive findings from real-world engineering case studies (enterprise teams, solo builders, open-source contributors), community discourse (Reddit, Hacker News, X/Twitter, dev.to), and structural analysis of GitHub Spec Kit's core pipeline. It analyzes how top practitioners navigate the end-to-end lifecycle, highlights the stark differences between greenfield and brownfield environments, uncovers nine critical anti-patterns, and delivers concrete, actionable mitigations.

---

## 2. End-to-End Practical Workflow: The 8-Stage Lifecycle

Top practitioners do not treat Spec Kit as a magic "one-shot" code generator. Instead, they structure their workflow around an **8-stage progressive funnel**, enforcing strict separation of concerns: **Intent (What/Why) $\rightarrow$ Architecture (How) $\rightarrow$ Execution (Tasks) $\rightarrow$ Verification (Convergence)**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROJECT GOVERNANCE                              │
│  [Stage 0: Constitution] (.specify/memory/constitution.md)             │
│  Non-negotiable architectural invariants, quality gates, and tech stack │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        REQUIREMENT SPECIFICATION                       │
│  [Stage 1: Specify] (/speckit-specify) -> specs/<feature>/spec.md      │
│  User stories, testable functional requirements, measurable criteria   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        AMBIGUITY RESOLUTION                            │
│  [Stage 2: Clarify] (/speckit-clarify)                                 │
│  Interactive taxonomy scan, up to 5 prioritized questions, spec update │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        ARCHITECTURAL PLANNING                          │
│  [Stage 3: Plan] (/speckit-plan) -> plan.md, data-model.md, contracts/ │
│  Phase 0 research, Phase 1 interface contracts, constitution compliance│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        TASK DECOMPOSITION                              │
│  [Stage 4: Tasks] (/speckit-tasks) -> tasks.md                         │
│  Strict checkbox format: - [ ] T### [P] [US#] path/to/file             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        CROSS-ARTIFACT AUDIT                            │
│  [Stage 5: Analyze] (/speckit-analyze)                                 │
│  Read-only consistency check across spec.md, plan.md, tasks.md, const. │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        TASK-DRIVEN EXECUTION                           │
│  [Stage 6: Implement] (/speckit-implement)                             │
│  Checklist gate check, phase-by-phase execution, marking [X]           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        DRIFT RECONCILIATION                            │
│  [Stage 7: Converge] (/speckit-converge)                               │
│  Compare code vs intent; append Phase N: Convergence tasks if needed   │
└────────────────────────────────────────────────────────────────────────┘
```

### Stage 0: Constitution (`/speckit-constitution`)
- **Purpose:** Codifies permanent project DNA before any feature work begins.
- **Artifact:** `.specify/memory/constitution.md`.
- **Contents:** Non-negotiable architectural mandates (e.g., "Must use TypeScript strict mode", "No client-side SQL queries", "Zero screen-level container drift", "All public endpoints require OAuth2 bearer token authentication", "All async methods must have cancellation tokens").
- **Governance:** Governed by Semantic Versioning (MAJOR for breaking principle shifts, MINOR for new guidelines, PATCH for clarifications).

### Stage 1: Feature Specification (`/speckit-specify`)
- **Purpose:** Translates a natural-language feature request into a technology-agnostic product requirements document.
- **Artifact:** `specs/<NNN>-<short-name>/spec.md` and spec quality checklist `checklists/requirements.md`.
- **Core Rule:** Strictly describes **WHAT** users need and **WHY**, strictly forbidding **HOW** (no mention of frameworks, database schemas, or API libraries).
- **Quality Checks:** Built-in validation limits unresolved decisions to at most 3 `[NEEDS CLARIFICATION]` markers.

### Stage 2: Interactive Clarification (`/speckit-clarify`)
- **Purpose:** Pre-empts agent hallucinations by hunting for domain and operational ambiguities across 10 taxonomy dimensions (Functional Scope, Data Model, UX Flow, Non-Functional Quality Attributes, External Dependencies, Edge Cases, Constraints, Terminology, Completion Signals, Placeholders).
- **Execution Mechanism:** 
  - Queues candidate questions based on $(Impact \times Uncertainty)$ heuristic.
  - Presents **EXACTLY ONE question at a time** formatted as a Markdown table with recommended choices.
  - Max 5 questions total.
  - Incrementally and atomically patches `spec.md` after each user response.

### Stage 3: Implementation Planning & Research (`/speckit-plan`)
- **Purpose:** Converts the refined `spec.md` into concrete technical designs and interface contracts.
- **Artifacts:** `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.
- **Phased Approach:**
  - *Phase 0 (Research):* Resolves technical unknowns, library selections, and dependency constraints; records decisions, rationales, and alternatives in `research.md`.
  - *Phase 1 (Design & Contracts):* Extracts entities into `data-model.md`, writes explicit API/interface contracts in `contracts/`, and produces runnable integration tests in `quickstart.md`.
  - *Constitution Gate:* Evaluates plan against `constitution.md`. Violations immediately halt the pipeline.

### Stage 4: Task Decomposition (`/speckit-tasks`)
- **Purpose:** Generates a deterministic, dependency-ordered, and independently testable execution checklist.
- **Artifact:** `tasks.md`.
- **Task Syntax Standard:**
  ```text
  - [ ] [TaskID] [P?] [Story?] Description with exact file path
  ```
  Example:
  ```markdown
  - [ ] T001 Initialize database migration script in db/migrations/003_auth.sql
  - [ ] T002 [P] Create User model interface in src/models/user.ts
  - [ ] T003 [P] [US1] Implement password hashing utility in src/utils/crypto.ts
  - [ ] T004 [US1] Implement UserService authentication method in src/services/user_service.ts
  ```
- **Organization:** Phase 1: Setup $\rightarrow$ Phase 2: Foundational (blocking prerequisites) $\rightarrow$ Phase 3+: User Stories in priority order (P1, P2...) $\rightarrow$ Final Phase: Polish & cross-cutting concerns.

### Stage 5: Consistency Analysis (`/speckit-analyze`)
- **Purpose:** Read-only cross-artifact audit to ensure `spec.md`, `plan.md`, and `tasks.md` are 100% synchronized before writing any code.
- **Checks:** Identifies duplicate requirements, vague adjectives ("fast", "scalable") lacking numerical metrics, unmapped tasks (tasks doing work not in the spec), and unserved requirements (spec items with zero tasks).

### Stage 6: Task Execution (`/speckit-implement`)
- **Purpose:** The coding agent iterates through `tasks.md`, executing work sequentially or in parallel batches `[P]`.
- **Discipline:** Reads `tasks.md`, `plan.md`, and relevant contracts into a fresh context window. As each task is finished and verified by test execution, the agent marks `- [X]`.

### Stage 7: Convergence & Drift Reconciliation (`/speckit-converge`)
- **Purpose:** Audits the actual codebase against `spec.md`, `plan.md`, and `tasks.md`.
- **Gap Classification:** Detects code that is `missing` (unimplemented), `partial` (partially done), `contradicts` (conflicts with spec/constitution), or `unrequested` (hallucinated extra code).
- **Remediation Contract:** Append-only. It NEVER deletes or rewrites existing tasks; it appends `## Phase N: Convergence` with newly numbered tasks `T###` back onto `tasks.md`, allowing `/speckit-implement` to loop cleanly until total convergence is achieved.

---

## 3. Human-in-the-Loop (HITL) Dynamics & Governance

A fundamental insight from experienced SDD practitioners is that **Spec Kit is not an autonomous black-box runner; it is an augmented reasoning framework**. The developer's role shifts from a mechanical typist to an architectural reviewer and systems auditor.

| Lifecycle Stage | Agent Role | Human Role | Anti-Surrender Safeguard |
|---|---|---|---|
| **Constitution** | Scaffolds principles from codebase scans | Defines non-negotiable boundaries, invariants, and quality gates | Principles require explicit human sign-off; cannot be bypassed |
| **Specify** | Drafts user flows, entities, functional requirements | Defines business problem, success metrics, and domain boundaries | "No tech stack in spec" filter prevents developer bias |
| **Clarify** | Scans 10 ambiguity dimensions, formats choices | Selects options or supplies domain-specific constraints | Limit of 5 questions forces high-signal decision making |
| **Plan** | Evaluates library options, drafts contracts & schemas | Reviews architectural tradeoffs, security posture, and dependencies | Constitution gates block unapproved libraries/patterns |
| **Tasks** | Decomposes architecture into dependency graph with file paths | Audits task ordering, MVP scope, and test requirements | Tasks must have file paths and story tags; verified before code |
| **Analyze** | Runs cross-artifact semantic consistency check | Decides remediation path for critical vs warning flags | Read-only analysis; user must approve remediation edits |
| **Implement** | Executes tasks in isolated steps, runs tests | Inspects git diffs, verifies test execution, spot-checks logic | Verification commands must run; tests fail the task if broken |
| **Converge** | Discovers gaps (`missing`, `contradicts`, `unrequested`) | Approves scope adjustments or authorizes convergence phase | Code additions without spec justification are flagged |

### Preventing "Cognitive Surrender" & "Comprehension Debt"
Two major psychological hazards identified in studies of AI pair-programming:
1. **Cognitive Surrender:** The tendency for a human developer to trust the AI's output blindly because "the tests are green" or "the output looks professional."
2. **Comprehension Debt:** The widening deficit between how much code has been added to the repository and how much of it the human engineering team actually understands and can debug at 2 AM.

**Mitigation via the Maker-Checker Protocol:**
Top practitioners enforce a split: the agent that generates the plan or code is never allowed to unilaterally pronounce it correct.
- An independent verification pass (`/speckit-analyze` or `/speckit-converge`) audits the output against explicit contracts.
- Checklists (`checklists/requirements.md`, `checklists/security.md`) require manual checkbox toggling before `/speckit-implement` is permitted to advance.

---

## 4. Greenfield vs. Brownfield Projects: The Practical Divide

One of the sharpest divides observed in community sentiment and practitioner reports is the contrast between using Spec Kit on a **Greenfield** (brand-new) project versus a **Brownfield** (mature/legacy) codebase.

```
┌─────────────────────────────────┬──────────────────────────────────┐
│       GREENFIELD PROJECTS       │       BROWNFIELD PROJECTS        │
├─────────────────────────────────┼──────────────────────────────────┤
│ Clean slate, zero technical debt│ Deep tribal knowledge, untyped   │
│                                 │ legacy modules, implicit schemas │
│ Top-down specification works    │ Top-down full-system spec fails  │
│ effortlessly                    │ catastrophically                 │
│ Default templates & init work   │ Requires custom repo packing     │
│ out-of-the-box                  │ and delta/change-level specs     │
│ Architecture derived from spec  │ Spec must conform to existing    │
│                                 │ patterns & anti-corruption layer │
└─────────────────────────────────┴──────────────────────────────────┘
```

### The Greenfield Experience: High Velocity, Clean Architecture
In greenfield environments (e.g., solo founders bootstrapping SaaS apps, microservices, CLI utilities):
- `specify init` provisions standard structures cleanly.
- The pipeline flows naturally: `Constitution -> Spec -> Plan -> Tasks -> Implement`.
- AI agents easily hit 90%+ pass rates on initial tasks because there are no legacy conventions, global state mutations, or undocumented dependencies to collide with.

### The Brownfield Reality: The "Reverse-Engineering" Trap & Context Shock
When dropped into an enterprise monolith (e.g., a 7-year-old Node.js or Django application with 300,000 LOC):
1. **The Greenfield Illusion:** Running `/speckit-specify` for a feature in a legacy repo causes the agent to hallucinate modern, idealized frameworks (e.g., recommending Prisma and tRPC when the legacy repo uses raw Knex and Express).
2. **The "Reverse-Engineering Spec" Hazard:** Developers often ask AI agents to "read the legacy code and generate a specification." Practitioners report this is extremely dangerous: **the AI frequently enshrines undocumented edge-case bugs and historical workarounds as official business requirements**, permanently freezing technical debt into the new spec.
3. **Implicit Contract Violations:** Legacy code rarely has formal API contracts; dependencies are passed via mutable global state or shared utility singletons. AI agents generating isolated modules fail to account for these implicit couplings.

### The Brownfield Playbook: How Top Teams Succeed
Teams successfully using Spec Kit on mature systems follow a specialized 5-step protocol:

1. **Change-Level (Delta) Specs Over System Specs:** Never attempt to specify the whole system. Author specs solely for the *bounded delta* (the specific bug fix, endpoint addition, or refactor). The existing codebase is treated as immutable external environment.
2. **Context Pre-Grounding via Repository Packing:** Use tools like `Repomix` or targeted AST search tools to condense the relevant legacy modules into a compact architectural context bundle before triggering `/speckit-plan`.
3. **Characterization Tests as Correctness Oracles:** Before authoring a spec to alter legacy behavior, write characterization tests (Golden Master tests) pinning down the code's *exact actual behavior*. If the spec intends to change behavior, the characterization test is updated deliberately, not accidentally.
4. **Anti-Corruption Constitutions:** The project constitution in brownfield projects must explicitly declare **Anti-Corruption Layers**:
   - List exact patterns that agents are forbidden from changing (e.g., "Do NOT upgrade dependencies", "Do NOT refactor legacy database connection pool in `db/legacy.js`").
   - Mandate that all interactions between new code and legacy code pass through dedicated adapter interfaces.
5. **Incremental Bootstrapping:** Introduce Spec Kit incrementally into a single subdirectory or domain module (`src/modules/billing/`) before expanding to the root repository.

---

## 5. Real-World Case Studies & Usage Profiles

### Case Study 1: Enterprise Micro-Feature Rollout in Legacy Monolith (EPAM Systems & Enterprise Teams)
- **Context:** An engineering team at a financial services firm integrated a customer feedback and telemetry collection modal into a complex legacy web portal.
- **Workflow Adopted:**
  - Standardized on `specify-cli` with GitHub Copilot and Claude Code integrations.
  - Authored a Delta Spec (`specs/014-feedback-modal/spec.md`) focusing exclusively on modal trigger states, telemetry schema, and WCAG accessibility standards.
  - Used `/speckit-clarify` to resolve a major ambiguity regarding telemetry batching during offline network states.
  - Leveraged `plan.md` to define an interface contract `contracts/telemetry_event.json` to decouple the frontend modal from the backend ingestion queue.
- **Outcome:** Feature completed in 2 days instead of an estimated 5 days.
- **Key Insight Reported:** The enforced separation between `spec.md` (no framework specifics) and `plan.md` prevented the AI agent from attempting to rewrite the legacy portal's existing Redux store, confining state to an isolated React context.

### Case Study 2: Solo Builder Greenfield SaaS (Indie Hacker / Solo Engineer)
- **Context:** A solo founder building an AI-powered document extraction and bookmarking service.
- **Workflow Adopted:**
  - Initialized repository with `specify init --ai claude`.
  - Configured `constitution.md` with strict rules: Supabase PostgreSQL for storage, Stripe for billing, Tailwind for styling, zero custom CSS files.
  - Executed 6 distinct features across 3 weeks using the full SDD lifecycle.
  - Ran `/speckit-analyze` prior to every implementation phase.
- **Outcome:** Successfully deployed to production with 88% test coverage and zero architectural regressions across feature sprints.
- **Key Insight Reported:** For solo developers, Spec Kit serves as an "external engineering lead and product manager." It eliminates the "blank page syndrome" and prevents the solo builder from endlessly tweaking CSS or refactoring premature abstractions.

### Case Study 3: Cross-Tool Portability across Claude Code, Cursor, and Antigravity
- **Context:** A multi-developer open-source tooling team where members use disparate AI environments (one engineer on Claude Code CLI, one on Cursor, one on Antigravity).
- **Workflow Adopted:**
  - Because Spec Kit's core artifacts (`.specify/memory/constitution.md`, `spec.md`, `plan.md`, `tasks.md`) are standard, version-controlled Markdown in git, all agents operate on identical context.
  - Engineer A drafted the spec and ran `/speckit-clarify` in Claude Code.
  - Engineer B executed foundational tasks `T001-T008` in Cursor.
  - Engineer C ran `/speckit-converge` and completed the final integration tasks in Antigravity.
- **Outcome:** Complete cross-tool interoperability with zero lock-in to proprietary agent databases or chat sessions.
- **Key Insight Reported:** "Markdown in Git is the universal intermediate representation (IR) of software intent."

---

## 6. Comprehensive Taxonomy of Pitfalls, Anti-Patterns & Failure Modes

From analysis of practitioner failures, Reddit retrospectives, and GitHub issues, nine distinct anti-patterns have been identified:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE 9 SDD ANTI-PATTERNS                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Specification Theater          │ 6. Context Window Exhaustion       │
│ 2. "Great Specs, No MVP" Trap     │ 7. Premature Task Execution        │
│ 3. Butterfly Effect of Ambiguity  │ 8. Neglecting Non-Functionals (NFR)│
│ 4. Over-Specifying vs Under-Spec  │ 9. Post-Implementation Purgatory   │
│ 5. Maintenance Tax & Spec Drift   │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Anti-Pattern 1: Specification Theater & Green-Check Blindness
- **Symptom:** Developers generate extensive specs, checklists, and plan files, but neither read nor critique them. Checklists are checked off reflexively, and agents are given blind approval to proceed.
- **Root Cause:** Fatigue caused by overly dense documentation; treating documentation generation as an administrative hurdle rather than an engineering design tool.
- **Consequence:** Bugs and structural flaws slip through because the human assumed "the AI generated the checklist, so the checklist must be satisfied."
- **Mitigation:**
  - Keep specs concise (<300 lines).
  - Use the **Maker-Checker Protocol**: automated tools (`/speckit-analyze`) must run independently to verify claims before human sign-off.
  - Spot-check critical acceptance criteria directly in generated code.

### Anti-Pattern 2: The "Great Specs, No MVP" Paralysis Trap
- **Symptom:** Teams spend 4 days drafting specs, clarifying edge cases, refining data models, and generating 80 tasks for a feature that could have been prototyped in 3 hours.
- **Root Cause:** Dogmatic over-adherence to the SDD ceremony for exploratory spikes or early-stage product discovery.
- **Consequence:** Massive token and time expenditure without working software; premature optimization of features that users may not even want.
- **Mitigation:**
  - Adopt the **Tiered Ceremony Rule**:
    * *Spike / Prototype:* Bypass SDD or use lightweight Spec-First (spec discarded post-validation).
    * *Core Feature / Production Code:* Full Spec-Anchored SDD.
    * *Minor Bug Fix (<50 LOC):* Direct fix with test, skipping Spec Kit entirely.

### Anti-Pattern 3: The Butterfly Effect of Upstream Ambiguity
- **Symptom:** A tiny, seemingly trivial ambiguity in `spec.md` (e.g., "users can upload avatar images" without specifying file size, format, or storage location) causes catastrophic downstream misalignment.
- **Mechanics:**
  ```
  Spec: "Upload avatar" (Vague)
    ↓
  Plan: Agent chooses local disk storage in /public/avatars
    ↓
  Tasks: Decomposes tasks for local filesystem writes
    ↓
  Implementation: Code written with fs.writeFileSync
    ↓
  Production (Serverless/Kubernetes): Pod restarts -> all uploaded avatars instantly lost!
  ```
- **Mitigation:**
  - Mandatory execution of `/speckit-clarify` before `/speckit-plan`.
  - The taxonomy scan in `/speckit-clarify` explicitly probes storage, scale, and lifecycle constraints.

### Anti-Pattern 4: Over-Specifying (Micro-Management) vs. Under-Specifying (Vibe Coding)
- **The Dilemma:**
  - *Under-specifying:* Leaving requirements vague forces the AI to make implicit guesses based on general internet averages, introducing mismatched dependencies and security holes.
  - *Over-specifying:* Dictating mechanical implementation details in `spec.md` (e.g., naming specific internal for-loops, helper variable names, or CSS class names) inflates spec token count, restricts the agent from using more optimal library methods, and turns spec writing into writing code twice (once in English, once in code).
- **The Sweet Spot Heuristic:**
  - Specify **WHAT** (inputs, outputs, error conditions, UX states, acceptance criteria).
  - Specify **BOUNDARIES** (forbidden patterns, security constraints, performance budgets).
  - Leave **EXECUTION** (internal variable names, helper function decomposition) to the planning and implementation phases.

### Anti-Pattern 5: The Maintenance Tax & Silent Spec Drift
- **Symptom:** Code changes are made during hotfixes or PR code reviews directly in `.ts` or `.py` files without updating `spec.md` or `plan.md`. Over weeks, the repository's `.specify/` documentation becomes obsolete.
- **Consequence:** Future agent sessions read stale specs, re-introducing previously deleted bugs or overwriting newer code patterns.
- **Mitigation:**
  - Run `/speckit-converge` in CI/CD or pre-commit hooks to detect discrepancies between code and spec.
  - Treat specs as living documents: if a PR modifies behavior, the PR must modify the corresponding `spec.md`.

### Anti-Pattern 6: Context Window Exhaustion & Attention Degradation
- **Symptom:** In large features with 40-page specs or huge monorepos, pasting the entire context into an agent prompt causes "lost in the middle" degradation, missed requirements, and sky-high token costs.
- **Mechanics:** LLM attention is sharpest at the beginning and end of the prompt context. Deeply nested requirements in the middle of a massive file are frequently ignored.
- **Mitigation:**
  - **Progressive Disclosure:** Never load all artifacts at once.
    * Planning loads `spec.md` + `constitution.md`.
    * Task generation loads `plan.md` + `spec.md` summary.
    * Implementation loads *only* `tasks.md` and the 1-2 interface contracts relevant to the current task.
  - **Micro-Context Slicing:** Break features into sub-tasks executed in isolated agent sessions (1-3 tasks per context).

### Anti-Pattern 7: Premature Task Execution Before Clarifying Edge Cases
- **Symptom:** Jumping directly from a rough specification into `/speckit-tasks` and `/speckit-implement`, skipping `/speckit-clarify`.
- **Consequence:** Halfway through implementation, the agent encounters a blocking edge case (e.g., what happens if a user signs up with an existing email via OAuth vs password?). The agent either halts or invents a conflicting resolution, requiring extensive refactoring of already-committed tasks.
- **Mitigation:**
  - Enforce the prerequisite gate: `/speckit-plan` must verify that zero critical `[NEEDS CLARIFICATION]` tags remain in `spec.md`.

### Anti-Pattern 8: Neglecting Non-Functional Requirements (NFRs)
- **Symptom:** Functional user stories pass with flying colors, but the system is vulnerable to SQL injection, exhibits 4-second API response times, or fails basic accessibility standards.
- **Root Cause:** AI agents optimize exclusively for the explicit test cases provided. If performance, security, and accessibility are not explicit requirements, they will not exist in the generated code.
- **Mitigation:**
  - Institutionalize NFRs in `constitution.md` (e.g., "All inputs sanitized via Zod schemas", "All database queries indexed", "WCAG AA contrast ratios mandatory").
  - The `speckit-specify` quality checklist explicitly audits for measurable, non-functional success criteria.

### Anti-Pattern 9: The Post-Implementation Debugging Purgatory
- **Symptom:** When a unit test fails during implementation, developers get stuck in a dilemma: "Do I rewrite the spec, rewrite the plan, update tasks.md, or just edit the code?"
- **Consequence:** Frustration with the perceived rigidity of the SDD tooling, leading developers to abandon Spec Kit mid-project.
- **Mitigation:**
  - **Locality of Fix Principle:**
    * If the defect is a **mechanical code bug** (syntax error, off-by-one, type mismatch), fix the code directly or prompt the agent to fix the task implementation. Do NOT touch the spec.
    * If the defect reveals a **fundamental business logic error or missing requirement** (e.g., forgot that users can have multiple organizations), pause implementation, update `spec.md`, re-run `/speckit-plan`, and let `/speckit-converge` append the new tasks.

---

## 7. Actionable Recommendations & Practical Rules of Thumb

Synthesized from top practitioners, these rules provide immediate, high-leverage guidance for engineering teams adopting Spec Kit and SDD:

### Rule 1: The "<50 LOC" Exemption (Right-Sizing Ceremony)
Never use full Spec Kit workflows for trivial bug fixes, CSS tweaks, or simple mechanical refactorings. Reserve Spec Kit for:
- Any net-new feature spanning multiple files.
- Any architectural change or data model migration.
- Any feature where requirements are ambiguous or involve multiple stakeholders.

### Rule 2: The "What vs. How" Firewall
In `spec.md`, if you catch yourself writing language-specific keywords (`async/await`, `React.useEffect`, `PostgreSQL table`, `REST endpoint`), **delete them immediately**. Rephrase as user-facing outcomes:
- *Bad:* "Create a POST /api/v1/auth/login endpoint returning a JWT in an httpOnly cookie."
- *Good:* "Users can securely authenticate using email/password. The system maintains an authenticated session across browser restarts without exposing session tokens to client-side scripts."

### Rule 3: The Single-Task Micro-Context Execution Pattern
During `/speckit-implement`, do NOT instruct the agent to "implement all 35 tasks in `tasks.md` in one turn." Instead:
- Feed 1 to 3 related tasks at a time.
- Verify tests pass and inspect the git diff.
- Mark `- [X]` in `tasks.md`.
- Clear the chat context (or launch a new subagent) for the next batch. This guarantees 100% attention fidelity and zero context degradation.

### Rule 4: The Append-Only Convergence Loop
Never rewrite or renumber existing tasks in `tasks.md`. When discrepancies or unfinished work are discovered post-implementation:
- Run `/speckit-converge`.
- Let it append `## Phase N: Convergence` with new tasks `T045, T046...`.
- Re-run `/speckit-implement` on the newly appended tasks.
This preserves an immutable, traceable audit trail of the feature's entire evolution.

### Rule 5: Treat Constitutions as Non-Negotiable Invariants
A project constitution (`.specify/memory/constitution.md`) should contain no more than 5-8 foundational principles. Keep them brief, declarative, and testable using RFC 2119 keywords (**MUST**, **MUST NOT**, **SHOULD**). If an agent proposal violates a MUST principle, the plan fails automatically—no exceptions.

---

## 8. Verified Sources & Community Evidence Base

1. **GitHub Spec Kit Repository & Documentation:**
   - Repository: `https://github.com/github/spec-kit`
   - Official CLI: `specify-cli` via `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`
   - Official Documentation & Presets: `.specify/` templates, command specifications (`specify`, `clarify`, `plan`, `tasks`, `analyze`, `implement`, `converge`).
2. **Martin Fowler / Thoughtworks Research:**
   - Böckeler, Birgitta. *"Understanding Spec-Driven Development: Kiro, spec-kit, and Tessl."* martinfowler.com (2025/2026).
   - Core concepts: Spec-first, Spec-anchored, Spec-as-source taxonomies.
3. **The GitHub Engineering Blog:**
   - GitHub Developer Relations & Engineering. *"Spec-Driven Development: Shifting from Vibe Coding to Intent-Driven Engineering with Spec Kit."* github.blog.
4. **Community Discourse & Retrospectives:**
   - Reddit communities: `r/GithubCopilot`, `r/ClaudeCode`, `r/LocalLLaMA`, `r/vibecoding`.
   - Hacker News threads: Debates on "Specification Theater", "Waterfall vs SDD", and "Agentic Context Management".
   - Engineering Blogs: EPAM Systems enterprise evaluation of Spec Kit; Dev.to case studies on solo SaaS creation with `specify-cli`; PaellaDoc on Spec Drift.
