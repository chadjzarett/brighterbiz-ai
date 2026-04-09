---
name: Landing UX Update Doc
overview: Add a new planning document `ux_update.md` at the repo root that breaks down Hero, Features, Examples, and FAQ UX improvements for the BrighterBiz landing page, aligned with distinctive typography, cohesive tokens, intentional motion, and spatial depth—without implementing code in this step.
todos:
  - id: write-ux-update-md
    content: Create /Users/czaret200/smb_project/ux_update.md with full Hero, Features, Examples, FAQ UX spec, cross-cutting rules, file map, and acceptance checklist per plan.
    status: pending
isProject: false
---

# Landing page UX update document (`ux_update.md`)

## Goal

Create **[ux_update.md](ux_update.md)** at the workspace root (alongside [UX_REDESIGN_PLAN.md](UX_REDESIGN_PLAN.md)) containing a **section-by-section UX spec** for the landing page in [brighterbiz-ai/src/app/page.tsx](brighterbiz-ai/src/app/page.tsx), informed by the **frontend-design** skill: one clear aesthetic direction, non-generic typography, token-driven color, restrained high-impact motion, and atmospheric depth where it supports the story—not decorative noise.

## Proposed aesthetic direction (document header)

Commit in the doc to a single POV—for example **“Refined operator”**: calm, credible, slightly editorial (SMB owner as serious operator), **premium through restraint** (precision type, one accent, subtle grain or mesh only behind hero/CTA). Explicitly avoid: Inter-only hierarchy, rainbow section accents, purple-on-white clichés, and scattered Framer stagger on every block.

## What `ux_update.md` will contain (outline to write verbatim)

### 1. Scope and references

- In scope: Hero (`#hero`), Features (`#features`), Examples (`#examples`), FAQ (`#faq`) on the home page; cross-links to [brighterbiz-ai/src/components/EnhancedForm.tsx](brighterbiz-ai/src/components/EnhancedForm.tsx) and [brighterbiz-ai/src/app/layout.tsx](brighterbiz-ai/src/app/layout.tsx) / [brighterbiz-ai/src/app/globals.css](brighterbiz-ai/src/app/globals.css) for tokens and fonts.
- Out of scope for this doc: full results flow, consultation modal internals (only FAQ link behavior called out).

### 2. Cross-cutting rules (applies to all four sections)

- **Typography**: Pair a **display** face for H1/H2 (and optionally FAQ questions) with a **body** face for paragraphs and UI; define a numeric scale (e.g. hero display, section title, lead, body, caption) and max line lengths for readability.
- **Color**: Route section chrome through **semantic tokens** (`text-primary`, `text-secondary`, `border-primary`, accent variable); eliminate raw `gray-`* / `blue-*` in these sections unless mapped to tokens with dark-mode pairs.
- **Accent discipline**: **One primary accent** (e.g. blue or a custom brand hue) plus neutrals; chips/tags derive from neutral + accent, not per-category rainbow.
- **Motion**: Prefer **one coordinated hero entrance**; below the fold, **subtle** `whileInView` (opacity + small translate) and reduce competing hover lifts.
- **Backgrounds**: Optional **very subtle** mesh, noise, or radial highlight **only** where it supports focal hierarchy (hero + maybe CTA), not every band.

### 3. Hero section UX updates

- **Hierarchy**: Lead with **outcome-first headline** (optional copy note); keep “free” in **trust chips**, not repeated in every line.
- **Eyebrow pill** (“Powered by Advanced AI”): Redesign as a **theme-aware** pill (border + muted fill using tokens) so light/dark both feel native.
- **Subhead**: Replace hard-coded gray with **semantic secondary**; tune width and line-height for a premium editorial feel.
- **Primary surface**: Treat **EnhancedForm** as the **hero object**: stronger container (depth, border, focus ring aligned to accent), consider a visible **primary submit** affordance beyond icon-only if conversion is the goal (document as UX decision).
- **Trust row** (three checkmarks): Unify color with accent/neutral system; shorten copy; align vertically on small screens.
- **Spatial**: Optional **asymmetry** (e.g. offset max-width or split layout on large screens) only if it improves focus on the input—document as P2 if risky for SMB clarity.

