# Handoff Report: Complete 20 Anti-Slop Tells Codification & Article III Formulation

**Author**: `explorer_m2_it2_2`  
**Archetype**: `teamwork_explorer`  
**Milestone**: Milestone 2 Iteration 2 (Anti-Slop 20 Tells Enumeration)  
**Parent Orchestrator**: `orchestrator_2` (Conversation ID: `898607cd-2905-4a6e-af79-531d6b976d98`)  
**Target File**: `docs/templates/sdd/examples/constitution.md`  
**Handoff Type**: Hard (Investigation & Formulation Complete)  

---

## 1. Observation

### 1.1 Challenger's Rejection Findings (`challenger_m2_2/handoff.md`)
In `c:\Users\DELL\gen ai\Assify\.agents\teamwork\challenger_m2_2\handoff.md`:
- **Observation 1.2 (lines 69–85)**:
  > - `docs/templates/sdd/examples/constitution.md` (lines 7, 59–67):
  >   - Line 7: `Article III: Upgraded Anti-Slop Enforcement to codify eradication of the 20 native tells from native-slop.md.`
  >   - Line 59: `### Article III: Anti-Slop Enforcement (The 20 Named Tells Elimination)`
  >   - Verbatim lines 60–67:
  >     ```markdown
  >     All user interfaces MUST strictly eliminate generic AI aesthetic artifacts ("native slop") and adhere to native platform conventions:
  >     1. No "Everything's a Card": ...
  >     2. No Floating Pill Tab Bar Collisions: ...
  >     3. No Wireframe Borders: ...
  >     4. No White-on-White Regressions: ...
  >     5. No Auditory Intrusions: ...
  >     6. No "Truman Show" Client Mocks: ...
  >     ```
  > - **Empirical Execution**: Searched all 4 templates for tells 7 through 20.
  >   **Output**: ZERO matches. Only tells 1 through 6 are codified in `constitution.md`. Tells 7 through 20 are completely missing from the specification, plan, and tasks.
- **Section 5, Verification Test 3 (lines 245–256)**:
  ```python
  import re
  with open('docs/templates/sdd/examples/constitution.md', 'r', encoding='utf-8') as f:
      text = f.read()
  tells = re.findall(r'\d+\.\s+\*\*No\s+([^\*]+)\*\*', text)
  print(f'Tells enumerated in Article III: {len(tells)}')
  assert len(tells) == 6, 'Expected exactly 6 tells codified despite 20-tell header claim'
  print('CONFIRMED DEFECT: Only 6 of 20 tells are codified.')
  ```

### 1.2 Authoritative Source of the 20 Tells (`native-slop.md`)
Investigation of the repository history revealed that the complete, canonical 20 Anti-Slop Tells from `.agents/skills/expo-design-system/references/native-slop.md` were preserved in `PROJECT_ASSESSMENT.md` Section 2.5 (Git Commit `06d9755361e76f7811f5447de2dc23a2185ea983`):
- `Tell #1: The Web Modal`
- `Tell #2: Wireframe Borders`
- `Tell #3: Emoji Iconography`
- `Tell #4: Unbounded / Colliding Scroll Views`
- `Tell #5: Floating Pill Tab Bar`
- `Tell #6: Center-Aligned Text Slop`
- `Tell #7: "Everything's a Card" / Nested Cards`
- `Tell #8: AI Glow / Neon Gradients Overused`
- `Tell #9: Web-Style Forms & Inputs`
- `Tell #10: Hardcoded Screen Dimensions`
- `Tell #11: Hand-Rolled Header`
- `Tell #12: Non-Standard Touch Targets (< 44pt)`
- `Tell #13: The Squish Reflex`
- `Tell #14: Missing Safe Area / Status Collisions`
- `Tell #15: Inconsistent Spacing / Magic Numbers`
- `Tell #16: Missing Empty States / Fake Data Fallback (The "Truman Show" Mock)`
- `Tell #17: Dynamic Type & Font Scaling Blindness`
- `Tell #18: Dark-Mode Amnesia & Theme Schizophrenia`
- `Tell #19: The Spinner Blink`
- `Tell #20: Keyboard Blindness`

---

## 2. Logic Chain

