# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jekyll/minima site with an Astro static site matching the Folio & Tract design language — warm parchment palette, EB Garamond + JetBrains Mono typography, WebGL halftone shaders, and full markdown element styling.

**Architecture:** Astro static site with content collections for markdown posts, Astro components for the shell/header/entry list/WebGL canvas, scoped CSS for markdown rendering, and GitHub Actions for deployment to GitHub Pages.

**Tech Stack:** Astro 5, @astrojs/sitemap, @astrojs/rss, plain WebGL (no libraries), Google Fonts (EB Garamond + JetBrains Mono)

**Spec:** `docs/superpowers/specs/2026-03-26-website-redesign-design.md`

---

## File Map

### New files to create

| File | Responsibility |
|------|---------------|
| `astro.config.mjs` | Astro configuration: static output, site URL, sitemap, shiki theme |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config for Astro |
| `src/styles/global.css` | Design tokens, Google Fonts import, base reset, full markdown element styles |
| `src/components/Header.astro` | Brand bar: London coordinates left, name + subtitle centered |
| `src/layouts/Shell.astro` | Outer frame: viewport padding, 1px border, Header, slot for content |
| `src/components/EntryItem.astro` | Post row: date + title + abstract, link wrapper |
| `src/components/FilterRibbon.astro` | Category filter tags with client-side toggle JS |
| `src/components/WebGLCanvas.astro` | Canvas element + inline shader scripts, variant prop, IntersectionObserver, CSS fallback |
| `src/components/GraphicOverlay.astro` | Caption overlay positioned on WebGL column |
| `src/components/NavBack.astro` | Vertical "Return to Index" fixed side nav |
| `src/layouts/Index.astro` | Two-column layout: content list left, WebGL right, uses Shell |
| `src/layouts/Article.astro` | Reader layout: WebGL header band, manuscript column, NavBack, uses Shell |
| `src/pages/index.astro` | Home page: queries posts, renders Index layout with Essays + Projects sections |
| `src/pages/about.astro` | About page: renders Article layout with about content |
| `src/pages/[...slug].astro` | Dynamic route: renders each post in Article layout |
| `content/config.ts` | Content collection schema (title, description, date, category, draft, preview) |
| `content/posts/melody-of-time.md` | Migrated post with updated frontmatter |
| `content/posts/the-bullish-case-for-zcash.md` | Migrated post with updated frontmatter |
| `content/posts/kind-candorship.md` | Migrated post with updated frontmatter |
| `content/posts/the-scaffolding.md` | Migrated post with updated frontmatter |
| `src/pages/rss.xml.ts` | RSS feed endpoint |
| `src/pages/essay/melody-of-time.astro` | Redirect from old URL |
| `src/pages/essay/kind-candorship.astro` | Redirect from old URL |
| `src/pages/essay/the-scaffolding.astro` | Redirect from old URL |
| `src/pages/research/the-bullish-case-for-zcash.astro` | Redirect from old URL |
| `.github/workflows/deploy.yml` | GitHub Actions: build Astro + deploy to Pages |

### Files to move

| From | To |
|------|-----|
| `assets/png/*` | `public/assets/png/*` |
| `assets/favicon.ico` | `public/favicon.ico` |
| `CNAME` | `public/CNAME` |
| `assets/profile.jpeg` | `public/assets/profile.jpeg` |

### Files to delete (after Astro site is complete)

All Jekyll files: `_config.yml`, `Gemfile`, `Gemfile.lock`, `_layouts/`, `_includes/`, `_sass/`, `_posts/`, `_drafts/`, `assets/css/`, `assets/fonts/`, `assets/icons.svg`, `assets/header.png`, `assets/pixel-char.png`, `index.md`, `404.md`, `about/index.md`, `essay/index.md`, `research/index.md`, `notebook/index.md`, `frontmatter.json`, `.frontmatter/`, `.github/workflows/cron-build-page.yml`

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore` (update existing)

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "tloriato-github-io",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

Write this to `package.json`.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install astro @astrojs/sitemap @astrojs/rss
```

Expected: 3 packages added, `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 3: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tloriato.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'min-light',
    },
  },
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 5: Update .gitignore**

Add these lines to the existing `.gitignore`:

```
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Verify Astro runs**

Run:
```bash
npm run dev
```

