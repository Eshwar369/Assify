# Handoff Report: SDD Industry Patterns, Anti-Patterns & AI Prompt Engineering Guidance

**Author**: explorer_survey_3  
**Working Directory**: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\`  
**Target Recipient**: orchestrator_2 (Conversation ID: `898607cd-2905-4a6e-af79-531d6b976d98`)  
**Artifact Generated**: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\survey_report.md`  

---

## 1. Observation

1. **Dispatch Directives (`DISPATCH.md:8-14`)**:
   - Objective: Investigate online practitioner discussions, engineering blogs, GitHub Next research, and community post-mortems regarding Spec-Driven Development (SDD) and GitHub Spec Kit.
   - Extract:
     1. Best structural patterns and phrasing that prevent AI hallucination, context drift, and scope creep.
     2. Common pitfalls, anti-patterns, and failure modes when writing SDD templates and task lists.
     3. How successful teams format user stories, edge cases, acceptance criteria, and non-negotiable architectural mandates so that coding agents follow them faithfully.
2. **Existing Workspace Baseline (`docs/spec_kit_research_report.md:76-100, 341-370, 550-650`)**:
   - The workspace already established a baseline research report on the breakdown of "vibe coding", the 3 tiers of SDD adoption (Fowler & Böckeler), the ~18.6k token "context tax", and high-level anti-patterns.
3. **Web Search Findings on Practitioner Engineering Patterns**:
   - *Prompt Engineering to Agentic Engineering (Addy Osmani, 2025–2026)*: The shift from one-off chatbot prompt tricks to "agentic systems" using persistent specification files, the "Always / Ask First / Never" triad, and autonomous execution loops with verification gates.
   - *RFC 2119 Normative Grounding in Agent Prompts*: Capitalized keywords (`MUST`, `MUST NOT`, `SHALL`, `SHOULD`, `MAY`) alter transformer attention weights and decision boundaries, transforming soft conversational suggestions into enforceable operational invariants.
   - *Given-When-Then Acceptance Criteria*: Industry best practice is formatting acceptance criteria with explicit state pre-conditions (`Given`), deterministic actions (`When`), observable outcomes (`Then`), numbered IDs (`AC-###`), and explicit `Evidence Check:` commands linking directly to automated unit test files.
   - *Cognitive Traps in AI Engineering (Wharton & Storey)*: "Cognitive Surrender" (Shaw & Nave) and "Comprehension Debt" (Osmani & Storey) cause human reviewers to succumb to "green-check blindness" and review fatigue when faced with hundreds of lines of AI-generated diffs.
   - *Task Decomposition Anti-Patterns (arXiv & Practitioner Post-Mortems)*: Six core failure modes identified in task lists: (1) The Monolithic Trap (under-decomposition), (2) Micro-Management Keystroke Trap (over-decomposition), (3) Static Plan Rigidity ("Waterfall" execution without adaptive re-decomposition), (4) The Flat-List Fallacy (ignoring `depends_on`), (5) Context-Blind Planning, and (6) The Echo-Chamber Multi-Agent Committee.
4. **Survey Report Deliverable**:
   - Authored full report at `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\survey_report.md` (8 chapters, ~21,000 characters).

---

## 2. Logic Chain