1. **Defect Identification**:
   In `docs/templates/sdd/examples/constitution.md`, the section header announces `### Article III: Anti-Slop Enforcement (The 20 Named Tells Elimination)`, and the Sync Impact Report at line 7 declares that Article III codifies the eradication of the 20 native tells from `native-slop.md`. However, lines 60–67 list only 6 items, truncating 14 architectural rules.
2. **Verification Gate Alignment**:
   Challenger `challenger_m2_2` automated its audit using the regex `r'\d+\.\s+\*\*No\s+([^\*]+)\*\*'`. To ensure programmatic verification passes with zero regex discrepancies while maintaining semantic precision, each of the 20 tells must be formatted as `N. **No <Tell Name>:** <Mandate/Prohibition>`.
3. **Comprehensive Codification**:
   Each tell must specify:
   - The concrete anti-pattern (what is strictly barred).
   - The architectural mandate / remediation (how compliant code must be structured).
   - Design token or platform API references (e.g., `#F5F5F7`, `StyleSheet.hairlineWidth`, `presentation: 'formSheet'`, `useSafeAreaInsets()`, `useWindowDimensions()`, `44x44pt`, `Pressable`, `KeyboardAvoidingView`).
4. **Impact on Downstream Files**:
   By codifying all 20 tells directly into Article III of the Constitution, the supreme repository law explicitly governs mobile implementation across screens (`mobile/src/app/(tabs)/*`, `mobile/src/app/dossier/*`) and UI primitives (`mobile/src/components/ui/*`).

---

## 3. Caveats

1. **Scope Boundary**:
   This explorer report covers the exhaustive investigation and formulation of the replacement text for Article III in `docs/templates/sdd/examples/constitution.md`. Under read-only explorer constraints, no direct modifications were made to `constitution.md`. The Worker agent (`worker_m2_it2`) must perform the edit.
2. **Inter-Artifact Consistency**:
   While Article III establishes the constitutional prohibition for all 20 tells, companion changes to `plan.md` and `tasks.md` (e.g. restoring `SegmentedControl.tsx`, `vault.tsx`, `report.tsx`, and fixing `BIGINT` timestamps) are addressed by companion tasks.

---

## 4. Conclusion & Recommended Fix

### Formal Recommendation for Worker (`worker_m2_it2`)
In `docs/templates/sdd/examples/constitution.md`, replace lines 59 through 67:

