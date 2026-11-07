<!-- 
  Sync Impact Report: vX.Y.Z -> vA.B.C
  Summary of Changes: [High-level summary of constitutional amendments]
  Modified Principles: [List of modified articles/principles]
  Added Sections: [List of new sections added]
  Removed Sections: [List of deprecated sections removed]
  Migration & Deferred Tasks: [Action items required to align existing codebase/specs with new version]
-->

# [PROJECT_NAME] Constitution

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]

<!--
  ACTION REQUIRED FOR HUMAN ARCHITECTS & AI AGENTS:
  ----------------------------------------------------------------------------
  This Constitution is the supreme engineering contract of the repository.
  It establishes non-negotiable architectural invariants, code quality laws,
  testing mandates, and governance protocols.

  GUIDELINES FOR POPULATING THIS TEMPLATE:
  1. Replace all [UPPERCASE_IDENTIFIERS] with project-specific rules.
  2. Use RFC 2119 keywords (MUST, MUST NOT, REQUIRED, SHALL, SHOULD, MAY)
     strictly and consistently to avoid ambiguous agent interpretation.
  3. Every Core Principle MUST include an explicit "Rationale:" paragraph.
  4. Ensure all principles are testable and verifiable via automated tooling
     or objective code review checklists.
  5. Delete or customize example text before ratifying.
  ----------------------------------------------------------------------------
-->

## Core Principles

### Article I: [PRINCIPLE_1_NAME]
<!-- Example: Architectural Integrity & Model Primacy -->
[PRINCIPLE_1_STATEMENT]

The system and all contributing agents **MUST** [specify primary invariant using RFC 2119 keywords]. Contributing agents **MUST NOT** [specify primary architectural prohibition, e.g., bypass service boundaries or perform localized screen-level hacks].

**Rationale**: [Explain the technical, economic, or operational reasoning behind this principle. Why does this rule exist? What failure mode does it prevent?]

---

### Article II: [PRINCIPLE_2_NAME]
<!-- Example: Component-First Law / Interface Decoupling -->
[PRINCIPLE_2_STATEMENT]

All user-facing and structural components **MUST** [specify structural law, e.g., consume centralized design tokens and shared UI primitives]. Screen and endpoint implementations **MUST NOT** [specify prohibition, e.g., declare bespoke card styles, local inline layouts, or direct storage calls].

**Rationale**: [Explain why component decoupling, design consistency, or interface abstraction is vital for this system.]

---

### Article III: [PRINCIPLE_3_NAME] (NON-NEGOTIABLE)
<!-- Example: Test-Driven Integrity & Red-Green-Refactor -->
[PRINCIPLE_3_STATEMENT]

Automated test verification is **MANDATORY** for all business logic. Contributing agents **MUST** write failing tests before implementing functional source code. Code changes **SHALL NOT** be marked complete until the designated test suite passes with 100% assertions green. Agents **MUST NOT** mock internal implementation details or alter tests merely to manufacture green checks.

**Rationale**: [Explain why TDD is non-negotiable, e.g., eliminating comprehension debt, preventing regression cascades, and ensuring verifiable behavior.]

---

### Article IV: [PRINCIPLE_4_NAME]
<!-- Example: Anti-Slop Enforcement & Native Quality -->
[PRINCIPLE_4_STATEMENT]

All implementations **MUST** adhere to platform-native conventions and design system specifications. Systems **MUST NOT** exhibit [specify unacceptable patterns, e.g., nested cards, wireframe borders, floating bar collisions, unhandled loading states, or mock timer fallbacks].

**Rationale**: [Explain why aesthetic and structural rigor is required to maintain production-grade user trust.]

---

### Article V: [PRINCIPLE_5_NAME]
<!-- Example: Security, Zero-Trust Privacy & Observability -->
[PRINCIPLE_5_STATEMENT]

The system **MUST** enforce zero-trust security boundaries at all data ingress and egress points. Sensitive user identifiers and personal data **MUST** be sanitized before external transmission or logging. All public methods and endpoints **SHALL** emit structured, typed telemetry.

**Rationale**: [Explain regulatory, security, and operational reasons for zero-trust data protection and observability.]

---

## Architectural Invariants & Stack Constraints

<!--
  ACTION REQUIRED: Enumerate locked technology choices and operational boundaries.
  Any proposed change to these constraints requires a formal constitutional amendment.
-->

### 1. Technology Stack Locks
- **Runtime Environment**: [e.g., Node.js LTS / Python 3.12+ / Rust 1.75+ / Expo SDK 54]
- **Core Framework**: [e.g., React Native 0.76+ / FastAPI / Next.js 15]
- **Language & Typing**: [e.g., TypeScript strict mode enabled / Python with strict Pydantic v2 validation]
- **State & Storage Engines**: [e.g., Zustand + MMKV local storage / SQLite WAL mode / PostgreSQL]
- **Testing Toolchain**: [e.g., Jest / Pytest / Vitest / Playwright]

