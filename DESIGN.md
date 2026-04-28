---
version: "alpha"
name: "ActiveHive | Gym Management Platform"
description: "ActiveHive is a gym management SaaS platform for Nigerian gym owners. The landing page is designed around a dark-tech aesthetic anchored by a gold primary accent (#FABE12) and deep charcoal surfaces, communicating reliability and professional-grade tooling."
colors:
  primary: "#FABE12"
  primary-foreground: "#010100"
  secondary: "#09090B"
  tertiary: "#99FF17"
  neutral: "#09090B"
  background: "#09090B"
  surface: "#1C1C1F"
  text-primary: "#A1A1AA"
  text-secondary: "#FFFFFF"
  border: "rgba(255,255,255,0.1)"
  accent: "#FABE12"
  destructive: "oklch(0.577 0.245 27.325)"
  muted: "oklch(0.279 0.041 260.031)"
  muted-foreground: "oklch(0.704 0.04 256.788)"
typography:
  display-lg:
    fontFamily: "Bebas Neue"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: "72px"
    letterSpacing: "0.02em"
  display-md:
    fontFamily: "Bebas Neue"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: "52px"
    letterSpacing: "0.02em"
  heading:
    fontFamily: "Bebas Neue"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "36px"
    letterSpacing: "0.02em"
  body-md:
    fontFamily: "Satoshi"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "20px"
  body-lg:
    fontFamily: "Satoshi"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: "28px"
  label-md:
    fontFamily: "Satoshi"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  "2xl": "16px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "64px"
  "4xl": "96px"
  card-padding: "32px"
  section-padding: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    border: "1px solid rgba(255,255,255,0.1)"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "40px"
  button-link:
    textColor: "#71717A"
    typography: "{typography.body-md}"
    rounded: "0px"
    padding: "0px"
  card:
    backgroundColor: "rgba(9,9,11,0.8)"
    border: "1px solid rgba(255,255,255,0.1)"
    rounded: "15px"
    padding: "32px"
    blur: "4px"
---

## Overview

ActiveHive is a high-contrast, professional-grade platform defined by a "dark-tech" aesthetic. The design relies on a strict grid-line system, deep charcoal surfaces, and amber-gold (#FABE12) accenting to convey reliability and precision. The visual language emphasizes structural clarity through thin light-emitting borders and atmospheric depth, creating a sophisticated environment for gym management data.

- **Mood:** High-contrast, professional-grade, dark-tech — not a generic SaaS look.

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system is dark mode. `#FABE12` is the main accent. `#09090B` is the neutral foundation.

- **Primary (`#FABE12`):** Amber-gold. Main accent for CTAs, highlights, active states, and emphasis.
- **Primary Foreground (`#010100`):** Near-black text on primary backgrounds.
- **Secondary (`#09090B`):** Near-black. Supporting accent for secondary surfaces.
- **Tertiary (`#99FF17`):** Electric green. Reserved for supporting contrast moments (badges, health indicators).
- **Neutral (`#09090B`):** Foundation for all dark backgrounds.
- **Surface (`#1C1C1F` / `rgba(9,9,11,0.8)`):** Card and panel surfaces with slight transparency for blur.

**Semantic roles:**
- Background: `#09090B`
- Surface: `rgba(9,9,11,0.8)` with `backdrop-blur`
- Text Primary: `#A1A1AA` (muted body copy)
- Text Secondary: `#FFFFFF` (headings, emphasis)
- Border: `rgba(255,255,255,0.1)` (low-contrast hairline borders)
- Accent / CTA: `#FABE12`

**Sidebar palette (reuse for dark panels):**
- Sidebar bg: `oklch(0.24 0 0)` ≈ dark charcoal
- Sidebar accent bg: `oklch(0.31 0 0)`
- Sidebar text: `oklch(0.76 0 0)`
- Sidebar border: `oklch(0.34 0 0)`
- Sidebar primary: `#fabe12`

**Gradients:**
- `bg-gradient-to-b from-white/10 to-transparent`
- `bg-gradient-to-br from-[#fabe12]/10 to-transparent`
- `bg-gradient-to-t from-zinc-950 to-transparent via-transparent`
- `bg-gradient-to-b from-[#fabe12]/50 to-white/10`

## Typography

Two fonts are loaded. **Bebas Neue** is used exclusively for all headings (`h1`–`h6`, `[data-slot="card-title"]`). **Satoshi** is used for all body, label, and UI text. Both are set globally via CSS custom properties.

```css
--font-satoshi: "Satoshi";     /* body, labels, UI text */
--font-bebas: "Bebas Neue";    /* headings only */

--font-body: var(--font-satoshi);
--font-heading: var(--font-bebas);

/* Global application: */
body { font-family: var(--font-satoshi), ui-sans-serif, system-ui, sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-bebas), ...; letter-spacing: 0.02em; }
```

**Satoshi weights loaded:** 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black).

