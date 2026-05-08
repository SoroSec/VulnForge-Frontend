# VulnForge Frontend

> **SoroSec** — Learn smart contract security by breaking intentionally vulnerable Soroban contracts.

VulnForge is a Web3 security learning platform where developers sharpen their Soroban/Stellar smart contract security skills through hands-on exploit challenges. Connect your Freighter wallet, study vulnerable contract code, run exploits on a live testnet, and climb the leaderboard.

**Current completion: ~30%** — Phases 1–4 are done. Phases 5–10 are open for contributors.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Mock Data](#mock-data)
- [Component Architecture](#component-architecture)
- [Wallet Integration](#wallet-integration)
- [Build Status — What Is Done & What Needs to Be Built](#build-status)
- [Backend Integration Checklist](#backend-integration-checklist)
- [Contributing](#contributing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS 4 |
| UI Components | shadcn/ui (to be initialized by contributor) |
| Icons | lucide-react |
| Wallet | Freighter (via `@stellar/freighter-api`) |
| Syntax Highlighting | `react-syntax-highlighter` |
| State Management | React Context + `useState`/`useReducer` |
| HTTP Client | Native `fetch` (service layer abstraction) |
| Animations | Tailwind CSS + CSS keyframes |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               ✅ Root layout (dark theme, fonts)
│   ├── page.tsx                 ✅ / — Landing page
│   ├── dashboard/
│   │   └── page.tsx             🔲 /dashboard — stub only, needs full implementation
│   ├── challenge/
│   │   └── [id]/
│   │       └── page.tsx         🔲 /challenge/[id] — stub only, needs full implementation
│   └── leaderboard/
│       └── page.tsx             🔲 /leaderboard — stub only, needs full implementation
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           ✅ Top nav with wallet connect button (not yet wired)
│   │   └── Footer.tsx           ✅ Footer with SoroSec branding
│   ├── landing/
│   │   ├── Hero.tsx             ✅ Hero section with terminal widget
│   │   └── FeatureCards.tsx     ✅ Three feature cards
│   ├── challenge/
│   │   ├── ChallengeCard.tsx    🔲 NEEDS TO BE BUILT
│   │   ├── ChallengeFilters.tsx 🔲 NEEDS TO BE BUILT
│   │   ├── ContractViewer.tsx   🔲 NEEDS TO BE BUILT
│   │   └── ChallengeTabs.tsx    🔲 NEEDS TO BE BUILT
│   ├── wallet/
│   │   ├── ConnectWallet.tsx    🔲 NEEDS TO BE BUILT
│   │   └── WalletStatus.tsx     🔲 NEEDS TO BE BUILT
│   ├── leaderboard/
│   │   └── LeaderboardTable.tsx 🔲 NEEDS TO BE BUILT
│   └── ui/                      🔲 shadcn/ui components (run init command below)
│
├── lib/
│   ├── mock/
│   │   ├── challenges.ts        ✅ 5 mock challenges (Easy/Medium/Hard, 3 categories)
│   │   └── leaderboard.ts       ✅ 10 mock leaderboard entries
│   ├── services/
│   │   ├── challenges.ts        ✅ getChallenges(), getChallengeById() with mock fallback
│   │   └── leaderboard.ts       ✅ getLeaderboard() with mock fallback
│   ├── hooks/
│   │   ├── useWallet.ts         🔲 NEEDS TO BE BUILT
│   │   └── useChallenges.ts     🔲 NEEDS TO BE BUILT
│   ├── types/
│   │   └── index.ts             ✅ Challenge, LeaderboardEntry, WalletState interfaces
│   └── utils.ts                 ✅ cn(), formatAddress()
│
└── styles/
    └── globals.css              ✅ Dark theme, grid bg, glow utilities, custom scrollbar
```

---

## Pages & Features

### `/` — Landing Page ✅ DONE
- Hero section with animated terminal, headline, CTA buttons
- Feature cards: Learn by Exploiting / Real Soroban Contracts / Track Progress
- Cybersecurity dark aesthetic with grid background and green glow

### `/dashboard` — Challenge Dashboard 🔲 NEEDS TO BE BUILT
- Grid of `ChallengeCard` components
- Each card: title, difficulty badge (color-coded), category tag, completion status, XP reward
- Search bar (filter by title)
- Filter dropdowns: Difficulty (Easy / Medium / Hard) and Category

### `/challenge/[id]` — Challenge Detail 🔲 NEEDS TO BE BUILT
- Contract description and vulnerability type header
- Four tabs: Vulnerable Code / Exploit Guide / Patched Version / Explanation
- Syntax-highlighted Rust code viewer
- Objective section
- Action buttons: Connect Wallet → Run Exploit → Submit Solution (state-gated)
- Transaction status toast/banner
- 404 if challenge not found

### `/leaderboard` — Rankings 🔲 NEEDS TO BE BUILT
- Table: rank, username/address, XP, challenges solved, last active
- Current user row highlighted when wallet connected
- XP progress bar per row (relative to top score)

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm (recommended) or npm
- [Freighter browser extension](https://www.freighter.app/) installed

### Install

```bash
git clone https://github.com/SoroSec/VulnForge-Frontend.git
cd VulnForge-Frontend
pnpm install
```

### Initialize shadcn/ui (required before building Phase 5+)

```bash
pnpx shadcn@latest init
# Choose: Dark theme, CSS variables, src/ directory, App Router
pnpx shadcn@latest add button badge card tabs input select progress
```

### Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root (already present in repo):

```env
# Leave empty to use mock data
NEXT_PUBLIC_API_URL=

# Stellar network: "testnet" | "mainnet"
NEXT_PUBLIC_STELLAR_NETWORK=testnet

# Horizon RPC endpoint
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Soroban RPC endpoint
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

When `NEXT_PUBLIC_API_URL` is empty, the service layer automatically falls back to mock data — no backend needed to develop.

---

## Mock Data

Mock data lives in `src/lib/mock/` and mirrors the shape of the real API responses. **Already written — contributors do not need to touch this.**

**Challenge shape (`lib/types/index.ts`):**
```ts
interface Challenge {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  status: 'locked' | 'available' | 'completed'
  xpReward: number
  description: string
  vulnerabilityType: string
  objective: string
  vulnerableCode: string    // Rust source
  patchedCode: string
  exploitGuide: string      // Markdown
  explanation: string       // Markdown
  contractAddress?: string
}
```

**Leaderboard entry shape:**
```ts
interface LeaderboardEntry {
  rank: number
  address: string
  username?: string
  xp: number
  solved: number
  lastActive: string
}
```

---

## Component Architecture

- All data fetching happens in page-level Server Components (or `useEffect` for client-only data like wallet state).
- `useWallet` hook encapsulates all Freighter interactions and exposes `{ address, connected, connect, disconnect }`.
- The service layer (`lib/services/`) checks for `NEXT_PUBLIC_API_URL`; if absent it returns mock data — no conditional logic in components.
- shadcn/ui components are extended via `className` props, not modified directly.

---

## Wallet Integration

Uses `@stellar/freighter-api` (already installed):

```ts
// lib/hooks/useWallet.ts — needs to be built
import { isConnected, getAddress, requestAccess } from '@stellar/freighter-api'

// connect()  → calls requestAccess(), stores address in state
// On mount   → checks isConnected(), restores session
// disconnect → clears local state (Freighter has no programmatic disconnect)
```

---

## Build Status

### ✅ Phase 1 — Project Scaffold (DONE)
- [x] Next.js 16 with TypeScript and Tailwind 4
- [x] Folder structure set up
- [x] `.env.local` with all variables
- [x] Global CSS: dark background, grid motif, glow utilities, custom scrollbar
- [x] All dependencies installed (`lucide-react`, `clsx`, `tailwind-merge`, `react-syntax-highlighter`, `@stellar/freighter-api`)

### ✅ Phase 2 — Types, Mock Data & Service Layer (DONE)
- [x] TypeScript interfaces in `lib/types/index.ts`
- [x] 5 mock challenges across 3 categories and all 3 difficulty levels (with full Rust code)
- [x] 10 mock leaderboard entries
- [x] `lib/services/challenges.ts` — `getChallenges()`, `getChallengeById(id)` with mock fallback
- [x] `lib/services/leaderboard.ts` — `getLeaderboard()` with mock fallback

### ✅ Phase 3 — Layout & Shared Components (DONE)
- [x] `Navbar` — logo, nav links, wallet connect button (button is UI-only, not yet wired to Freighter)
- [x] `Footer` — SoroSec branding
- [x] Root `layout.tsx` — dark theme, Geist fonts, metadata

### ✅ Phase 4 — Landing Page `/` (DONE)
- [x] `Hero` — headline, terminal widget, two CTA buttons, animated grid background
- [x] `FeatureCards` — three value-prop cards
- [x] Responsive layout

---

### 🔲 Phase 5 — Challenge Dashboard `/dashboard` (OPEN)

**Files to create:**
- `src/components/challenge/ChallengeCard.tsx`
- `src/components/challenge/ChallengeFilters.tsx`
- `src/app/dashboard/page.tsx` (replace stub)

**Requirements:**
- `ChallengeCard` displays: title, difficulty badge (green=Easy, yellow=Medium, red=Hard), category tag, status icon (locked/available/completed), XP reward, link to `/challenge/[id]`
- `ChallengeFilters` has a search input (filter by title) and two dropdowns: Difficulty and Category
- Dashboard page fetches challenges via `getChallenges()` from the service layer, applies client-side filter/search, renders a responsive grid
- Match the dark cybersecurity theme already established

### 🔲 Phase 6 — Challenge Detail `/challenge/[id]` (OPEN)

**Files to create:**
- `src/components/challenge/ContractViewer.tsx`
- `src/components/challenge/ChallengeTabs.tsx`
- `src/app/challenge/[id]/page.tsx` (replace stub)

**Requirements:**
- `ContractViewer` uses `react-syntax-highlighter` with a dark theme (Dracula or OneDark), line numbers enabled, Rust language
- `ChallengeTabs` has four tabs: Vulnerable Code, Exploit Guide, Patched Version, Explanation
- Page shows: challenge title, vulnerability type badge, objective section, the tabs component
- Action button row: "Connect Wallet" → "Run Exploit" → "Submit Solution" — buttons are state-gated (Run Exploit disabled until wallet connected; Submit Solution disabled until exploit run)
- Transaction status feedback via inline banner or toast
- If `getChallengeById(id)` returns null, render a 404 message
- `params` must be awaited (it is a `Promise<{ id: string }>` in this Next.js version)

### 🔲 Phase 7 — Wallet Integration (OPEN)

**Files to create:**
- `src/lib/hooks/useWallet.ts`
- `src/components/wallet/ConnectWallet.tsx`
- `src/components/wallet/WalletStatus.tsx`

**Requirements:**
- `useWallet` hook uses `@stellar/freighter-api`: `isConnected`, `getAddress`, `requestAccess`
- Exposes `{ address, connected, connect, disconnect }` — `disconnect` clears local state only (Freighter has no programmatic disconnect)
- `ConnectWallet` button shows "Connect Wallet" when disconnected, truncated address (`GBXG...K7YZ`) when connected
- `WalletStatus` shows network indicator and address copy button
- Wire the Connect Wallet button in `Navbar.tsx` to use `ConnectWallet` component
- Gate "Run Exploit" and "Submit Solution" in the challenge detail page behind wallet connection

### 🔲 Phase 8 — Leaderboard `/leaderboard` (OPEN)

**Files to create:**
- `src/components/leaderboard/LeaderboardTable.tsx`
- `src/app/leaderboard/page.tsx` (replace stub)

**Requirements:**
- Table columns: Rank, Username/Address, XP, Challenges Solved, Last Active
- Highlight the current user's row if wallet is connected and address matches
- XP progress bar per row, width relative to the top score
- Fetch data via `getLeaderboard()` from the service layer
- Responsive — collapses gracefully on mobile

### 🔲 Phase 9 — User Progress on Dashboard (OPEN)

**Requirements:**
- Add a stats bar at the top of `/dashboard` showing: total XP, challenges completed, current rank
- Mark completed challenges in `ChallengeCard` with a visual indicator (e.g. green checkmark, "Completed" badge)
- Stats are derived from mock data for now; should be easy to swap for real data later

### 🔲 Phase 10 — Polish & QA (OPEN)

**Requirements:**
- Responsive design audit across mobile (375px), tablet (768px), desktop (1280px)
- Accessibility: keyboard navigation, ARIA labels, color contrast ≥ 4.5:1
- Loading skeletons for all async data fetches
- Error boundary and empty states (no challenges found, leaderboard empty, etc.)
- Smooth page transitions and micro-animations (hover states, fade-ins)
- Final README update noting any deviations from this spec

---

## Backend Integration Checklist

When the backend API is ready, swap mock data by:

1. Set `NEXT_PUBLIC_API_URL` in `.env.local`
2. Update `lib/services/challenges.ts` and `lib/services/leaderboard.ts` to call real endpoints
3. Replace mock `contractAddress` fields with real deployed Soroban contract addresses
4. Wire "Run Exploit" to actual Soroban transaction invocation via `@stellar/stellar-sdk`
5. Wire "Submit Solution" to a backend verification endpoint
6. Add authentication (JWT or wallet-signed message) to protected routes
7. Replace mock user progress with real on-chain / backend data

---

## Contributing

This project is maintained by the **SoroSec** organization and is open for contributions on [Drips Network](https://www.drips.network/).

**Before you start:**
1. Check the [Build Status](#build-status) section — pick an open phase
2. Read the requirements for that phase carefully
3. The service layer and types are already in place — use them, don't rewrite them
4. Match the dark cybersecurity theme already established in the existing components
5. Run `pnpm build` before opening a PR — it must compile with zero TypeScript errors

**Workflow:**
1. Fork the repo and create a branch named `phase-N-description` (e.g. `phase-5-challenge-dashboard`)
2. Implement the phase requirements
3. Run `pnpm build` and fix any errors
4. Open a PR against `main` with a clear description of what was built

---

*VulnForge — Break it to understand it.*
