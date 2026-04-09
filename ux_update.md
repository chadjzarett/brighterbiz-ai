# BrighterBiz.ai — Landing Page UX Update

## Aesthetic direction: "Refined Operator"

The landing page should feel calm, credible, and slightly editorial — addressing the SMB owner as a serious operator who deserves a premium tool, not a toy. Premium is achieved through **restraint**: precision typography, a single accent hue, generous whitespace, and atmosphere applied only where it supports the page's focal hierarchy (hero input and bottom CTA).

**Explicitly avoid:**

- Inter as the sole typeface across all hierarchies.
- Rainbow accent hues that change per section or per tag.
- Purple-on-white or pastel gradient clichés.
- Scattered Framer Motion staggers on every content block — one coordinated hero entrance is worth more than twenty independent fade-ups.

---

## 1. Scope and references

**In scope:**

| Section   | Anchor   |
|-----------|----------|
| Hero      | `#hero`  |
| Features  | `#features` |
| Examples  | `#examples` |
| FAQ       | `#faq`   |

**Key files:**

- Landing page markup: `brighterbiz-ai/src/app/page.tsx`
- Form component: `brighterbiz-ai/src/components/EnhancedForm.tsx`
- Font loading: `brighterbiz-ai/src/app/layout.tsx`
- Tokens and utilities: `brighterbiz-ai/src/app/globals.css`
- Accordion primitives: `brighterbiz-ai/src/components/ui/accordion.tsx`

**Out of scope:** Results flow, consultation modal internals (only the FAQ inline link treatment is addressed), CTA band, footer, and mobile navigation drawer.

---

## 2. Cross-cutting rules

These apply to every section. Individual section briefs below add section-specific detail.

### 2.1 Typography

- **Display face** for H1, H2, and optionally FAQ question text — pick a characterful Google Font that is not Inter, Roboto, Arial, or Space Grotesk. Candidates should feel trustworthy and modern (e.g. a geometric sans with personality or a refined humanist sans with distinctive letter shapes). Import via `next/font/google` alongside the existing Inter stack.
- **Body face** remains Inter (or a refined alternative) for paragraphs, labels, UI chrome, and form text.
- Define a **type scale** and use it consistently:

| Role            | Approx size       | Weight    | Tracking     |
|-----------------|--------------------|-----------|--------------|
| Hero display    | 56–64 px           | 700–800   | -0.02 em     |
| Section title   | 36–40 px           | 700       | -0.015 em    |
| Lead / subhead  | 20 px              | 400       | normal       |
| Body            | 16 px              | 400       | normal       |
| Caption / label | 13–14 px           | 500       | 0.01 em      |

- Max comfortable line length for body text: ~65 ch (`max-w-xl` or `max-w-2xl` depending on column width).

### 2.2 Color and accent discipline

- Route all section chrome through **semantic CSS variables**: `text-primary`, `text-secondary`, `border-primary`, and a new `--accent` / `--accent-muted` pair that works in both light and dark mode.
- **Eliminate raw Tailwind color utilities** (`gray-600`, `blue-50`, `blue-600`, `green-600`, `indigo-100`, `pink-100`, etc.) from these four sections. Every color reference should map to a token with an explicit dark-mode counterpart.
- **One primary accent** (blue is fine — but define it as a token, e.g. `--color-accent: 37 99 235` / dark: `96 165 250`) plus neutrals. Tags, icons, pills, and links all derive from this single accent family or from neutral tokens.

### 2.3 Motion

- **Hero**: One coordinated entrance — headline, subhead, form, and trust row animate in a single orchestrated sequence (staggered delays, 0.4–0.8 s total). No independent hover-lift on trust chips or pill.
- **Below-the-fold sections**: Subtle `whileInView` — opacity 0 → 1 plus 10–15 px translate-y, once. No bouncing, no competing hover transforms on every card.
- **Hover states**: Pick one pattern site-wide — either a subtle border-color shift or a soft shadow lift — and apply it uniformly to all cards. Do not stack `whileHover={{ y: -2 }}` with `hover:shadow-md` and `hover:border-secondary` simultaneously.

### 2.4 Background and atmosphere

- Alternating `bg-primary` / `bg-secondary` bands remain the structural foundation.
- Add **one optional subtle treatment** to the hero background only: a faint radial gradient or noise texture that creates depth behind the form. Keep it imperceptible enough that it does not fight the form's own container.
- Do not add textures or meshes to Features, Examples, or FAQ — let the content breathe against the flat token backgrounds.

### 2.5 Border radius language

- Standardize on **two radii** across all four sections:
  - `rounded-xl` (16 px) for cards, form container, and large surfaces.
  - `rounded-full` for pills, chips, and icon circles.
- Remove `rounded-3xl` from buttons/header and `rounded-lg` from form — converge on the two-radius system.

