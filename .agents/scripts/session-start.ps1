$message = @"
=============================================================
   ASSIFY - SESSION START
   Assify Constitution v1.0.0 is ACTIVE
=============================================================

You are working on ASSIFY - a privacy-first WhatsApp analytics app.
The following 10 rules are MANDATORY on every single change you make:

  RULE 1  ARCHITECTURAL INTEGRITY: No shortcuts, no band-aids.
          Fix the root model - never paper over a leaky abstraction.

  RULE 2  COMPONENT-FIRST LAW: Screens import components.
          Never define bespoke cards/containers in screen StyleSheet blocks.
          Shared UI -> mobile/src/components/ui/ always.

  RULE 3  ANTI-SLOP: No card-wrapping every row. No 1px wireframe borders.
          No floating pill collisions. Use spatial grouping + native separators.

  RULE 4  SKILL-FIRST: Check .agents/skills/ before writing any code.
          UI -> expo-design-system. Bugs -> test-driven-development.
          API -> api-and-interface-design. Review -> verification-before-completion.

  RULE 5  TDD + EVIDENCE: Write failing test first. Show passing output.
          "I think it works" is not evidence. Only passing command output counts.

  RULE 6  PRIVACY: Zero cloud leakage of message content. Local-only parsing.
          Biometric gates (FaceID/PIN) must guard entry and Share Sheet.
          Hard-wipe must be instant and permanent.

  RULE 7  KISS, DRY, YAGNI, SEPARATION OF CONCERNS:
          Simplest code. One source of truth. Build only what is needed now.
          UI / business logic / data access in distinct layers always.

  RULE 8  SOLID: SRP (one reason to change), OCP (extend, never modify stable code),
          LSP (subtypes honor base contracts), ISP (small interfaces),
          DIP (depend on abstractions, inject concrete implementations).

  RULE 9  ARCHITECTURE: Loose coupling, high cohesion.
          Law of Demeter - no train-wreck chains (a.b.c.d()).
          Twelve-Factor: env-var config, stateless processes.

  RULE 10 PROCESS: Spec before code (/speckit-specify -> /speckit-plan -> /speckit-tasks).
          CI must pass on every push. Testing pyramid: unit > integration > e2e.
          Code-review checklist verifies all rules before merge.

Full rules  : .agents/rules/AGENTS.md
Constitution: .specify/memory/constitution.md

=============================================================
"@

$output = @{
    injectSteps = @(
        @{
            systemMessage = @{
                systemMessage = $message
            }
        }
    )
} | ConvertTo-Json -Depth 10

Write-Output $output