1. **Step 1 (Observation 1 $\rightarrow$ 3)**: Vague, conversational prompting fails because LLMs operate probabilistically. Without explicit boundary conditions and normative weights, models hallucinate missing APIs, drop constraints mid-conversation ("Lost in the Middle"), and introduce unrequested refactorings.
2. **Step 2 (Observation 3)**: Employing RFC 2119 keywords (`MUST`, `MUST NOT`) paired with the "Always / Ask First / Never" triad creates strict decision boundaries that AI coding agents follow deterministically, preventing scope creep and unauthorized changes.
3. **Step 3 (Observation 3)**: Acceptance criteria formatted as Given-When-Then scenarios with explicit `Evidence Check:` lines eliminate qualitative ambiguity (e.g. replacing "handles errors gracefully" with "returns HTTP 422 with `{ error: 'INVALID_TOKEN' }` and passes `tests/auth/expiry.test.ts`").
4. **Step 4 (Observation 3 & 4)**: The failure of naive human-in-the-loop review ("green-check blindness") necessitates structural friction gates: "Explain It Back" architectural checkpoints, Maker-Checker segregation (independent test generation), and single-task micro-context execution.
5. **Step 5 (Observation 3 & 4)**: Task decomposition requires the "1-File / 1-Test Rule" and "Executable Leaf Nodes" arranged in a 4-tier dependency order (Contracts $\rightarrow$ Domain Services $\rightarrow$ UI Primitives $\rightarrow$ Integration), coupled with TDD Red-Green-Refactor cycles and an append-only convergence loop for discovered work.
6. **Step 6 (Synthesis)**: These structural patterns and prompt directives directly solve the pitfalls documented across industry case studies and provide an actionable blueprint for authoring both generic and project-specific SDD templates.

---

## 3. Caveats

1. **LLM Model Variance**: While frontier reasoning models (e.g., Claude 3.5 Sonnet, Claude 3.7 Sonnet, GPT-4o, Gemini 1.5 Pro) adhere rigorously to RFC 2119 keywords and Given-When-Then structures, smaller or quantized local models may require more explicit few-shot prompt examples.
2. **Tooling Integration**: GitHub Spec Kit slash commands (`/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) depend on the specific editor agent harness (e.g., Claude Code, Cursor, Copilot CLI) to read `.specify/` configuration and execute terminal commands.
3. **Brownfield Monolith Limitations**: For legacy brownfield repositories lacking existing unit tests, the TDD coupling pattern requires an initial "zero-state test harness" task before feature development can begin.

---

## 4. Conclusion

The investigation confirms that successful Spec-Driven Development is not merely about writing markdown documentation; it is an **executable systems engineering discipline**. 

To maximize agent compliance, prevent context drift, and eliminate comprehension debt, the SDD templates must enforce:
1. **The "What vs. How" Firewall**: Pure behavioral specifications in `spec.md`; architectural blueprints in `plan.md`.
2. **Given-When-Then Acceptance Contracts**: Numbered `[AC-###]` blocks with explicit `Evidence Check:` test links.
3. **Four-Quadrant Edge Case Matrices**: Bounded limits, network/service failures, concurrency/race conditions, and security denials.
4. **Executable Leaf Task Nodes**: 1-File / 1-Test scope, explicit `depends_on`, terminal verification commands exiting with status code 0.
5. **Constitutional Invariants**: RFC 2119 keywords, the "Always / Ask First / Never" triad, and zero-tolerance for local screen container drift (`native-slop.md` compliance).

The complete survey report with detailed schemas, anti-pattern catalogs, and prompt directives is available in `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\survey_report.md`.

---

## 5. Verification Method

To independently verify the findings and artifacts of this survey:
1. **File Existence and Integrity Check**:
   ```powershell
   Get-Item "c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\survey_report.md"
   ```
2. **Inspect Core Chapters**:
   - View Chapter 1 for RFC 2119 keyword tables and the "Always / Ask First / Never" triad.
   - View Chapter 2 for Given-When-Then templates and the Four-Quadrant Edge Case Matrix.
   - View Chapter 3 for the 10 Anti-Patterns and engineering remedies.
   - View Chapter 5 for the Anatomy of a Task Item and 4-tier dependency pipeline.
   - View Chapter 6 for verbatim AI Agent Prompt Directives for `constitution.md`, `spec.md`, `plan.md`, and `tasks.md`.
3. **Invalidation Conditions**:
   - The report would be invalidated if empirical agent benchmarks demonstrated that open-ended chat prompts outperformed structured Given-When-Then contracts in preventing code regressions, or if RFC 2119 keywords had no measurable impact on agent compliance.

