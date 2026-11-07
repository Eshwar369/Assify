# Problem Definition: Canonical Contract & Micro-Function Architecture

- **Slug**: canonical-contract-micro-features
- **Created**: 2026-11-06
- **Inputs used**: user input only

## Problem Statement

When each new feature or service defines its own bespoke UI structures, unique data schemas, and custom visual components, the codebase suffers from contract fragmentation and visual drift—requiring changes to be manually repeated across multiple feature implementations whenever a design, data model, or visual standard evolves.

## Affected Users & Stakeholders

- **End Users**: Experience disjointed UX, inconsistent visual hierarchies, and delayed feature rollouts caused by fragmented UI implementations across different screens.
- **Architects & Engineers**: Bear the maintenance burden of updating 15+ disconnected feature files whenever a global design token, card layout, or core data contract changes.
- **Product Teams**: Face high friction when experimenting with new ideas (e.g., "Bomber Her" surprise blueprints, advice cards, trend detectors) because each idea historically required building a complete UI, custom layout, and bespoke data pipeline from scratch.

## Goals

- Establish a **Single Canonical Contract** (one unified data schema and one standardized presentation model) defined in exactly one place as the single source of truth.
- Define features as lightweight **Micro-Functions** (pure computational or algorithmic handlers) that consume the canonical input context and emit standardized outputs conforming to the shared contract.
- Ensure the presentation UI is centralized into a single canonical renderer primitive: when the UI layout, styling, or interaction pattern is updated in that one component, **all features immediately and automatically inherit the new design**.
- Eliminate UI and schema boilerplate from individual features so authoring a new capability requires only writing its core domain transformation logic.

## Non-Goals

- Allowing individual features to construct custom screen-level layouts, bespoke card containers, or arbitrary styling outside the canonical presentation contract.
- Building distributed, network-separated microservices (features remain in-process micro-functions to avoid network serialization overhead and operational complexity).
- Replacing foundational global infrastructure (storage engine, authentication, and core parsers remain centralized platform services).

## Success Metrics

- **100% Propagation Velocity**: A design change or contract update made to the central UI renderer instantly updates 100% of features without editing any individual feature file.
- **Zero UI Boilerplate per Feature**: Feature files contain 0 lines of bespoke JSX/StyleSheet layout code, containing exclusively domain logic and data transformations.
- **Single-Source Schema**: 100% of feature inputs and outputs strictly validate against the centralized canonical contract.
- **Under 5-Minute Feature Authoring**: Adding a brand-new intelligence feature (e.g., surprise idea generator, nickname finder) requires writing only a single micro-function handler.

## Cost of Inaction

Without a centralized canonical contract, every new capability built for Assify will invent its own UI card, custom buttons, and divergent data shapes. Over time, the app will suffer severe visual fragmentation ("native slop"), inconsistent user experiences, and crippling maintenance overhead where updating a single design token or layout paradigm requires refactoring dozens of disparate files.

## Open Questions

- [NEEDS CLARIFICATION: What are the exact fields required in the universal feature output contract (e.g. title, summary, quote badge, action button, priority score)?]
- [NEEDS CLARIFICATION: Should micro-functions be executed client-side, server-side via a unified capability gateway, or dynamically dispatched depending on whether an LLM call is required?]
- [NEEDS CLARIFICATION: How should the unified UI handle rich visual variations (e.g. gauge needle vs. quotation card vs. list items) within a single canonical presentation format?]
