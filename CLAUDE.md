# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault is a retro-themed online gaming platform where users browse games, play them in-browser, and compete for high scores on a Hall of Fame leaderboard. The UI language is Spanish.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint (eslint-config-next, core-web-vitals + typescript rules)
```

No test runner is configured yet.

## Architecture

### Current state vs. target

`app/` is a stock Next.js App Router scaffold. The complete reference implementation lives in `references/templates/` as vanilla React JSX — every screen, interaction, and design token is defined there and must be ported to Next.js.

### Reference templates (`references/templates/`)

Read these before building any screen:

| File | Purpose |
|---|---|
| `data.jsx` | Shared mock data: `GAMES` array (8 games), `CATS` filter list, `seededScores(seed, count)` deterministic leaderboard generator |
| `app.jsx` | Root SPA: hash-encoded JSON router, `localStorage`-backed user session (`av_user`), score persistence (`av_scores`) |
| `nav.jsx` | Top nav + responsive mobile drawer |
| `biblioteca.jsx` | Game library with live search + category chip filter; `GameCard` has a CSS 3D tilt-on-hover effect |
| `detalle.jsx` | Game detail page with stats strip and a per-game mini-leaderboard (uses `seededScores`) |
| `reproductor.jsx` | Simulated game player — score increments via `setInterval` (not a real engine); game-over modal with score saving |
| `auth.jsx` | Login/register form (no real backend validation); social buttons (Google/GitHub) are stubs |
| `salon.jsx` | Hall of Fame: per-game leaderboard tabs, top-3 podium, full table, logged-in user's rank row |
| `styles.css` | Full design system: CSS custom properties for the neon/retro palette, all component styles |

### Target route structure (App Router)

Port the template's hash-based routes to file-based routes:

```
app/                        → biblioteca (library home)
app/juegos/[id]/            → detalle
app/juegos/[id]/jugar/      → reproductor (GamePlayer)
app/auth/                   → auth
app/salon/                  → salon (HallOfFame)
```

### Key implementation details

- **Game data** — `GAMES` is the single source of truth. `game.id` is a slug used as the dynamic route segment and as the leaderboard seed key.
- **Scores** — `seededScores(seed, count)` uses a linear congruential generator; output is deterministic (same seed → same rows). User scores saved to `localStorage` under `av_scores`.
- **Auth** — Currently client-only; `onLogin` receives `{ name: string }` and writes to `localStorage`. Social buttons are visual stubs with no wiring.
- **Game player** — The current implementation is a CSS-animated mockup (`game-arena` div with enemy/player elements). Real game logic is not yet implemented.

### Styling

Tailwind CSS v4 (PostCSS plugin, no `tailwind.config`). The neon design system in `references/templates/styles.css` — CSS vars like `--ink`, `--ink-dim`, `--ink-faint`, `--line`, `--mono`, `--cyan`, `--magenta`, `--yellow`, `--green` — must be ported into `app/globals.css`.

### Path alias

`@/*` resolves to the project root (e.g., `@/components/Nav.tsx`).
