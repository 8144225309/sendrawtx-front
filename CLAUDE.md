# sendrawtx-front

## Context

This is a recovered React/TypeScript frontend for the SendRawTx Bitcoin transaction broadcasting service. Source files were recovered from a Vite source map and a zip backup on 2026-02-08. The code may have inconsistencies between files since they came from two different points in time.

**This repo is NOT yet confirmed to build or run. Your first job is to make it work locally.**

## Tech Stack

- React 19 + TypeScript 5.9
- Vite 7 + Tailwind CSS 4
- React Router DOM 7
- TanStack React Query 5
- Lucide React (icons)
- Zod (validation), Zustand (state), React Hook Form

## Key Files

| File | Lines | What it does |
|------|-------|-------------|
| `src/lib/txDecoder.ts` | ~2,800 | Pure JS Bitcoin transaction decoder - parses raw TX hex, PSBTs, detects Ordinals/BRC-20/Runes/CAT-21/Atomicals/Stamps/Counterparty protocols, nonstandard TX policy analysis |
| `src/components/TransactionPreview.tsx` | ~1,460 | Live transaction preview with decode display, PSBT status, protocol badges, input/output rows |
| `src/pages/LogoShowcase.tsx` | ~3,000 | SVG logo variations showcase page |
| `src/pages/HomePage.tsx` | Home page with broadcast form + TX preview integration |
| `src/pages/TxResultPage.tsx` | Transaction result/confirmation display |
| `src/pages/ApiDocsPage.tsx` | API documentation page |
| `src/pages/HealthPage.tsx` | System health/status monitor |

## Task: Audit and Fix

### Step 1: Install and build
```bash
npm install
npm run dev
```
Fix any errors. The code was recovered and may need:
- Missing imports or exports
- Type mismatches between older and newer files
- Broken references

### Step 2: Review each file
For every `.ts` and `.tsx` file under `src/`:
1. Check imports resolve correctly
2. Check TypeScript types are consistent
3. Check for dead code or obvious bugs
4. Note anything that looks wrong but don't refactor for style

### Step 3: Verify locally
- All pages render without console errors
- Transaction decoder parses sample TX hex correctly
- PSBT detection works
- Logo showcase page renders SVGs
- No React warnings in console

### Step 4: Report findings
Create a summary of:
- What works
- What's broken and how you fixed it
- What looks suspicious but you left alone
- Any missing functionality or dead endpoints

## Important Notes

- The backend (sendrawtx C server) is NOT running. API calls to `/api/*`, `/tx/*`, `/classify/*`, `/health` will fail. That's expected. Focus on the frontend rendering and client-side logic.
- `txDecoder.ts` is pure client-side JS with zero dependencies. It should work standalone.
- Don't add README, LICENSE, or docs. This is still a recovery dump.
- Don't refactor, rename, or reorganize. Minimal fixes only.
- Commit fixes in small, clear commits.