- **Display (`display-lg`):** Bebas Neue, 72px, weight 400, line-height 72px, letter-spacing 0.02em.
- **Display MD (`display-md`):** Bebas Neue, 48px, weight 400, line-height 52px, letter-spacing 0.02em.
- **Heading:** Bebas Neue, 32px, weight 400, line-height 36px, letter-spacing 0.02em.
- **Body (`body-md`):** Satoshi, 14px, weight 300, line-height 20px.
- **Body LG (`body-lg`):** Satoshi, 18px, weight 300, line-height 28px.
- **Labels (`label-md`):** Satoshi, 14px, weight 600, line-height 20px.

> **Note:** Bebas Neue is a display-only typeface with a single weight axis. Use it for large headings and section titles. Never apply Bebas Neue to body copy, captions, or interactive labels — use Satoshi there.

## Layout

The platform uses a max-width container (`max-w-6xl` / `max-w-7xl`) centered within a 12-column implicit grid, with full-bleed background treatments behind it.

- **Spacing cadence:** Vertical rhythm uses 32px and 64px gaps between primary sections.
- **Grid system:** A background layer of vertical lines defines visual zones; subtle border-corner markers guide eye movement.
- **Container padding:** `px-4` (16px mobile) → `px-8` (32px desktop).
- **Section padding:** 64px top/bottom for major sections; 96px for hero.

**Layout tokens:**
- **Layout type:** Grid
- **Content width:** Full Bleed background + max-width constrained content
- **Base unit:** 4px
- **Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 64px, 96px
- **Card padding:** 24px, 32px
- **Gaps:** 4px, 8px, 12px, 16px, 24px

## Elevation & Depth

The system avoids traditional box-shadows in favor of glass-morphism and "Glow-Border" techniques.

- **Surface recipe:** Cards use a 1px border (`rgba(255,255,255,0.1)`) on a `rgba(9,9,11,0.8)` surface with `backdrop-blur-sm` (4px).
- **Lighting:** Sub-element depth via background-fill opacities (`white/5`) and targeted blur-blooms (`blur-3xl`) to ground interactive elements.
- **Separation:** Depth is communicated via internal `border-b` dividers and high-contrast separators rather than floating layers.

**Shadows (used sparingly):**
- Amber glow: `rgba(250,190,18,0.1) 0px 25px 50px -12px`
- White soft: `rgba(255,255,255,0.1) 0px 10px 15px -3px, rgba(255,255,255,0.1) 0px 4px 6px -4px`

**Blur values:** 4px (`backdrop-blur-sm`), 12px (`backdrop-blur-md`), 24px (`backdrop-blur-xl`)

**Gradient border shell technique:**
Wrap a card in an outer shell with `p-px` (1px padding) and a `linear-gradient(rgba(255,255,255,0.1), rgba(0,0,0,0))` background to produce a premium hairline gradient border. Inset the content surface at `rounded-[15px]` inside a `rounded-[16px]` shell so the gradient appears only as a hairline frame.

## Shapes

Corner radii follow the app's CSS token system. Use them intentionally — larger surfaces open up, smaller controls stay tight.

**Border radius tokens:**
```css
--radius: 0.625rem;          /* 10px — base (rounded-lg) */
--radius-sm: 6px             /* rounded-sm  — select items, small chips */
--radius-md: 8px             /* rounded-md  — buttons, inputs, selects, badges */
--radius-lg: 10px            /* rounded-lg  — medium cards, popovers */
--radius-xl: 14px            /* rounded-xl  — standard shadcn cards */
```

**Full family:** 6px, 8px, 10px, 14px, 15px, 16px, 9999px (pill)

- **Major cards / hero containers:** 15px or 16px (`rounded-2xl`)
- **Buttons, inputs, selects, badges:** 8px (`rounded-md`)
- **Select items, chips:** 6px (`rounded-sm`)
- **Pill tags / status badges:** 9999px (`rounded-full`)

**Icon treatment:** Linear, thin-stroke. Use `@tabler/icons-react` (primary icon library) or `lucide-react` (secondary). Do not import from other icon sets.

## Components

### Buttons

All buttons use `rounded-md` (8px) by default. Primary actions use `rounded-full` (pill) shape on the landing page for visual contrast.

- **Primary:** `bg-[#FABE12] text-[#010100]` — height 40px, `rounded-md` (dashboard) / `rounded-full` (landing), `px-5 py-2`, `font-medium text-sm`.
- **Secondary / Outline:** `border border-white/10 text-white bg-transparent` — height 40px, `rounded-md`, `px-5 py-2`.
- **Ghost:** `hover:bg-white/5 text-white` — no border, no background.
- **Link:** `text-[#71717A]` — no background, no border, `underline-offset-4 hover:underline`.

Button loading state: `loading` prop replaces icon with a spinner. Keep label visible.

### Cards and Surfaces

**Dark landing card (glass):**
```
background: rgba(9,9,11,0.8)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 15px
padding: 32px
backdrop-filter: blur(4px)
```