---

## 3. Hero section

### Current issues

- Headline uses `font-[family-name:var(--font-inter)]` — the display typeface is Inter at 5xl/6xl, which is generic.
- Eyebrow pill ("Powered by Advanced AI") uses `bg-blue-50 text-blue-700` — light-mode-only; will look pasted-on in dark mode.
- Subhead uses `text-gray-600` — raw gray, no dark-mode pair.
- Trust row uses `text-green-600` — another hard-coded color that breaks the accent system.
- Form container has no visual elevation; the textarea sits flat against the page.
- "Free" is mentioned in the headline, the subhead, and the trust row — dilutes premium feel.

### Recommended changes

| Change | Details | Priority |
|--------|---------|----------|
| Display typeface on H1 | Apply the new display font to the hero headline; remove the inline `font-[family-name:var(--font-inter)]` override. Tight negative letter-spacing (-0.02 em) for large type. | P0 |
| Token-based subhead color | Replace `text-gray-600` with `text-secondary`; ensure dark mode maps to the correct muted tone. | P0 |
| Form as hero object | Wrap `EnhancedForm` in a container with: accent-aware border, subtle box-shadow (e.g. `shadow-lg` mapped to token), and generous internal padding. The form should feel like a distinct, elevated surface. | P0 |
| Submit affordance | Evaluate adding a visible text label ("Get Recommendations") alongside or in place of the icon-only Send button. If keeping icon-only, increase its visual weight (larger tap target, stronger contrast). Document this as a UX decision. | P0 |
| Eyebrow pill theming | Replace `bg-blue-50 text-blue-700` with token-based fill and text (e.g. `bg-tertiary text-accent` or a border-only pill with accent text). Must look native in both themes. | P1 |
| Trust row palette | Replace `text-green-600` and `CheckCircle` green with `text-accent` or a neutral secondary treatment. Shorten copy: "No signup", "No card", "Free". Vertically stack on small screens with consistent spacing. | P1 |
| Copy hierarchy | Consider leading the headline with an outcome ("A clear AI roadmap for your business") and moving "Free" to trust chips only. This is a content decision — flag for A/B consideration, not a hard mandate. | P1 |
| Spatial asymmetry | On `lg+`, consider a two-column hero: headline/subhead on the left, form on the right. Only if it improves conversion focus — document as optional P2 exploration. | P2 |

---

## 4. Features section

### Current issues

- Three feature cards use **three different icon circle hues**: indigo, blue, emerald. This reads as "Tailwind color palette sampler."
- Card hover stacks `whileHover={{ y: -2 }}` with `hover:border-secondary hover:shadow-md` — three simultaneous effects.
- Section subtitle uses `text-secondary` (good) but the title just uses `text-primary` with no display-font treatment — inconsistent with what the hero should become.

### Recommended changes

| Change | Details | Priority |
|--------|---------|----------|
| Unified icon treatment | Replace per-card `iconBg` / `iconColor` with one system: neutral circle (`bg-tertiary`) + monochrome icon (`text-primary`), or neutral circle + accent icon on all three. The icons should feel like one family. | P0 |
| Card border / shadow system | Pick one hover treatment: either `border` shifts to `border-secondary` or `shadow` elevates to `shadow-md` — not both plus a y-translate. Apply the same treatment to Examples cards for consistency. | P0 |
| Section header type | Apply the display font to the H2 ("Why BrighterBiz.ai?"). Add an optional small uppercase label above it (e.g. "Features" in `text-xs tracking-widest text-secondary`) for editorial rhythm. | P1 |
| Background band continuity | If a subtle treatment is added to `bg-secondary` (e.g. a 1 px top-border, faint noise), apply the same to the FAQ band so both "alternate" bands feel identical. | P1 |
| Reduce hover motion | Remove `whileHover={{ y: -2 }}` from cards; let the border/shadow hover alone carry the interaction. Remove `whileHover={{ scale: 1.05 }}` from icon circles — static is fine. | P2 |

---

## 5. Examples section ("See What's Possible")

### Current issues

- Tags use **per-category rainbow colors**: `bg-blue-100 text-blue-700`, `bg-pink-100 text-pink-700`, `bg-green-100 text-green-700`, `bg-purple-100 text-purple-700`. Six different hues across three cards.
- Card icon tiles (`bg-tertiary rounded-lg`) are a different size and radius than Features icon circles — the two sections feel unrelated.
- Inside each card, the two feature rows have no visual separator; the vertical rhythm between business title, feature 1, and feature 2 is loose.

### Recommended changes

