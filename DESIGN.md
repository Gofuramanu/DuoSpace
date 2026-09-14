---
name: Scholarly Precision
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1e'
  on-tertiary-container: '#818486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is engineered for high-performance academic and research environments. It prioritizes information density without sacrificing clarity, evoking a sense of calm authority and analytical rigor. 

The aesthetic is **Corporate / Modern** with a lean toward **Minimalism**. It utilizes a structured card-based architecture to organize complex datasets into digestible modules. The interface should feel like a high-end laboratory instrument: precise, reliable, and unobtrusive. The emotional response is one of "organized intelligence"—where the user feels empowered by the data rather than overwhelmed by it.

## Colors
The palette is anchored by a deep navy primary to establish academic authority. A vibrant blue accent is used sparingly to direct attention toward primary actions and interactive elements. 

- **Primary (#0F172A):** Used for navigation, headers, and high-level structural elements.
- **Accent (#3B82F6):** Reserved for buttons, active states, and focus indicators.
- **Backgrounds:** The interface uses a tiered slate system. The main canvas is `Slate-50`, while surface cards are pure white to create a clear "lift" from the background.
- **Semantic Colors:** Emerald, Amber, and Rose are utilized strictly for status communication (Success, Pending, Urgent) to ensure cognitive load is minimized during rapid data scanning.

## Typography
This design system utilizes **Inter** exclusively to maintain a cohesive, systematic appearance. The type scale is optimized for legibility in data-heavy environments.

- **Headlines:** Use tighter letter-spacing and heavier weights to provide clear section anchoring.
- **Body:** The default 14px size for `body-md` is the workhorse for table data and descriptions, providing high density while maintaining a comfortable line height.
- **Labels:** Small caps or bolded 12px labels are used for metadata, tags, and table headers to distinguish them from actionable data content.

## Layout & Spacing
The layout follows a **fluid grid** model with a max-width container for desktop viewing. 

- **Grid:** A 12-column system is used for the main dashboard content. Cards should span 3, 4, 6, or 12 columns depending on the complexity of the visualization.
- **Rhythm:** An 8px linear scale (with 4px increments for tight components) ensures vertical harmony. 
- **Margins:** 24px margins on mobile, scaling to 32px or more on desktop to allow the content "room to breathe" and reduce visual stress.
- **Density:** Provide a "compact" toggle for tables that reduces vertical padding from 12px to 8px for power users.

## Elevation & Depth
Depth is achieved through **Tonal Layers** supplemented by **Ambient Shadows**. 

- **Level 0 (Canvas):** `Slate-50` background.
- **Level 1 (Cards):** Pure White surface with a `1px` border of `Slate-200` and a very soft, diffused shadow (0px 4px 6px -1px rgba(15, 23, 42, 0.05)).
- **Level 2 (Hover/Modals):** Increased shadow depth (0px 10px 15px -3px rgba(15, 23, 42, 0.1)) to indicate interactivity or focus.
- **Outlines:** Subtle `1px` inner strokes are used instead of heavy shadows to keep the interface looking "flat" and modern.

## Shapes
The design system uses a **Rounded** language to soften the analytical nature of the data.

- **Components:** Standard buttons and input fields use 0.5rem (rounded-md).
- **Containers:** Dashboard cards and main content areas use 1rem (rounded-lg) or 1.5rem (rounded-xl) to create a distinct modular feel.
- **Badges:** Use a pill-shaped (full round) geometry to distinguish status indicators from clickable buttons.

## Components
- **Buttons:** Primary buttons use a solid `#3B82F6` fill with white text. Secondary buttons use a `Slate-100` background with Navy text. Transitions should be a subtle 150ms ease.
- **Input Fields:** Use a white background with a `Slate-200` border. On focus, the border shifts to the Accent Blue with a 2px outer glow.
- **Cards:** Cards are the primary container. They must include a `headline-sm` title and optional header actions. Internal padding should be a consistent 24px.
- **Chips/Badges:** Small, high-contrast text on a low-opacity version of the semantic color (e.g., Emerald text on 10% opacity Emerald background).
- **Lists/Tables:** Use `Slate-50` zebra-striping for long tables. Row height should be 48px to accommodate `body-md` text comfortably.
- **Icons:** Use Lucide-style line icons with a 1.5px or 2px stroke weight. Match the icon color to the text color of the parent element.
- **Data Visualizations:** Charts should utilize the primary and accent colors as the main data series, with a palette of secondary "cool" tones (teals, indigos) for multi-series data.