**Priority tags in doc**: P0 token + type + form focal; P1 eyebrow + trust row; P2 asymmetry.

### 4. Features section UX updates

- **Visual system**: Replace **three different icon circle hues** (indigo / blue / emerald) with **one icon treatment** (neutral surface + single accent icon or monochrome with accent on hover).
- **Cards**: Tighten **radius/shadow/border** language to match header and form; ensure **equal height** and consistent internal padding; hover state should be **subtle** (border or shadow), not stacked motion.
- **Header block**: Section title + subtitle use the **same type scale** as Examples/FAQ; add optional **small label** above H2 for editorial rhythm (“Why us”).
- **Band treatment**: If adding atmosphere, use **one** subtle background treatment for `bg-secondary` bands (features + FAQ) for continuity.

**Priority**: P0 palette + card system; P1 section header + band continuity; P2 hover/motion polish.

### 5. Examples (“See What’s Possible”) UX updates

- **Tags**: Replace **rainbow tag backgrounds** with a **single chip system** (outline or soft neutral fill + optional accent dot); category labels remain readable without new colors per tag.
- **Card structure**: Clarify **vertical rhythm** between business title, feature rows, and descriptions; consider **divider** or **consistent spacing token** between the two feature blocks inside each card.
- **Icon/header row**: Align icon tile size and corner radius with Features section for **one product language**.
- **Content scan**: Ensure **H4 + tag row** does not fight for attention (weight/size contrast).

**Priority**: P0 tag system + alignment with features; P1 internal card rhythm; P2 optional small “scenario” line under business name.

### 6. FAQ section UX updates

- **Header**: HelpCircle container should use **token borders/fills**; icon color from semantic primary/secondary.
- **Accordion rows**: Define **typography** for question (semibold, size) vs answer (body, relaxed line-height); sufficient **tap targets** and spacing between items.
- **Icons per question**: Either **one consistent metaphor style** or **monochrome** icons to avoid visual noise; align with Features icon discipline.
- **Inline CTA** (“Schedule a Free Consultation”): Restyle from default **blue underlined link** to a **button or text-button** pattern that matches the site’s accent component (still accessible).
- **Width**: Keep `max-w-4xl` but specify **comfortable measure** for answer text (avoid long line length on large screens).

**Priority**: P0 tokens + Q/A typography + consultation link pattern; P1 icon noise reduction; P2 optional “still have questions?” micro-footer inside section.

### 7. Implementation mapping (short table in the doc)


| Area                         | Primary files                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Hero markup + section chrome | [brighterbiz-ai/src/app/page.tsx](brighterbiz-ai/src/app/page.tsx)                                                        |
| Form surface                 | [brighterbiz-ai/src/components/EnhancedForm.tsx](brighterbiz-ai/src/components/EnhancedForm.tsx)                          |
| Fonts                        | [brighterbiz-ai/src/app/layout.tsx](brighterbiz-ai/src/app/layout.tsx)                                                    |
| Tokens / utilities           | [brighterbiz-ai/src/app/globals.css](brighterbiz-ai/src/app/globals.css)                                                  |
| Accordion primitives         | [brighterbiz-ai/src/components/ui/accordion.tsx](brighterbiz-ai/src/components/ui/accordion.tsx) (if styling leaks there) |


### 8. Acceptance checklist (bullet list in the doc)

- Light and dark: no “light-only” pills or grays in hero/FAQ.
- No more than **one** dominant accent hue across Features + Examples + FAQ.
- Type scale consistent across section titles and FAQ questions.
- Motion: hero feels **one beat**; lower sections feel **calm**.

## Deliverable after you approve

- Add **[ux_update.md](ux_update.md)** at `/Users/czaret200/smb_project/ux_update.md` with the full narrative (sections 1–8), written as a standalone UX brief (not code).