| Change | Details | Priority |
|--------|---------|----------|
| Single chip system for tags | Replace all per-category colored backgrounds with one neutral chip: `bg-tertiary text-secondary` with optional small accent-colored dot or left-border. Category labels stay readable; the card no longer competes with its own tags for attention. | P0 |
| Align icon/header row with Features | Match icon tile size, shape, and color system to the Features icon treatment (e.g. same `bg-tertiary` circle or rounded square with monochrome icon). This creates one product language across both sections. | P0 |
| Section header type | Apply display font to H2. Add optional small label ("Examples" in `text-xs tracking-widest text-secondary`) above it, matching Features. | P1 |
| Internal card rhythm | Add a subtle `border-t border-primary` or consistent `space-y` token between the two feature blocks inside each card. Ensure description text does not run wider than ~50 ch. | P1 |
| H4 vs tag weight balance | Reduce tag font-weight or size slightly so the feature title (H4) is clearly dominant in the row. Currently both are `font-medium` — the tag should be lighter. | P1 |
| Optional scenario line | Add a one-line italic description under the business name (e.g. "A neighborhood bakery with 3 employees") for context. Low priority — only if it does not clutter. | P2 |

---

## 6. FAQ section

### Current issues

- Header icon container uses `bg-primary border border-primary` — correct token usage, but the `HelpCircle` icon color is `text-primary` which may lack contrast against the `bg-secondary` band.
- Each FAQ question has a unique icon (Brain, DollarSign, Zap, MessageCircle, Shield, Clock, CheckCircle) — seven different metaphors. This adds visual noise rather than aiding comprehension.
- The "Schedule a Free Consultation" link inside the last answer uses raw `text-blue-600 hover:text-blue-700` — another hard-coded blue that breaks in dark mode.
- Answer text at `max-w-4xl` on large screens can produce very long line lengths, reducing readability.

### Recommended changes

| Change | Details | Priority |
|--------|---------|----------|
| Token-ize inline CTA | Replace `text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300` with `text-accent hover:text-accent/80` (or whatever the accent token resolves to). Consider restyling as a small text-button (`font-medium`, no underline, accent color, subtle hover background) for stronger affordance. | P0 |
| Q/A typography | Questions: `text-lg font-semibold` in the display font (or semibold body font if display is too heavy). Answers: `text-base leading-relaxed text-secondary`. Ensure enough vertical padding between items (at least 16 px). | P0 |
| Consistent question icons | Either use one icon for all questions (e.g. a subtle chevron or a small `HelpCircle` for every row) or remove per-question icons entirely. If keeping icons, render them in `text-secondary` so they recede. | P1 |
| Header icon contrast | Change `HelpCircle` to `text-accent` or `text-secondary` (not `text-primary`) so it reads as a decorative element, not a competing heading. | P1 |
| Answer line length | Add `max-w-prose` (65 ch) or `max-w-2xl` to answer content blocks so text does not stretch across the full 4xl container on wide screens. | P1 |
| "Still have questions?" footer | Optional: add a small centered line below the accordion — "Still have questions? [Schedule a free consultation](#)" — so the CTA is not buried inside the last accordion item. | P2 |

---

## 7. Implementation mapping

| Area | Primary file(s) |
|------|-----------------|
| Hero markup and section chrome | `brighterbiz-ai/src/app/page.tsx` |
| Form surface and submit UX | `brighterbiz-ai/src/components/EnhancedForm.tsx` |
| Font imports and `next/font` config | `brighterbiz-ai/src/app/layout.tsx` |
| Semantic tokens, accent variable, utilities | `brighterbiz-ai/src/app/globals.css` |
| Accordion styling (if needed) | `brighterbiz-ai/src/components/ui/accordion.tsx` |
| Tag/chip component (if extracted) | New component or inline in `page.tsx` |

---

## 8. Acceptance checklist

- [ ] Light and dark mode: no "light-only" pills, badges, or raw gray/green/blue values remain in Hero, Features, Examples, or FAQ.
- [ ] No more than one dominant accent hue is used across all four sections. Tags, pills, links, and icons all derive from the accent token or neutrals.
- [ ] Display typeface is applied to H1, H2, and optionally FAQ questions. Body text uses the body face. The type scale table from section 2.1 is followed.
- [ ] Border radius uses only two values site-wide: `rounded-xl` for surfaces, `rounded-full` for pills/circles.
- [ ] Hero entrance feels like one coordinated beat (staggered over ~0.8 s total). Below-the-fold sections use subtle, uniform `whileInView` animation.
- [ ] Card hover states across Features and Examples use the same single pattern (border shift or shadow, not both plus translate).
- [ ] FAQ inline consultation link uses token-based accent color, not hard-coded blue.
- [ ] FAQ answer text does not exceed ~65 ch line length on large screens.
- [ ] Form container is visually elevated (shadow, border, or background contrast) so it reads as the hero's focal object.
- [ ] Trust row colors are unified with the accent/neutral system; green checkmarks are replaced.