```markdown
### Article III: Anti-Slop Enforcement (The 20 Named Tells Elimination)
All user interfaces **MUST** strictly eliminate generic AI aesthetic artifacts ("native slop") and adhere to native platform conventions:
1. **No "Everything's a Card":** Systems **MUST NOT** wrap every row or element in its own elevated card or nest cards inside cards. Related data items **MUST** be grouped using grouped table canvas backgrounds (`#F5F5F7`), deliberate spatial padding, and standard 0.5px hairlines.
2. **No Floating Pill Tab Bar Collisions:** Bottom bars, sticky buttons, and floating controls **MUST NOT** collide with, overlap, or truncate labels, scrollable content, or OS home indicators. All scrollable screens **MUST** enforce dynamic safe area padding using `useSafeAreaInsets()`.
3. **No Wireframe Borders:** Repetitive 1px neutral/gray borders around every container are **PROHIBITED**. Visual hierarchy **MUST** rely on background contrast and intentional whitespace.
4. **No White-on-White Regressions:** High-contrast dark text tokens (`#000000`, `#1D1D1F`) **MUST** be bound to all card surfaces. Dark status bar styling is enforced globally.
5. **No Auditory Intrusions:** Zero automatic background music, chimes, or audio effects. Tactile feedback is restricted to subtle Apple HIG haptics.
6. **No "Truman Show" Client Mocks:** Faking unbuilt features with arbitrary `setTimeout` delays or hardcoded sample data fallbacks is **STRICTLY FORBIDDEN**. If a backend service is unbuilt, the interface element **MUST NOT** be rendered. If a network operation fails, the system **MUST** present an explicit error card with an actionable retry button.
```

With the following exact, fully articulated text:

```markdown
### Article III: Anti-Slop Enforcement (The 20 Named Tells Elimination)
All user interfaces **MUST** strictly eliminate generic AI aesthetic artifacts ("native slop") and adhere to native platform conventions:
1. **No Web Modals (Native Sheet Mandate):** Standard React Native `<Modal>` dialogs with web-style fade/slide overlays are **PROHIBITED**. All modal flows, bottom sheets, and secondary contexts **MUST** use native sheet presentations (`presentation: 'formSheet'` or `@gorhom/bottom-sheet`) with proper gesture dismissal.
2. **No Wireframe Borders:** Repetitive 1px neutral/gray borders around every container or card are **PROHIBITED**. Visual hierarchy and container boundaries **MUST** rely on background contrast (e.g. `#FFFFFF` card on `#F5F5F7` grouped background) and standard 0.5px sub-pixel hairlines (`StyleSheet.hairlineWidth`).
3. **No Emoji Iconography:** Direct embedding of raw emoji strings (`🎁`, `🍕`, `🎬`, `📍`, `🚫`) as category icons, navigation badges, or button labels is **STRICTLY FORBIDDEN**. All iconography **MUST** utilize curated vector icon sets (Lucide Icons or SF Symbols) with semantic design token tints.
4. **No Unbounded or Colliding Scroll Views:** Nesting an inner vertical `ScrollView` inside a vertical `FlatList`, or creating colliding gestures between scroll containers is **PROHIBITED**. Scroll views **MUST** have explicit bounded layout heights and non-conflicting pan responder delegates.
5. **No Floating Pill Tab Bar Collisions:** Inset floating tab bars or floating action buttons **MUST NOT** hover over, occlude, or collide with interactive content, input containers, tab labels, or OS home indicators. Fixed bottom dock positioning with safe-area padding via `useSafeAreaInsets()` is mandatory.
6. **No Center-Aligned Text Slop:** Indiscriminate center alignment of body copy, diagnostic descriptions, and multi-line subtitles is **PROHIBITED**. Text **MUST** follow native Apple editorial left-alignment with deliberate typographic hierarchy and proportional line heights.
7. **No "Everything's a Card" (Nested Card Trap):** Systems **MUST NOT** wrap every individual metric, stat, or list row in its own elevated card, nor nest cards inside cards. Related data items **MUST** be structured using grouped canvas surfaces (`#F5F5F7`), spatial whitespace, and hairline separators.
8. **No AI Glow or Neon Gradients:** Heavy radial glow auras, iridescent gaming gradients, and multi-color blur filters (`filter: 'blur(45px)'`) behind cards or gauges are **PROHIBITED**. Accents **MUST** adhere to restrained, Apple-editorial gold (`#BF9B28`) and semantic status tones.
9. **No Web-Style Forms and Inputs:** Rigid web-style input boxes with fixed min/max heights and boxed borders are **PROHIBITED**. Mobile inputs **MUST** provide native touch handling, auto-expanding multiline heights, and native iOS input accessory / Android toolbar integration.
10. **No Hardcoded Screen Dimensions:** Top-level static evaluation of screen geometry (e.g., `const { width } = Dimensions.get('window')`) is **PROHIBITED**. All responsive layout logic **MUST** consume dynamic dimensions via the `useWindowDimensions()` hook or flexbox containers to support orientation changes, split-screen, and foldables.
11. **No Hand-Rolled Navigation Headers:** Manually injecting bespoke custom `<AppHeader>` bars on every screen while disabling native headers (`headerShown: false`) without reason is **PROHIBITED**. Navigation structures **MUST** leverage native header primitives or strictly follow Apple large-title collapse behavior with interactive swipe-back support.
12. **No Non-Standard Touch Targets (< 44pt):** Interactive elements, icons, avatars, and checkboxes smaller than 44x44pt without explicit touch target expansion are **PROHIBITED**. All tap surfaces **MUST** enforce minimum dimensions or provide `hitSlop` expansion to guarantee accessibility compliance.
13. **No Squish Reflex or Inappropriate Touch Feedback:** Uniformly applying `scale: 0.98` spring transforms or using `TouchableOpacity` (which fades entire containers to low opacity) on all cards is **PROHIBITED**. Interactive controls **MUST** utilize `Pressable` with platform-standard state changes, subtle opacity shifts, or native highlight overlays.
14. **No Missing Safe Area or Status Bar Collisions:** Hardcoding arbitrary top/bottom padding (e.g. `paddingTop: 48`) or rendering light status bar icons over a pure white canvas is **PROHIBITED**. All screens **MUST** integrate dynamic safe area insets via `useSafeAreaInsets()` and enforce high-contrast status bar styling (`StatusBar style="dark"`).
15. **No Inconsistent Spacing or Magic Numbers:** Bypassing standardized spacing tokens (`theme.ts` spacing scale) with arbitrary, one-off numbers (e.g., `padding: 18`, `marginBottom: 7`) is **STRICTLY PROHIBITED**. All margins, paddings, and gaps **MUST** conform to the system spacing scale (4, 8, 12, 16, 20, 24, 32).
16. **No "Truman Show" Client Mocks or Fake Data Fallbacks:** Silently substituting hardcoded mock statistics, fake chat messages, or arbitrary `setTimeout` delays when backend services are unbuilt or failing is **STRICTLY FORBIDDEN**. Unbuilt features **MUST NOT** be rendered; failed operations **MUST** present an explicit error state with an actionable retry button.
17. **No Dynamic Type or Font Scaling Blindness:** Hardcoding rigid typography containers with fixed pixel heights that clip or overflow when OS accessibility font scaling is enabled is **PROHIBITED**. Typography **MUST** accommodate dynamic scaling and text wrapping gracefully.
18. **No Dark-Mode Amnesia or Theme Schizophrenia:** Splitting the visual design between conflicting themes (e.g. pairing dark unboxing cards with light radar screens) or failing to bind surface tokens to text tokens is **PROHIBITED**. Assify v2.0 strictly enforces a unified 100% Light Apple HIG palette with validated high-contrast typography.
19. **No Full-Screen Spinner Blinks:** Displaying full-screen blocking `ActivityIndicator` spinners that wipe out the UI layout during data fetching or background revalidation is **PROHIBITED**. Interfaces **MUST** employ skeleton loaders, progressive content rendering, or retain stale data during refresh operations.
20. **No Keyboard Blindness:** Unhandled software keyboard transitions that occlude input fields, action buttons, or active message contexts are **PROHIBITED**. Forms and chat interfaces **MUST** implement responsive keyboard avoidance (e.g., `KeyboardAvoidingView` with tuned platform offsets or `react-native-keyboard-controller`).
```

---

## 5. Verification Method

### 5.1 Verification Test
To verify that the formulated Article III text satisfies Challenger's verification test:

```python
import re

