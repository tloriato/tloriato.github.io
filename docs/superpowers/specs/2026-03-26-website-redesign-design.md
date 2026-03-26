# Website Redesign: Jekyll to Astro with Folio & Tract Aesthetic

## Overview

Replace the current Jekyll/minima site with an Astro static site matching the "Folio & Tract" design language from three Variant-generated HTML pages. The site stays on GitHub Pages, content stays in markdown, and the build produces pure static HTML/CSS/JS.

## Goals

- Reproduce the Folio & Tract aesthetic: warm parchment palette, EB Garamond + JetBrains Mono typography, 1px border frame, WebGL halftone shader visuals
- Write standard markdown, get beautiful article rendering with no custom syntax
- Static output deployed to GitHub Pages via GitHub Actions
- Minimal dependencies: Astro + sitemap + RSS, no React

## Branding

- Brand name: "Tiago Loriato" (EB Garamond italic, 1.25rem)
- Subtitle: "A collection of notes, researches, projects, and essays" (JetBrains Mono, 10px, uppercase, muted)
- Left coordinate: `[LAT. 51.5074° N]` (London)
- Right coordinate slot: removed entirely (no SYS references)

## Design Tokens (CSS Custom Properties)

```css
:root {
  --c-bg: #eae6db;
  --c-fg: #2c2a26;
  --c-fg-muted: #8a8578;
  --c-border: #2c2a26;

  --font-serif: 'EB Garamond', serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  --sp-xs: 0.25rem;
  --sp-sm: 0.5rem;
  --sp-md: 1rem;
  --sp-lg: 1.5rem;
  --sp-xl: 3rem;
  --sp-2xl: 6rem;

  --border-width: 1px;
  --frame-padding: 1.5rem;
  --max-text-width: 680px;
}
```

Fonts loaded from Google Fonts (no self-hosted files).

## Project Structure

```
tloriato.github.io/
├── src/
│   ├── layouts/
│   │   ├── Shell.astro            # Outer frame: border, header, viewport padding
│   │   ├── Index.astro            # Two-column: content list left, WebGL right
│   │   └── Article.astro          # Reader: WebGL header band + manuscript column
│   ├── components/
│   │   ├── Header.astro           # Brand bar with coordinates
│   │   ├── EntryItem.astro        # Post row: date + title + abstract
│   │   ├── FilterRibbon.astro     # Category filter tags (ALL, ESSAYS, PROJECTS)
│   │   ├── WebGLCanvas.astro      # Canvas + shader script, accepts variant prop
│   │   ├── GraphicOverlay.astro   # Caption overlay on WebGL column
│   │   └── NavBack.astro          # Vertical "Return to Index" side nav
│   ├── styles/
│   │   └── global.css             # Design tokens, fonts, base reset, markdown element styles
│   └── pages/
│       ├── index.astro            # Home: Index layout with Essays + Projects
│       ├── about.astro            # About: Article layout with about content
│       └── [...slug].astro        # Dynamic route: Article layout per post
├── content/
│   ├── config.ts                  # Content collection schema
│   └── posts/
│       ├── melody-of-time.md
│       ├── the-bullish-case-for-zcash.md
│       ├── kind-candorship.md
│       └── the-scaffolding.md
├── public/
│   ├── assets/                    # Images migrated from current site
│   ├── favicon.ico
│   └── CNAME                      # Custom domain (if applicable)
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions: build + deploy to Pages
```

## Content Collection Schema

```ts
// content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['essay', 'project']),
    draft: z.boolean().optional().default(false),
    preview: z.string().optional(),
  }),
});

export const collections = { posts };
```

### Frontmatter Migration

| Old (Jekyll)            | New (Astro)                |
|-------------------------|----------------------------|
| `categories: [essay]`   | `category: essay`          |
| `categories: [research]`| `category: project`        |
| `type: post`            | removed (implicit)         |
| `tags: [post]`          | removed                    |
| `slug: kind-candorship` | derived from filename      |
| `preview: "/png/..."`   | `preview: "/assets/..."`   |

## Page Layouts

### Shell (wraps every page)

The outermost frame. All pages render inside it.