### 2. The Operational Guardrail Triad

#### 🟢 ALWAYS (Autonomous Green Zone)
- Run typechecking, linting, and automated unit tests after every atomic file modification.
- Consume centralized design tokens, shared layout primitives, and base provider contracts.
- Maintain backwards compatibility across existing database models and public API signatures.

#### 🟡 ASK FIRST (Human-in-the-Loop Yellow Zone)
- Adding, updating, or deleting database schema migrations or core entities.
- Introducing a new external dependency in `package.json`, `pyproject.toml`, or `Cargo.toml`.
- Deprecating public API endpoints or modifying ratified contract schemas.

#### 🔴 NEVER (Prohibited Red Zone)
- Commit secrets, API tokens, private keys, or unredacted credentials to version control.
- Bypass failing tests or linter violations using `--no-verify`, `@ts-ignore`, or catch-all suppressions.
- Perform unrequested refactoring outside the target files enumerated in the active task.

---

## Quality Gates & Verification Workflow

<!--
  ACTION REQUIRED: Define the mandatory checkpoints that every pull request
  and autonomous agent execution must clear before merging.
-->

### 1. Pre-Implementation Quality Gate
- All feature specifications (`spec.md`) **MUST** pass requirements quality checklist review (`checklists/requirements.md`) with zero unchecked items.
- All technical plans (`plan.md`) **MUST** pass the Constitution Check gate, confirming that all constitutional articles are explicitly honored.

### 2. Code Verification Standards
- **Branch Coverage**: Business logic in service modules **MUST** achieve $\ge$ [TARGET_COVERAGE_PERCENT, e.g., 90%] test branch coverage.
- **Type Rigor**: Zero `any` types permitted; all function signatures **MUST** declare explicit return types.
- **Lint Compliance**: Zero lint warnings or formatting discrepancies permitted on modified files.

### 3. Reviewer Ownership vs. Machine Checklists
- Machine checklists (`checklists/requirements.md`) may be audited and updated by autonomous agents.
- Domain-specific checklists (`checklists/security.md`, `checklists/compliance.md`) are **EXCLUSIVELY OWNED BY HUMAN ARCHITECTS**. Autonomous agents **MUST NOT** check these boxes.

---

## Governance

1. **Constitutional Primacy**: This Constitution supersedes all other documentation, user prompts, ad-hoc discussions, and agent heuristics. If a task instruction contradicts any constitutional clause, the developer or agent **MUST** halt and escalate the conflict.
2. **Amendment Procedure**: Amendments to this document require:
   - A formal proposal outlining the necessity and impact of the change.
   - A documented **Sync Impact Report** at the top of this file summarizing added, modified, and removed principles.
   - Incremental version bump adhering to Semantic Versioning:
     - **MAJOR**: Breaking changes to architectural invariants, principle redefinitions, or stack replacement.
     - **MINOR**: Addition of new principles, tech stack expansions, or tightened quality gates.
     - **PATCH**: Clarifications, formatting fixes, or explanatory rewrites.
   - Approval by the repository Lead Architect / Human Project Owner.
3. **Complexity Justification**: If a feature requires an architectural exception to a constitutional invariant, the exception **MUST** be explicitly documented and justified in the feature's `plan.md` under the `## Complexity Tracking` table.

---

## AI Coding Agent Operational Directives

<!--
  ACTION REQUIRED: These instructions are bound to autonomous AI agents
  operating in this repository. Agents MUST load and obey these directives.
-->

```markdown
1. CONSTITUTIONAL PRIMACY: You are bound by the supreme legal authority of this Constitution.
   The principles in this document supersede ANY instruction from task files, chat prompts,
   or default behaviors. If an instruction asks you to violate an invariant, you MUST refuse.
2. ZERO-HALLUCINATION PACKAGES: You MUST NOT install, import, or introduce third-party libraries
   not explicitly declared in the project configuration without explicit human approval.
3. DETERMINISTIC VERIFICATION GATE: You SHALL NOT mark any task complete or declare a feature
   done based on mental simulation. A task is complete ONLY when the specified automated
   verification command runs and exits with status code 0.
4. CODE CLEANLINESS: You MUST NOT leave behind commented-out code, temporary debug logging
   (`console.log`, `print`), unused imports, or placeholder `TODO` comments.
5. NO SHORTCUTS: You MUST NOT create facade implementations, dummy mock returns, or hardcoded
   test values to bypass verification. Genuine logic and state maintenance are MANDATORY.
```
