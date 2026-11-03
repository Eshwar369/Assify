<!--
Sync Impact Report
- Version change: Initial Draft → v1.0.0
- Modified principles: None (initial ratification)
- Added sections: Core Principles (I through VI), Architecture & Design Constraints, Quality & Verification Workflow, Governance
- Removed sections: None
- Follow-up TODOs: None
-->

# Assify Constitution

## Core Principles

### I. Architectural Integrity & Model Primacy (Zero Shortcuts)
The architectural integrity and long-term health of the codebase are non-negotiable, even when the proper solution is substantially harder or more complex. Under no circumstances should an engineer or agent apply localized, screen-specific band-aids or superficial patches when a foundational data model, domain entity, or service contract requires systematic refactoring. If an abstraction leaks or a model is ill-fitting, the model itself must be evolved cleanly.

### II. Component-First Law (Zero Screen-Level Container Drift)
Per the design system standard: **Components import tokens; screens import components.**
Screens (such as routes in `app/(tabs)/*`) MUST NOT declare bespoke cards, containers, metric boxes, or segmented controls in local `StyleSheet` definitions. Any visual primitive or structural layout shared across screens must be centralized in `mobile/src/components/ui/` (e.g., `StatStrip`, `SegmentedControl`, `EditorialSection`, `ReceiptQuote`). When design tokens or structural rules change, they must be updated in the centralized primitive so all screens inherit the changes uniformly.

### III. Anti-Slop Enforcement
The application must strictly avoid mobile anti-patterns and generic AI aesthetic tells ("native slop"):
- **No "Everything's a Card":** Do not enclose every list row or element in its own elevated card. Group related items using background elevation, grouped table insets, and hairlines.
- **No Floating Pill Collisions:** Tab bars and bottom sheets must never truncate labels, collide with home indicators, or obscure scrollable content. Respect safe-area insets at all times.
- **No Wireframe Borders:** Avoid repetitive 1px neutral borders around elements. Rely on deliberate spatial grouping, background contrast, and native separators.

### IV. Mandatory Skill-First Protocol
All automated agents and contributors must strictly adhere to the installed skill catalog in `.agents/skills/`. Bypassing, ignoring, or taking shortcuts around specialized skills is prohibited:
- UI development must adhere to `expo-design-system`, `apple-design`, and `emil-design-eng`.
- Gestures and animations must follow `animate-expo` and `animation-performance`.
- API and contract changes must follow `api-and-interface-design`.
- Bug fixes and business logic must follow `test-driven-development` and `systematic-debugging`.
- Merges and code reviews must pass through `code-review-and-quality` and `verification-before-completion`.

### V. Test-Driven Development (TDD) & Evidence Before Completion
Quality gates are enforced prior to code authoring:
- Features and bug fixes must follow the Red-Green-Refactor cycle: write failing tests first, prove they fail as expected, implement the minimal passing solution, and refactor.
- Verification is mandatory: all test suites, typechecks, and linters must run with passing output before claiming work is complete. Evidence before assertions always.

### VI. Privacy-First Local Forensics & Biometric Sanctuary
Assify handles sensitive, personal conversational exports (WhatsApp `.txt`/`.zip` files). 
- All forensic parsing, telemetry extraction, and score computations must run deterministically and locally on the device with zero cloud telemetry leakage of message contents.
- Biometric gates (FaceID/PIN/TouchID) must guard both direct app entry and OS Share Sheet processing when enabled.
- Hard wipe / purge commands must permanently remove local records instantly.

## Architecture & Design Constraints

1. **Deterministic Parsing & Analysis:** WhatsApp chat exports must be ingested via a robust, streaming parser that validates 1-on-1 participant boundaries, minimum volume thresholds (≥30 messages), and ignores non-conversational system notices.
2. **Design Tokens & Visual Language:** Deep Obsidian and Midnight Plum theme palettes with tactile Apple HIG haptics, spring physics, and high-impact 9:16 exportable story cards.
3. **Cross-Platform Parity:** Fully compatible with iOS and Android via Expo, honoring native navigation paradigms and safe-area insets.

## Development Workflow & Quality Gates

1. **Specification:** Every feature begins with an explicit spec created via `/speckit-specify`.
2. **Planning & Clarification:** Architectural planning (`/speckit-plan`) and ambiguity clarification (`/speckit-clarify`) precede task breakdown.
3. **Dependency-Ordered Tasks:** Actionable implementation steps are generated with `/speckit-tasks`.
4. **Execution & Convergence:** Implementation runs through `/speckit-implement`, followed by `/speckit-converge` and `/speckit-analyze` to ensure strict artifact consistency.

## Governance

- This Constitution serves as the supreme operational policy for Assify. All pull requests, code reviews, and automated agent workflows must verify compliance against these principles.
- Amendments to this Constitution require explicit documentation, version bumping, and migration planning.
- Versioning follows semantic rules: MAJOR for principle removals or structural redefinitions; MINOR for new principles or sections; PATCH for wording refinements.

**Version**: 1.0.0 | **Ratified**: 2026-11-04 | **Last Amended**: 2026-11-04