- `1.5rem` padding from viewport edges
- 1px solid border around the entire shell
- Header bar at top: left coordinate, centered brand, no right element
- Background: `--c-bg` (#eae6db)

### Index Page (`/`)

Two-column layout inside the shell:

- **Left column (32% width on desktop, full-width on mobile)**: scrollable content area
  - Filter ribbon: `ALL` | `ESSAYS` | `PROJECTS` tags
  - "Essays" section header (EB Garamond, 2.2rem) followed by essay entries
  - "Projects" section header followed by project entries
  - Each entry: date in mono (muted) | title in serif (1.35rem) + abstract in mono (9px, uppercase, muted)
- **Right column (68%)**: WebGL canvas with halftone FBM shader, graphic overlay caption in bottom-right
- Breakpoint: columns stack below 1024px, WebGL column gets `min-height: 50vh`

### Article Page (`/{slug}/` and `/about/`)

Full-width within the shell:

- **WebGL header band**: 120px tall, full-width, border-bottom, simpler FBM shader variant
- **Nav back**: fixed vertical text "Return to Index" on left edge, desktop only (hidden below 1024px)
- **Manuscript column**: 680px max-width, centered
  - **Article meta**: date in mono (muted) + title in EB Garamond at 3.5rem, border-bottom
  - **Body**: rendered markdown content with styled elements
  - **Footnotes**: grid layout at bottom if present
- About page: same layout, no date in meta

## Markdown Element Mapping

All standard markdown renders through scoped CSS on the Article layout. No custom syntax, no plugins.

| Markdown                   | Visual Treatment                                                                      |
|----------------------------|---------------------------------------------------------------------------------------|
| `# Heading 1`             | EB Garamond, 3.5rem, weight 400 (article title — rarely used in body)                |
| `## Heading 2`            | Section marker: JetBrains Mono, 11px, uppercase, letter-spacing 0.2em, muted color   |
| `### Heading 3`           | EB Garamond, 1.5rem, weight 400                                                      |
| `#### Heading 4`          | JetBrains Mono, 12px, uppercase, letter-spacing 0.1em                                |
| Paragraph                 | EB Garamond, 1.25rem, line-height 1.7, justified, color #333                         |
| `> Blockquote`            | Pull quote: bordered top/bottom, EB Garamond italic 1.75rem, negative margin desktop, decorative `"` |
| `**Bold**`                | EB Garamond 500 weight                                                                |
| `*Italic*`                | EB Garamond italic                                                                    |
| `` `inline code` ``       | JetBrains Mono, slightly smaller, subtle background                                   |
| ```` ```code block``` ```` | JetBrains Mono, 13px, full-width box with 1px border, stays in palette (no dark theme)|
| `[link](url)`             | Color `--c-fg`, underline, monochrome                                                 |
| `![image](url)`           | Full manuscript-width, 1px border, alt text as caption below                          |
| `- list item`             | EB Garamond body size, left margin, `·` or `—` bullet                                |
| `1. ordered list`         | Same, JetBrains Mono numerals                                                         |
| `---` horizontal rule     | 1px solid `--c-border`, vertical margin `--sp-xl`                                     |
| `[^1]` footnote           | Superscript in body, grid-layout footnote section at bottom (JetBrains Mono, 10px, muted) |

## WebGL Shaders

### Index Shader (right column)

FBM halftone topography from design two:

- 80-dot-scale grid
- Fractal Brownian Motion height field, animated with slow flow
- Quantized height → dot radius (halftone effect)
- Scanning interference line for digital artifacting
- Peak highlights with lighter foreground color
- Subtle static noise on background

### Article Shader (120px header band)

Simpler variant from design one:

- 60-dot-scale grid
- Same FBM base, no scanlines
- No highlights, no static noise
- Subtle, non-competing with reading

### Implementation

- Plain WebGL, no libraries — vertex/fragment shaders inline
- Single Astro component (`WebGLCanvas.astro`) with a `variant` prop (`"index"` | `"article"`)
- Reads CSS custom properties for colors so shader matches palette
- `requestAnimationFrame` loop gated by IntersectionObserver (pauses when not visible)

### Fallback

If WebGL is unavailable: CSS `radial-gradient` repeating pattern that echoes the halftone dot aesthetic. Static but visually consistent.

## Category Filtering

Client-side JS on the index page (~15 lines):

- Three filter tags: `ALL`, `ESSAYS`, `PROJECTS`
- Active tag: 1px border, slight background fill, `●` prefix
- Click toggles `data-category` sections via display property
- Default: `ALL` active, both sections visible
- No URL changes, no page reload

## Routing & Redirects

| URL               | Page                    |
|--------------------|------------------------|
| `/`                | Index                  |
| `/about/`          | About (article layout) |
| `/{slug}/`         | Post (article layout)  |

### Redirect Map (preserving old Jekyll URLs)

| Old URL                                     | New URL                        |
|---------------------------------------------|--------------------------------|
| `/essay/melody-of-time/`                    | `/melody-of-time/`             |
| `/research/the-bullish-case-for-zcash/`     | `/the-bullish-case-for-zcash/` |
| `/essay/kind-candorship/`                   | `/kind-candorship/`            |
| `/essay/the-scaffolding/`                   | `/the-scaffolding/`            |

Implemented via Astro's `astro-redirect` or static `<meta http-equiv="refresh">` pages generated at the old paths.

## Build & Deployment

### Astro Config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tloriato.github.io',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'min-light', // light theme to stay in palette
    },
  },
});
```

### GitHub Actions

Trigger on push to `main`. Steps:
1. Checkout
2. Setup Node
3. `npm ci`
4. `npm run build`
5. Deploy via `actions/deploy-pages@v4`

Uses Astro's official GitHub Pages deployment pattern.

### Dependencies

- `astro`
- `@astrojs/sitemap`
- `@astrojs/rss`

Three packages total. No React, no Tailwind, no heavy toolchain.

### Assets Migration

- `assets/png/*` → `public/assets/png/*`
- `assets/favicon.ico` → `public/favicon.ico`
- `CNAME` → `public/CNAME`
- Self-hosted fonts removed (using Google Fonts)

## What Gets Removed

- `Gemfile`, `Gemfile.lock`
- `_config.yml`
- `_layouts/`, `_includes/`, `_sass/`
- `_drafts/`
- `assets/css/` (Jekyll custom CSS)
- `assets/fonts/` (self-hosted fonts)
- `index.md`, `404.md`
- `about/index.md`, `essay/index.md`, `research/index.md`, `notebook/index.md`
- All minima theme dependencies

## Responsive Behavior

- **Desktop (>1024px)**: two-column index, side nav on articles, full shell frame
- **Mobile (<1024px)**: single column, stacked layout, side nav hidden, pull quotes lose negative margin, WebGL column gets `min-height: 50vh`
- Frame padding and borders persist at all sizes