Expected: Astro dev server starts. It will warn about missing pages — that's fine. Kill the server after confirming it starts.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: scaffold Astro project with sitemap and rss"
```

---

## Task 2: Global Styles — Design Tokens, Fonts, Base Reset

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global.css with design tokens, font imports, and base reset**

```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap');

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

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--c-bg);
  color: var(--c-fg);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  padding: var(--frame-padding);
  display: flex;
  flex-direction: column;
}

a {
  color: var(--c-fg);
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add global CSS with design tokens, fonts, and base reset"
```

---

## Task 3: Header Component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create Header.astro**

```astro
---
---
<header class="header">
  <div class="coord">[LAT. 51.5074° N]</div>
  <a href="/" class="brand">
    Tiago Loriato
    <span>A collection of notes, researches, projects, and essays</span>
  </a>
</header>

<style>
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    border-bottom: var(--border-width) solid var(--c-border);
    background: var(--c-bg);
  }

  .coord {
    color: var(--c-fg);
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: var(--sp-md) var(--sp-lg);
    display: flex;
    align-items: center;
    border-right: var(--border-width) solid var(--c-border);
    white-space: nowrap;
  }

  .brand {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-style: italic;
    flex: 1;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: var(--sp-md);
    padding: var(--sp-md);
    text-decoration: none;
    color: inherit;
  }

  .brand span {
    font-family: var(--font-mono);
    font-size: 10px;
    font-style: normal;
    color: var(--c-fg-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Header component with brand and coordinates"
```

---

## Task 4: Shell Layout

**Files:**
- Create: `src/layouts/Shell.astro`

- [ ] **Step 1: Create Shell.astro**

```astro
---
import Header from '../components/Header.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'A collection of notes, researches, projects, and essays.' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Tiago Loriato</title>
  <meta name="description" content={description} />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
</head>
<body>
  <div class="shell">
    <Header />
    <slot />
  </div>
</body>
</html>

<style>
  .shell {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: var(--border-width) solid var(--c-border);
    position: relative;
    background: var(--c-bg);
    overflow: hidden;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Shell.astro
git commit -m "feat: add Shell layout with head, header, and border frame"
```

---

## Task 5: Content Collection and Post Migration

**Files:**
- Create: `content/config.ts`
- Create: `content/posts/melody-of-time.md`
- Create: `content/posts/the-bullish-case-for-zcash.md`
- Create: `content/posts/kind-candorship.md`
- Create: `content/posts/the-scaffolding.md`

- [ ] **Step 1: Create content/config.ts**

```ts
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

- [ ] **Step 2: Migrate melody-of-time.md**

Copy `_posts/2023-05-20-melody-of-time.md` to `content/posts/melody-of-time.md`. Replace the frontmatter with:

```yaml
---
title: Melody of Time
description: An introspective prose about the journey from first employee of a startup
date: 2023-05-20
category: essay
preview: "/assets/png/1_Z6sX1TrcSUX_ZNhh9hfWfQ.webp"
---
```

Keep the body content unchanged.

- [ ] **Step 3: Migrate the-bullish-case-for-zcash.md**

Copy `_posts/2025-01-18-the-bullish-case-for-zcash.md` to `content/posts/the-bullish-case-for-zcash.md`. Replace the frontmatter with:

```yaml
---
title: The Bullish Case for Zcash
description: "Why Zcash may be the best investment in the second half of the 2020s"
date: 2025-01-18
category: project
preview: "/assets/png/zcash-primary-black-white-logo-preview.png"
---
```

Keep the body content unchanged.

- [ ] **Step 4: Migrate kind-candorship.md**

Copy `_posts/2025-07-07-kind-candorship.md` to `content/posts/kind-candorship.md`. Replace the frontmatter with:

```yaml
---
title: Kind Candorship
description: A reflection on the high cost of being a 'straight shooter' and the personal journey toward a more effective leadership philosophy.
date: 2025-07-07
category: essay
---
```

Keep the body content unchanged.

- [ ] **Step 5: Migrate the-scaffolding.md**

Copy `_posts/2026-03-26-the-scaffolding.md` to `content/posts/the-scaffolding.md`. Replace the frontmatter with:

```yaml
---
title: The Scaffolding
description: A farewell letter to Teya — on Friday night bugs, the scaffolding that grows around us, and closing the distance between you and the work.
date: 2026-03-26
category: essay
---
```

Keep the body content unchanged.

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat: add content collection schema and migrate all posts"
```

---

## Task 6: Migrate Static Assets

**Files:**
- Move: `assets/png/*` → `public/assets/png/*`
- Move: `assets/favicon.ico` → `public/favicon.ico`
- Move: `assets/profile.jpeg` → `public/assets/profile.jpeg`
- Move: `CNAME` → `public/CNAME`

- [ ] **Step 1: Create public directories and copy assets**

```bash
mkdir -p public/assets/png
cp assets/png/* public/assets/png/
cp assets/favicon.ico public/favicon.ico
cp assets/profile.jpeg public/assets/profile.jpeg
cp CNAME public/CNAME
```

- [ ] **Step 2: Commit**

```bash
git add public/
git commit -m "chore: migrate static assets to public/"
```

---

## Task 7: EntryItem Component

**Files:**
- Create: `src/components/EntryItem.astro`

- [ ] **Step 1: Create EntryItem.astro**

```astro
---
interface Props {
  href: string;
  date: Date;
  title: string;
  abstract: string;
}

const { href, date, title, abstract } = Astro.props;

const year = date.getFullYear();
---
<a href={href} class="entry-item">
  <span class="entry-date">{year}</span>
  <div class="entry-details">
    <h2 class="entry-title">{title}</h2>
    <p class="entry-abstract">{abstract}</p>
  </div>
</a>

<style>
  .entry-item {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: var(--sp-md);
    padding: var(--sp-lg);
    border-bottom: var(--border-width) solid var(--c-border);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.2s ease;
    align-items: flex-start;
  }

  .entry-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .entry-date {
    font-size: 11px;
    color: var(--c-fg-muted);
    margin-top: 4px;
  }

  .entry-details {
    display: flex;
    flex-direction: column;
    gap: var(--sp-sm);
  }

  .entry-title {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    line-height: 1.2;
    margin: 0;
    font-weight: 400;
    color: var(--c-fg);
  }

  .entry-abstract {
    font-family: var(--font-mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--c-fg-muted);
    max-width: 90%;
    line-height: 1.5;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EntryItem.astro
git commit -m "feat: add EntryItem component"
```

---

## Task 8: FilterRibbon Component

**Files:**
- Create: `src/components/FilterRibbon.astro`

- [ ] **Step 1: Create FilterRibbon.astro**

```astro
---
interface Props {
  categories: string[];
}

const { categories } = Astro.props;
---
<div class="filter-ribbon">
  <button class="filter-tag active" data-filter="all">ALL</button>
  {categories.map((cat) => (
    <button class="filter-tag" data-filter={cat}>
      {cat.toUpperCase()}
    </button>
  ))}
</div>

<script>
  const ribbon = document.querySelector('.filter-ribbon');
  if (ribbon) {
    ribbon.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('filter-tag')) return;

      const filter = target.dataset.filter;

      ribbon.querySelectorAll('.filter-tag').forEach((tag) => {
        tag.classList.remove('active');
      });
      target.classList.add('active');

      document.querySelectorAll('[data-category]').forEach((section) => {
        const el = section as HTMLElement;
        if (filter === 'all' || el.dataset.category === filter) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
    });
  }
</script>

<style>
  .filter-ribbon {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-sm);
    padding: var(--sp-md) var(--sp-lg);
    border-bottom: var(--border-width) solid var(--c-border);
    background: var(--c-bg);
  }

  .filter-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 2px 8px;
    border: var(--border-width) solid var(--c-fg-muted);
    color: var(--c-fg-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
  }

  .filter-tag:hover,
  .filter-tag.active {
    border-color: var(--c-fg);
    color: var(--c-fg);
    background: rgba(0, 0, 0, 0.05);
  }

  .filter-tag.active::before {
    content: '\25CF ';
    font-size: 8px;
    vertical-align: middle;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FilterRibbon.astro
git commit -m "feat: add FilterRibbon component with client-side category toggle"
```

---

## Task 9: WebGLCanvas Component

**Files:**
- Create: `src/components/WebGLCanvas.astro`

- [ ] **Step 1: Create WebGLCanvas.astro**

This is the largest component. It contains both shader variants (index and article) and the IntersectionObserver for performance gating, plus the CSS fallback.

```astro
---
interface Props {
  variant: 'index' | 'article';
}

const { variant } = Astro.props;
const canvasId = `glcanvas-${variant}`;
---
<div class="webgl-wrapper" data-variant={variant}>
  <canvas id={canvasId} class="gl-canvas"></canvas>
</div>

<script define:vars={{ canvasId, variant }}>
  const canvas = document.getElementById(canvasId);
  const gl = canvas?.getContext('webgl');

  if (gl && canvas) {
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() { gl_Position = aVertexPosition; }
    `;

    const indexFs = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_color_bg;
      uniform vec3 u_color_fg;
      uniform vec3 u_color_accent;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(st);
          st = rot * st * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;
        float scale = 80.0;
        vec2 grid_st = floor(st * scale);
        vec2 local_st = fract(st * scale) - 0.5;
        vec2 flow = vec2(u_time * 0.02, u_time * 0.015);
        float height = fbm(grid_st * 0.05 + flow);
        float bands = floor(height * 8.0) / 8.0;
        float max_radius = 0.45;
        float radius = bands * max_radius;
        float dist = length(local_st);
        float shape = step(dist, radius);
        float scanline = sin(gl_FragCoord.y * 1.5 - u_time * 10.0) * 0.04;
        float final_shape = step(dist, radius + scanline);
        vec3 final_color = mix(u_color_bg, u_color_accent, final_shape);
        float highlight = step(dist, radius * 0.3) * step(0.6, bands);
        final_color = mix(final_color, u_color_fg, highlight * final_shape);
        float static_noise = random(gl_FragCoord.xy * u_time * 0.001) * 0.03;
        final_color += static_noise * (1.0 - final_shape);
        gl_FragColor = vec4(final_color, 1.0);
      }
    `;

    const articleFs = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_color_bg;
      uniform vec3 u_color_accent;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(st);
          st = rot * st * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;
        float scale = 60.0;
        vec2 grid_st = floor(st * scale);
        vec2 local_st = fract(st * scale) - 0.5;
        float height = fbm(grid_st * 0.05 + vec2(u_time * 0.01));
        float bands = floor(height * 6.0) / 6.0;
        float shape = step(length(local_st), bands * 0.45);
        vec3 final_color = mix(u_color_bg, u_color_accent, shape);
        gl_FragColor = vec4(final_color, 1.0);
      }
    `;

    const fsSource = variant === 'index' ? indexFs : articleFs;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const posLoc = gl.getAttribLocation(program, 'aVertexPosition');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const bgLoc = gl.getUniformLocation(program, 'u_color_bg');
    const fgLoc = gl.getUniformLocation(program, 'u_color_fg');
    const accentLoc = gl.getUniformLocation(program, 'u_color_accent');

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,1,1,-1,-1,1,-1]), gl.STATIC_DRAW);

    function hexToRgb(hex) {
      return [
        parseInt(hex.substring(1,3), 16) / 255,
        parseInt(hex.substring(3,5), 16) / 255,
        parseInt(hex.substring(5,7), 16) / 255,
      ];
    }

    const style = getComputedStyle(document.documentElement);
    const bgRgb = hexToRgb(style.getPropertyValue('--c-bg').trim());
    const fgRgb = hexToRgb(style.getPropertyValue('--c-fg').trim());
    const accentRgb = hexToRgb(style.getPropertyValue('--c-border').trim());

    const startTime = Date.now();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    function render() {
      if (isVisible) {
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000.0);
        gl.uniform3fv(bgLoc, bgRgb);
        if (fgLoc) gl.uniform3fv(fgLoc, fgRgb);
        if (accentLoc) gl.uniform3fv(accentLoc, accentRgb);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(render);
    }
    render();
  } else if (canvas) {
    canvas.classList.add('no-webgl');
  }
</script>

<style>
  .webgl-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .gl-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .gl-canvas.no-webgl {
    background-image: radial-gradient(circle, var(--c-fg) 1px, transparent 1px);
    background-size: 8px 8px;
    opacity: 0.15;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WebGLCanvas.astro
git commit -m "feat: add WebGLCanvas component with index/article shader variants and fallback"
```

---

## Task 10: GraphicOverlay and NavBack Components

**Files:**
- Create: `src/components/GraphicOverlay.astro`
- Create: `src/components/NavBack.astro`

- [ ] **Step 1: Create GraphicOverlay.astro**

```astro
---
interface Props {
  caption: string;
  detail?: string;
}

const { caption, detail } = Astro.props;
---
<div class="graphic-overlay">
  <div class="graphic-caption">{caption}</div>
  {detail && <div class="graphic-caption detail">{detail}</div>}
</div>

<style>
  .graphic-overlay {
    position: absolute;
    bottom: var(--sp-lg);
    right: var(--sp-lg);
    background: var(--c-bg);
    border: var(--border-width) solid var(--c-border);
    padding: var(--sp-sm) var(--sp-md);
    text-align: left;
    pointer-events: none;
    display: flex;
    flex-direction: row;
    gap: var(--sp-md);
  }

  .graphic-caption {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--c-fg);
  }

  .graphic-caption.detail {
    color: var(--c-fg-muted);
  }
</style>
```

- [ ] **Step 2: Create NavBack.astro**

```astro
---
---
<a href="/" class="nav-back">Return to Index</a>

<style>
  .nav-back {
    position: fixed;
    left: calc(var(--frame-padding) + var(--sp-lg));
    top: 50%;
    transform: translateY(-50%);
    writing-mode: vertical-rl;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 10px;
    color: var(--c-fg-muted);
    text-decoration: none;
    border-right: var(--border-width) solid var(--c-border);
    padding-right: var(--sp-sm);
  }

  .nav-back:hover {
    color: var(--c-fg);
  }

  @media (max-width: 1024px) {
    .nav-back {
      display: none;
    }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GraphicOverlay.astro src/components/NavBack.astro
git commit -m "feat: add GraphicOverlay and NavBack components"
```

---

## Task 11: Index Layout

**Files:**
- Create: `src/layouts/Index.astro`

- [ ] **Step 1: Create Index.astro**

```astro
---
import Shell from './Shell.astro';
import WebGLCanvas from '../components/WebGLCanvas.astro';
import GraphicOverlay from '../components/GraphicOverlay.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---
<Shell title={title} description={description}>
  <main class="main-grid">
    <div class="content-col">
      <slot />
    </div>
    <div class="graphic-col">
      <WebGLCanvas variant="index" />
      <GraphicOverlay caption="Fig 1. Procedural Halftone Topography" detail="Scale 1:1000" />
    </div>
  </main>
</Shell>

<style>
  .main-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    min-height: 0;
  }

  @media (min-width: 1024px) {
    .main-grid {
      grid-template-columns: 32% 68%;
    }
  }

  .content-col {
    padding: 0;
    border-right: var(--border-width) solid transparent;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  @media (min-width: 1024px) {
    .content-col {
      border-right-color: var(--c-border);
    }
  }

  .graphic-col {
    position: relative;
    background: var(--c-bg);
    overflow: hidden;
    min-height: 50vh;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Index.astro
git commit -m "feat: add Index layout with two-column grid and WebGL panel"
```

---

## Task 12: Article Layout with Markdown Styles

**Files:**
- Create: `src/layouts/Article.astro`

- [ ] **Step 1: Create Article.astro**

This is the largest layout — it includes the WebGL header band, manuscript column, and all markdown element styling.

```astro
---
import Shell from './Shell.astro';
import WebGLCanvas from '../components/WebGLCanvas.astro';
import NavBack from '../components/NavBack.astro';

interface Props {
  title: string;
  description?: string;
  date?: Date;
}

const { title, description, date } = Astro.props;

const formattedDate = date
  ? date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  : null;
---
<Shell title={title} description={description}>
  <div class="reader-container">
    <div class="visual-header-band">
      <WebGLCanvas variant="article" />
    </div>

    <NavBack />

    <article class="manuscript">
      <header class="article-meta">
        {formattedDate && <span class="article-date">{formattedDate}</span>}
        <h1 class="article-title">{title}</h1>
      </header>

      <div class="prose">
        <slot />
      </div>
    </article>
  </div>
</Shell>

<style>
  .reader-container {
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  .visual-header-band {
    height: 120px;
    border-bottom: var(--border-width) solid var(--c-border);
    position: relative;
    overflow: hidden;
  }

  .manuscript {
    max-width: var(--max-text-width);
    margin: 0 auto;
    padding: var(--sp-2xl) var(--sp-lg);
    position: relative;
  }

  .article-meta {
    margin-bottom: var(--sp-xl);
    border-bottom: var(--border-width) solid var(--c-border);
    padding-bottom: var(--sp-md);
  }

  .article-date {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--c-fg-muted);
    margin-bottom: var(--sp-sm);
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .article-title {
    font-family: var(--font-serif);
    font-size: 3.5rem;
    line-height: 1;
    font-weight: 400;
    margin-bottom: var(--sp-md);
  }

  /* --- Markdown element styles (prose) --- */

  .prose :global(h1) {
    font-family: var(--font-serif);
    font-size: 3.5rem;
    line-height: 1;
    font-weight: 400;
    margin: var(--sp-2xl) 0 var(--sp-md) 0;
  }

  .prose :global(h2) {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--c-fg-muted);
    display: block;
    margin: var(--sp-2xl) 0 var(--sp-md) 0;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 400;
  }

  .prose :global(h3) {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 400;
    margin: var(--sp-xl) 0 var(--sp-md) 0;
  }

  .prose :global(h4) {
    font-family: var(--font-mono);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
    margin: var(--sp-xl) 0 var(--sp-md) 0;
  }

  .prose :global(h5),
  .prose :global(h6) {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--c-fg-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 400;
    margin: var(--sp-lg) 0 var(--sp-sm) 0;
  }

  .prose :global(p) {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    line-height: 1.7;
    margin-bottom: var(--sp-lg);
    color: #333;
    text-align: justify;
  }

  .prose :global(blockquote) {
    margin: var(--sp-xl) calc(var(--sp-xl) * -1);
    padding: var(--sp-lg);
    border-top: var(--border-width) solid var(--c-border);
    border-bottom: var(--border-width) solid var(--c-border);
    border-left: none;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.75rem;
    line-height: 1.3;
    color: var(--c-fg);
    position: relative;
  }

  .prose :global(blockquote)::before {
    content: '\201C';
    position: absolute;
    left: -1rem;
    top: 0.5rem;
    font-size: 4rem;
    opacity: 0.1;
  }

  .prose :global(blockquote p) {
    font-family: inherit;
    font-style: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    text-align: left;
    margin-bottom: 0;
  }

  .prose :global(strong) {
    font-weight: 500;
  }

  .prose :global(em) {
    font-style: italic;
  }

  .prose :global(code) {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: rgba(0, 0, 0, 0.04);
    padding: 0.15em 0.3em;
    border-radius: 2px;
  }

  .prose :global(pre) {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.5;
    border: var(--border-width) solid var(--c-border);
    padding: var(--sp-lg);
    overflow-x: auto;
    margin-bottom: var(--sp-lg);
  }

  .prose :global(pre code) {
    background: none;
    padding: 0;
    font-size: inherit;
  }

  .prose :global(a) {
    color: var(--c-fg);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  .prose :global(a:hover) {
    opacity: 0.7;
  }

  .prose :global(img) {
    max-width: 100%;
    height: auto;
    display: block;
    border: var(--border-width) solid var(--c-border);
    margin-bottom: var(--sp-lg);
  }

  .prose :global(ul) {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    line-height: 1.7;
    color: #333;
    list-style: none;
    padding-left: var(--sp-lg);
    margin-bottom: var(--sp-lg);
  }

  .prose :global(ul li) {
    position: relative;
    padding-left: var(--sp-md);
    margin-bottom: var(--sp-sm);
  }

  .prose :global(ul li)::before {
    content: '\2014';
    position: absolute;
    left: calc(var(--sp-md) * -1);
    color: var(--c-fg-muted);
  }

  .prose :global(ol) {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    line-height: 1.7;
    color: #333;
    list-style: none;
    padding-left: var(--sp-lg);
    margin-bottom: var(--sp-lg);
    counter-reset: ol-counter;
  }

  .prose :global(ol li) {
    position: relative;
    padding-left: var(--sp-md);
    margin-bottom: var(--sp-sm);
    counter-increment: ol-counter;
  }

  .prose :global(ol li)::before {
    content: counter(ol-counter);
    position: absolute;
    left: calc(var(--sp-md) * -1);
    font-family: var(--font-mono);
    font-size: 0.75em;
    color: var(--c-fg-muted);
  }

  .prose :global(hr) {
    border: none;
    border-top: var(--border-width) solid var(--c-border);
    margin: var(--sp-xl) 0;
  }

  .prose :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: 12px;
    margin-bottom: var(--sp-lg);
  }

  .prose :global(th),
  .prose :global(td) {
    border: var(--border-width) solid var(--c-border);
    padding: var(--sp-sm) var(--sp-md);
    text-align: left;
  }

  .prose :global(th) {
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 10px;
  }

  /* Footnotes — rendered by remark at end of content */
  .prose :global(.footnotes) {
    margin-top: var(--sp-2xl);
    padding-top: var(--sp-lg);
    border-top: var(--border-width) solid var(--c-border);
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--c-fg-muted);
  }

  .prose :global(.footnotes ol) {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--c-fg-muted);
  }

  .prose :global(.footnotes li) {
    margin-bottom: var(--sp-sm);
  }

  .prose :global(.footnotes li p) {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--c-fg-muted);
    text-align: left;
    margin-bottom: 0;
  }

  .prose :global(sup a) {
    font-family: var(--font-mono);
    font-size: 0.7em;
    text-decoration: none;
    color: var(--c-fg-muted);
  }

  @media (max-width: 1024px) {
    .prose :global(blockquote) {
      margin: var(--sp-xl) 0;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Article.astro
git commit -m "feat: add Article layout with full markdown element styling"
```

---

## Task 13: Index Page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create index.astro**

```astro
---
import { getCollection } from 'astro:content';
import Index from '../layouts/Index.astro';
import FilterRibbon from '../components/FilterRibbon.astro';
import EntryItem from '../components/EntryItem.astro';

const allPosts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const essays = allPosts.filter((p) => p.data.category === 'essay');
const projects = allPosts.filter((p) => p.data.category === 'project');
---
<Index title="Tiago Loriato">
  <FilterRibbon categories={['essays', 'projects']} />

  <section data-category="essays">
    <div class="section-label">Essays</div>
    <div class="entry-list">
      {essays.map((post) => (
        <EntryItem
          href={`/${post.slug}/`}
          date={post.data.date}
          title={post.data.title}
          abstract={post.data.description}
        />
      ))}
    </div>
  </section>

  <section data-category="projects">
    <div class="section-label">Projects</div>
    <div class="entry-list">
      {projects.map((post) => (
        <EntryItem
          href={`/${post.slug}/`}
          date={post.data.date}
          title={post.data.title}
          abstract={post.data.description}
        />
      ))}
    </div>
  </section>
</Index>

<style>
  .section-label {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    line-height: 1.1;
    font-weight: 400;
    color: var(--c-fg);
    padding: var(--sp-xl) var(--sp-lg);
    margin: 0;
    border-bottom: var(--border-width) solid var(--c-border);
    background: var(--c-bg);
  }

  .entry-list {
    display: flex;
    flex-direction: column;
  }
</style>
```

- [ ] **Step 2: Verify the dev server renders the index**

Run:
```bash
npm run dev
```

Expected: Dev server starts. Navigate to `http://localhost:4321/`. You should see the shell frame, header with brand and coordinates, two-column layout with essay/project entries on the left, WebGL shader on the right. Filter tags toggle sections.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add index page with post listings and category sections"
```

---

## Task 14: Article Dynamic Route (Post Pages)

**Files:**
- Create: `src/pages/[...slug].astro`

- [ ] **Step 1: Create [...slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import Article from '../layouts/Article.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<Article title={post.data.title} description={post.data.description} date={post.data.date}>
  <Content />
</Article>
```

- [ ] **Step 2: Verify a post renders**

With the dev server running, navigate to `http://localhost:4321/the-scaffolding/`. Expected: article page with WebGL header band, title "The Scaffolding", date, and the body text styled in EB Garamond with justified paragraphs.

- [ ] **Step 3: Commit**

```bash
git add src/pages/[...slug].astro
git commit -m "feat: add dynamic route for post pages"
```

---

## Task 15: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

```astro
---
import Article from '../layouts/Article.astro';
---
<Article title="About" description="About Tiago Loriato">
  <div class="prose-content">
    <p>Hi friends! My name is Tiago Loriato, and welcome to my website!</p>

    <h2>Background</h2>
    <p>Tiago Loriato</p>

    <h2>Contact</h2>
    <p><strong>Tiago Loriato</strong></p>
  </div>
</Article>
```

Note: The about content is minimal in the current site. Copy the actual content from `about/index.md` — the above is a simplified version. The inline HTML styling from the original (`<p style="border:3px...">`) should be converted to plain markdown or removed.

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

## Task 16: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create rss.xml.ts**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Tiago Loriato',
    description: 'A collection of notes, researches, projects, and essays.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 2: Verify RSS works**

With dev server running, navigate to `http://localhost:4321/rss.xml`. Expected: valid RSS XML with all 4 posts listed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed endpoint"
```

---

## Task 17: Redirects for Old URLs

**Files:**
- Create: `src/pages/essay/melody-of-time.astro`
- Create: `src/pages/essay/kind-candorship.astro`
- Create: `src/pages/essay/the-scaffolding.astro`
- Create: `src/pages/research/the-bullish-case-for-zcash.astro`

- [ ] **Step 1: Create redirect pages**

Each redirect page is a minimal HTML page with a meta refresh tag. In static mode, `Astro.redirect()` is not available — we generate the redirect HTML directly. Create all four:

`src/pages/essay/melody-of-time.astro`:
```astro
<html><head><meta http-equiv="refresh" content="0;url=/melody-of-time/" /><link rel="canonical" href="/melody-of-time/" /></head><body><p>Redirecting to <a href="/melody-of-time/">/melody-of-time/</a></p></body></html>
```

`src/pages/essay/kind-candorship.astro`:
```astro
<html><head><meta http-equiv="refresh" content="0;url=/kind-candorship/" /><link rel="canonical" href="/kind-candorship/" /></head><body><p>Redirecting to <a href="/kind-candorship/">/kind-candorship/</a></p></body></html>
```

`src/pages/essay/the-scaffolding.astro`:
```astro
<html><head><meta http-equiv="refresh" content="0;url=/the-scaffolding/" /><link rel="canonical" href="/the-scaffolding/" /></head><body><p>Redirecting to <a href="/the-scaffolding/">/the-scaffolding/</a></p></body></html>
```

`src/pages/research/the-bullish-case-for-zcash.astro`:
```astro
<html><head><meta http-equiv="refresh" content="0;url=/the-bullish-case-for-zcash/" /><link rel="canonical" href="/the-bullish-case-for-zcash/" /></head><body><p>Redirecting to <a href="/the-bullish-case-for-zcash/">/the-bullish-case-for-zcash/</a></p></body></html>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/essay/ src/pages/research/
git commit -m "feat: add redirects from old Jekyll URLs to new paths"
```

---

## Task 18: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for Astro deployment"
```

---

## Task 19: Remove Jekyll Files

**Files:**
- Delete: all Jekyll-specific files (see file map above)

- [ ] **Step 1: Remove old Jekyll files**

```bash
rm -f _config.yml Gemfile Gemfile.lock index.md 404.md frontmatter.json
rm -rf _layouts/ _includes/ _sass/ _posts/ _drafts/
rm -rf assets/css/ assets/fonts/
rm -f assets/icons.svg assets/header.png assets/pixel-char.png
rm -rf about/ essay/ research/ notebook/
rm -rf .frontmatter/ .vscode/
rm -f .github/workflows/cron-build-page.yml
```

- [ ] **Step 2: Remove the now-empty assets directory if empty**

```bash
rmdir assets 2>/dev/null || true
```

(If `assets/` still has files like `profile.jpeg` or `png/`, those were already copied to `public/` in Task 6.)

- [ ] **Step 3: Verify build still works**

Run:
```bash
npm run build
```

Expected: Build completes successfully. Output in `dist/` directory with HTML pages for index, about, all posts, redirects, RSS, and sitemap.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove all Jekyll files and legacy assets"
```

---

## Task 20: Final Verification

- [ ] **Step 1: Run the dev server and check all pages**

```bash
npm run dev
```

Check each page:

1. `http://localhost:4321/` — Index with shell frame, header, essays/projects sections, filter tags working, WebGL shader on right
2. `http://localhost:4321/the-scaffolding/` — Article with WebGL header band, title, date, body text in manuscript style
3. `http://localhost:4321/kind-candorship/` — Article (has headings, blockquotes — verify `##` renders as section markers, `>` as pull quotes)
4. `http://localhost:4321/the-bullish-case-for-zcash/` — Article (has images, `####` headings — verify image borders, heading styles)
5. `http://localhost:4321/melody-of-time/` — Article (has images)
6. `http://localhost:4321/about/` — About page (no date, article layout)
7. `http://localhost:4321/rss.xml` — Valid RSS feed
8. `http://localhost:4321/essay/kind-candorship/` — Redirects to `/kind-candorship/`

- [ ] **Step 2: Run production build**

```bash
npm run build && npm run preview
```

Expected: Production build completes. Preview server starts. Check same pages — all render correctly with static HTML.

- [ ] **Step 3: Commit any fixes**

If anything needed adjustment during verification, commit those fixes:

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```