**Light dashboard card (used inside app):**
```
background: #FFFFFF
border: 1px solid #F4F4F4
border-radius: 8px  (rounded-md) or 10px (rounded-lg)
padding: 24px
box-shadow: none
```

**Metric card (summary stat):**
```
background: #FFFFFF
border: 1px solid #F4F4F4
border-radius: 8px
padding: 0  (internal sections use px-4 py-3 / px-4 pb-4)
icon container: 48×48px, rounded-md, bg-primary/10
value: font-bebas text-3xl font-medium text-black
label: text-xs font-medium text-gray-400
```

### Navigation

Fixed-position translucent bar for landing page:
```
position: fixed, top: 0
background: bg-background/95 (rgba(9,9,11,0.95))
backdrop-filter: blur(8px)
border-bottom: 1px solid rgba(255,255,255,0.1)
height: ~64px
```

Logo: SVG lockup or wordmark. Uses `#FABE12` for the icon/accent mark.

### Forms & Inputs

```
height: 40px (h-10)
border-radius: 8px (rounded-md)
border: 1px solid oklch(0.929 0.013 255.508)  ← light mode
border (dark): 1px solid rgba(255,255,255,0.15)
background: transparent
focus ring: 3px ring-ring/50 with border-ring
```

Dark-mode variant for landing page form fields: `bg-white/5 border-white/10 text-white placeholder:text-white/40`.

### Badges / Status Chips

```
border-radius: 8px (rounded-md) for standard; 9999px (rounded-full) for count badges
padding: 2px 8px
font: Satoshi, 12px, font-medium
```

Variants: `default` (bg-primary text-primary-foreground), `secondary` (bg-secondary), `destructive` (bg-destructive text-white), `outline` (border only).

### Sidebar (dark panel reference)

```
background: oklch(0.24 0 0)   ← ~#3A3A3A dark charcoal
border-right: oklch(0.34 0 0)
text: oklch(0.76 0 0)          ← light gray
active item: bg-sidebar-accent + text-[#FABE12]
group labels: text-xs font-medium uppercase tracking-wider
```

### Iconography

- **Primary set:** `@tabler/icons-react` — used throughout dashboard for actions, status indicators, navigation
- **Secondary set:** `lucide-react` — used in some UI primitives and molecule components
- **Treatment:** Linear, thin-stroke. Size conventions: `size-4` (16px) inline, `size-5` (20px) standalone, `size-6` (24px) feature icons
- **Color:** Inherit text color or explicit `text-primary` / `text-muted-foreground`

Do not use Solar icons, Heroicons, or other sets. Keep the icon vocabulary consistent.

## Do's and Don'ts

### Do

- Do use `#FABE12` as the sole primary accent for emphasis and action states.
- Do keep all spacing aligned to the 4px base unit.
- Do apply the glass surface treatment (`rgba(9,9,11,0.8)` + `backdrop-blur` + `border rgba(255,255,255,0.1)`) consistently across dark cards.
- Do keep corner radii within the family: 6px, 8px, 10px, 14px, 15px, 16px, 9999px.
- Do use **Bebas Neue** for headings and **Satoshi** for all body/label text.
- Do use `@tabler/icons-react` as the primary icon source.

### Don't

- Don't use "System Font" or system fallbacks as the intended font — the app ships Satoshi and Bebas Neue locally.
- Don't apply Bebas Neue to body copy, input labels, or small UI text.
- Don't introduce accent colors outside `#FABE12`, `#09090B`, and `#99FF17` unless adding a new semantic state.
- Don't mix unrelated shadow/blur recipes that break the current depth system.
- Don't use Solar icons, Phosphor icons, or Heroicons — use `@tabler/icons-react` or `lucide-react`.
- Don't hardcode hex colors in Tailwind `className` — prefer CSS var tokens (`text-primary`, `bg-primary`, `border-border`). The exceptions already in the codebase are `#F4F4F4` (filter bar borders) and `#121212` (outline button text) — don't add new ones.
- Don't use `rounded-full` for buttons in the dashboard UI — only on the landing page for CTA emphasis.

## Motion

Motion is reserved for element-reveal and hover states.

- **Scroll-triggered reveals:** Words in selected headers animate via GSAP from 110% Y-translate to 0% with `ease: "power3.out"`.
- **Stagger:** 0.03s between words for controlled unfolding.
- **Hover interactions:** Subtle opacity transitions (0ms–500ms) on gradient fills within feature cards.
- **State transitions:** All hover/active/focus changes use `transition-all` or `transition-colors` with consistent timing.

**Motion level:** Moderate

**Durations:** 150ms (micro interactions), 500ms (reveals)

**Easings:** `ease`, `cubic-bezier(0.4, 0, 0.2, 1)`

**Hover patterns:** color, opacity

**Scroll patterns:** gsap-scrolltrigger (GSAP must be added as a dependency if not already present)