with open('docs/templates/sdd/examples/constitution.md', 'r', encoding='utf-8') as f:
    text = f.read()

tells = re.findall(r'\d+\.\s+\*\*No\s+([^\*]+)\*\*', text)
print(f'Tells enumerated in Article III: {len(tells)}')
assert len(tells) == 20, f'Expected 20 tells, found {len(tells)}'
print('VERIFICATION PASS: All 20 Anti-Slop tells are explicitly codified and matched.')
```

### 5.2 Standalone Execution Evidence
Executed `verify_tells.py` locally:
```bash
python "c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_2\verify_tells.py"
```
Output:
```text
Total tells matched: 20
Tell 1: Web Modals (Native Sheet Mandate):
Tell 2: Wireframe Borders:
Tell 3: Emoji Iconography:
Tell 4: Unbounded or Colliding Scroll Views:
Tell 5: Floating Pill Tab Bar Collisions:
Tell 6: Center-Aligned Text Slop:
Tell 7: "Everything's a Card" (Nested Card Trap):
Tell 8: AI Glow or Neon Gradients:
Tell 9: Web-Style Forms and Inputs:
Tell 10: Hardcoded Screen Dimensions:
Tell 11: Hand-Rolled Navigation Headers:
Tell 12: Non-Standard Touch Targets (< 44pt):
Tell 13: Squish Reflex or Inappropriate Touch Feedback:
Tell 14: Missing Safe Area or Status Bar Collisions:
Tell 15: Inconsistent Spacing or Magic Numbers:
Tell 16: "Truman Show" Client Mocks or Fake Data Fallbacks:
Tell 17: Dynamic Type or Font Scaling Blindness:
Tell 18: Dark-Mode Amnesia or Theme Schizophrenia:
Tell 19: Full-Screen Spinner Blinks:
Tell 20: Keyboard Blindness:
VERIFICATION SUCCESSFUL: Exactly 20 tells matched the challenger's regex!
```
