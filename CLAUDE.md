# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses **Bun** as the package manager.

```bash
bun install          # Install dependencies
bun dev              # Dev server at localhost:4321 (runs basehub dev & astro dev)
bun build            # Production build (basehub codegen + astro build)
bun preview          # Preview production build
bun astro [command]  # Astro CLI commands
```

## Architecture Overview

Personal portfolio site: **Astro 5** (SSR) + **React** + **TailwindCSS v4** + **BaseHub CMS**, deployed to **Vercel**.

### Key Patterns

**Path Aliases**: Use `~/` for `src/` imports (e.g., `~/components/common/Navbar.astro`).

**BaseHub CMS**:
- GraphQL-like queries fetch content from BaseHub
- Types auto-generated in `basehub-types.d.ts` (regenerate with `basehub` command)
- Client in `src/lib/basehub.ts` handles env-specific token loading
- Used for writings/blog with dynamic routing (`/writings/[slug].astro`)

**Component Architecture**:
- `.astro` components for static/server content
- `.tsx` React islands for client interactivity (use `client:load` directive)
- `Layout.astro` wraps all pages with navbar/sidebar/footer
- `<ClientRouter />` enables View Transitions for SPA-like navigation

**Styling**:
- TailwindCSS v4 with OKLCH color tokens in `src/styles/global.css`
- Dark theme only (no light mode)
- Use `cn()` from `~/lib/utils` for conditional classnames
- Custom CSS: masonry layouts (`#masonry`), marquee animation, `.richtext` for CMS content

**Image Handling**:
- Use Astro's `astro:assets` for local images (auto-optimizes to WebP)
- BaseHub images served via their CDN

**Environment Variables**:
- `BASEHUB_TOKEN` required for CMS access (in `.env` for dev)
