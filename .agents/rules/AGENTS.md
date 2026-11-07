# Assify — Agent Rules (Always-On)

These rules are enforced on **every conversation turn** without exception.
They are derived from the [Assify Constitution](.specify/memory/constitution.md) and are binding for all agents, automated workflows, and human contributors.

---

## RULE 1 — Architectural Integrity & Model Primacy (Zero Shortcuts)

The architectural integrity and long-term health of the codebase are non-negotiable.

- NEVER apply screen-specific band-aids or superficial patches when the data model, domain entity, or service contract is the root cause.
- If an abstraction leaks or a model is ill-fitting, evolve the model itself — never paper over it.
- The proper solution is ALWAYS required, even when it is 100× harder. No shortcuts are permitted.

---

## RULE 2 — Component-First Law (Zero Screen-Level Container Drift)

**Components import tokens. Screens import components. This is absolute.**

- Screens (`app/(tabs)/*`) MUST NOT declare bespoke cards, containers, metric boxes, or segmented controls in local `StyleSheet` blocks.
- Any visual primitive shared across two or more screens MUST be extracted into `mobile/src/components/ui/` (e.g., `StatStrip`, `SegmentedControl`, `EditorialSection`, `ReceiptQuote`).
- When a design token or structural rule changes, update the centralized primitive — never patch one screen in isolation while leaving others inconsistent.

---

## RULE 3 — Anti-Slop Enforcement (No Native Slop)

Strictly avoid these mobile anti-patterns on every UI change:

- **No "Everything's a Card":** Do NOT wrap every list row in its own elevated card or nest cards inside cards. Use background elevation, grouped table insets, and hairlines.
- **No Floating Pill Collisions:** Tab bars and bottom sheets must never truncate labels, collide with home indicators, or obscure scrollable content. Always respect safe-area insets.
- **No Wireframe Borders:** Avoid repetitive 1px neutral borders around elements. Use spatial grouping, background contrast, and native separators instead.

---

## RULE 4 — Mandatory Skill-First Protocol

Before writing any code, check the `.agents/skills/` catalog. Using the wrong workflow or skipping a skill is an architectural failure.

- **UI changes** → read `expo-design-system`, `apple-design`, `emil-design-eng` first.
- **Animations / gestures** → read `animate-expo`, `animation-performance` first.
- **API / contract changes** → read `api-and-interface-design` first.
- **Bug fixes / business logic** → follow `test-driven-development` and `systematic-debugging`.
- **Pre-merge / code review** → run through `code-review-and-quality` and `verification-before-completion`.

---

## RULE 5 — Test-Driven Development & Evidence Before Completion

Quality gates are MANDATORY before any implementation is called complete.

- Follow Red-Green-Refactor: write a failing test first → prove it fails → implement the minimal passing solution → refactor.
- Run all test suites, typechecks, and linters and show passing output BEFORE claiming anything is done.
- "I think it works" is not evidence. Actual passing command output is the only valid evidence.

---

## RULE 6 — Privacy-First Local Forensics (Biometric Sanctuary)

Assify handles sensitive personal WhatsApp exports. These rules are non-negotiable:

- ALL forensic parsing, telemetry extraction, and score computations MUST run locally on-device with ZERO cloud leakage of message content.
- Biometric gates (FaceID / PIN / TouchID) MUST guard both direct app entry and OS Share Sheet processing when enabled.
- Hard-wipe / purge commands MUST permanently remove local records instantly — no soft-deletes, no deferred cleanup.

---

## RULE 7 — Core Coding Philosophies (KISS · DRY · YAGNI · Separation of Concerns)

Apply these on every line of code written:

- **KISS:** Write the simplest code that fulfills the requirement. No clever tricks. No premature optimizations. Clear naming always.
- **DRY:** Consolidate duplicate logic into reusable functions or modules. One source of truth. Refactor repeated patterns into shared utilities.
- **YAGNI:** Implement only what is concretely needed right now. No speculative features. No future-proofing that hasn't been asked for.
- **Separation of Concerns:** UI, business logic, and data access live in distinct layers. Each layer has one responsibility. Layers communicate via well-defined interfaces or props only.

---

## RULE 8 — SOLID Principles

Apply to every class, module, hook, and service:

- **SRP (Single Responsibility):** One class / module = one reason to change. Encapsulate a single piece of functionality.
- **OCP (Open/Closed):** Extend behavior via abstractions or subclassing. NEVER modify stable existing code to add a feature.
- **LSP (Liskov Substitution):** Subtypes must work wherever their base type is expected. Overrides must honor the base contract.
- **ISP (Interface Segregation):** Prefer many small, client-specific interfaces. Clients must NOT be forced to depend on methods they don't use.
- **DIP (Dependency Inversion):** High-level modules depend on abstractions, never on concrete implementations. Inject dependencies at runtime.

---

## RULE 9 — Architecture & System Rules

- Maintain **loose coupling** and **high cohesion** across all modules and services.
- Obey the **Law of Demeter**: a unit should only talk to its immediate collaborators — no train-wreck chains (`a.b.c.d()`).
- Follow **Twelve-Factor App** principles for config (env vars, not hardcoded), processes (stateless), and service boundaries.

---

## RULE 10 — Process & CI Practices

- Every feature begins with a spec (`/speckit-specify`) before any code is written.
- Run continuous integration on every push. Maintain a testing pyramid: unit → integration → end-to-end.
- Include a code-review checklist that verifies ALL rules above before merging.
- Lint rules (`eslint`, `detekt`) MUST map to these principles. The CI job `principles.yml` will fail the PR on any violation.

---

## Enforcement Summary

| Violation | Action |
|-----------|--------|
| Screen-level container drift | Block merge, refactor to shared component |
| Native slop pattern detected | Block merge, redesign |
| Skipped skill protocol | Restart task using correct skill |
| Test skipped / no evidence | Block completion claim |
| Cloud leakage of message data | Critical — block immediately, escalate |
| Duplicate logic / SOLID violation | Refactor before merge |

**These rules supersede any agent default behavior. When in doubt, choose the architecturally sound path — always.**
