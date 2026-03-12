# Repository Cleanup Audit

Date: 2026-03-12  
Scope: full repo scan for stale/obsolete/generated/misleading files.

## Method used

- Inventory all tracked files (`rg --files`).
- Inspect root docs/config/scripts and known artifact-like files.
- Check references across repo (`rg -n --hidden --glob '!.git' --glob '!node_modules' ...`).
- Verify build/CI scripts (`package.json`, `.github/workflows/*`) before classifying risk.

## 1) Summary of suspicious files found

I found three major buckets of suspicious files:

1. **Clearly generated/debug artifacts committed to git** (lint/tsc/sitemap text dumps).
2. **Legacy/stale documentation from previous architecture eras** (Firebase/Vite-era docs, old component/API docs).
3. **Potentially historical or one-time migration notes** that are likely obsolete but may still hold troubleshooting context.

---

## 2) Safe to delete

### `lint.txt`

- Why suspicious: UTF-16/Windows-style lint output dump, not source/config.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `lint-errors.txt`

- Why suspicious: Captured ESLint CLI error output from old setup.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `sitemap_error.txt`

- Why suspicious: Captured command failure output, not operational config.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `tsc_errors.txt`

- Why suspicious: TypeScript compiler error log artifact.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `tsc_output.txt`

- Why suspicious: TypeScript command output artifact.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `tsc_output_2.txt`

- Why suspicious: TypeScript command output artifact.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `tsc_output_3.txt`

- Why suspicious: TypeScript command output artifact.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

### `tsc_output_4.txt`

- Why suspicious: TypeScript command output artifact.
- Referenced anywhere: **No**.
- Risk if removed: **Low**.
- Recommended action: **Delete**.

---

## 3) Probably delete, but verify first

### `IMPLEMENTATION_SUMMARY.md`

- Why suspicious: Describes a **Firebase** implementation and file tree that no longer matches repo architecture (current codebase is Astro + Supabase).
- Referenced anywhere: only self-reference.
- Risk if removed: **Low-Medium** (could contain historical migration context).
- Recommended action: **Probably delete**, or move to `/docs/archive/` if you want project history.

### `MIGRATION_GUIDE.md`

- Why suspicious: Refers to migration script path `supabase/add_featured_post_to_site_settings.sql` that does not exist in current repo tree.
- Referenced anywhere: **No**.
- Risk if removed: **Medium** (might still help operators with old DB state).
- Recommended action: **Probably delete**, or rewrite as a short “legacy DB migration notes” page.

### `metadata.json`

- Why suspicious: Not referenced by app runtime, package scripts, or workflows; looks tool-generated/leftover.
- Referenced anywhere: **No runtime/tooling references found**.
- Risk if removed: **Medium** (unknown external tooling could rely on it).
- Recommended action: **Probably delete**, but verify no external platform reads it.

### `GITHUB_PAGES_SETUP.md`

- Why suspicious: Duplicates deployment guidance already covered by workflow and other docs; very long beginner-oriented instructions can drift.
- Referenced anywhere: **No**.
- Risk if removed: **Low-Medium**.
- Recommended action: **Probably delete** after folding any unique details into `DEPLOYMENT.md` or README.

---

## 4) Keep, but rewrite/update

### `README.md`

- Why suspicious: Contains stale architecture descriptions (e.g., React Router/Vite-era references) not fully aligned with Astro-based structure.
- Referenced anywhere: entrypoint project doc.
- Risk if removed: **High**.
- Recommended action: **Keep and rewrite** to match current architecture, scripts, and deployment flow.

### `docs/ARCHITECTURE.md`

- Why suspicious: File tree and component/context names reference many non-existent paths (`App.tsx`, `main.tsx`, old hooks/contexts).
- Referenced anywhere: not linked, but important as architecture source of truth.
- Risk if removed: **Medium**.
- Recommended action: **Keep but fully rewrite** to current Astro + React islands + Supabase design.

### `docs/API.md`

- Why suspicious: Documents hooks/components that are not present (`useAnalytics`, `useLocalStorage`, etc.).
- Referenced anywhere: not linked.
- Risk if removed: **Medium**.
- Recommended action: **Keep but rewrite** to actual public/internal APIs.

### `docs/COMPONENTS.md`

- Why suspicious: Documents components that do not exist in current tree (`Card.tsx`, `comments/*`, etc.).
- Referenced anywhere: not linked.
- Risk if removed: **Medium**.
- Recommended action: **Keep but rewrite** from current `src/components/*`.

### `DEPLOYMENT.md`

- Why suspicious: Mentions Vite config expectations; current project uses Astro config.
- Referenced anywhere: linked from `GITHUB_PAGES_SETUP.md`.
- Risk if removed: **Medium**.
- Recommended action: **Keep and update** so platform instructions match current build/runtime.

### `ACCESSIBILITY.md`

- Why suspicious: States broad compliance claims and “no known issues”; those can become stale without audit date discipline.
- Referenced anywhere: not linked.
- Risk if removed: **Low-Medium**.
- Recommended action: **Keep and update** with real tested scope + date + tooling results.

### `CHANGELOG.md`

- Why suspicious: Contains entries that mention files/eras likely not matching current repo history (possible drift).
- Referenced anywhere: not linked.
- Risk if removed: **Medium**.
- Recommended action: **Keep and correct** based on actual git history.

---

## 5) Keep as historical/internal documentation

### `supabase/migrations/_archived/*`

- Why suspicious: “\_archived” naming suggests no longer active.
- Referenced anywhere: not imported by app code.
- Risk if removed: **Medium-High** (can break DB archaeology/audits/recovery).
- Recommended action: **Keep as historical/internal docs** unless DB migration policy says otherwise.

### `src/utils/migrateToSupabase.ts`

- Why suspicious: sounds one-time migration utility.
- Referenced anywhere: yes, used by admin DataMigration route/component.
- Risk if removed: **High** (breaks admin migration flow).
- Recommended action: **Keep** (optionally mark deprecated in-code if no longer intended).

---

## 6) Uncertain — manual review needed

### `scripts/icon-generator.html`

- Why suspicious: local helper page; not wired into npm scripts/CI.
- Referenced anywhere: yes, in README instructions.
- Risk if removed: **Low-Medium** (breaks manual icon workflow documented for maintainers).
- Recommended action: **Manual review** — keep if team still uses browser-based icon generation, otherwise remove and update docs.

### `Preview.png`

- Why suspicious: image artifact in repo root, usually marketing/docs-only.
- Referenced anywhere: yes, README hero image.
- Risk if removed: **Low** functional, **Medium** documentation quality.
- Recommended action: **Manual review** — keep if README preview is desired.

---

## 7) Files that look harmless but are actually important

- `src/utils/migrateToSupabase.ts` — appears legacy, but actively imported by admin migration UI/route.
- `SUPABASE_SETUP.md` — referenced in code-facing admin/setup messaging; removing it would degrade operator guidance.
- `supabase/migrations/_archived/*` — not runtime files, but important for schema history and rollback context.
- `public/_headers`, `netlify.toml`, `vercel.json` — easy to think “duplicate deploy configs,” but each targets different hosting stacks.

---

## Safest cleanup plan (small batches)

### Batch A (no-risk artifacts)

1. Remove all `lint*.txt`, `tsc*.txt`, and `sitemap_error.txt` files.
2. Add patterns to `.gitignore` to prevent recurrence (e.g., `tsc_output*.txt`, `tsc_errors.txt`, `sitemap_error.txt`, `lint*.txt`).
3. Run CI-equivalent checks locally (`npm run lint`, `npx tsc --noEmit`, `npm run build`).

### Batch B (legacy doc cleanup)

1. Archive or delete `IMPLEMENTATION_SUMMARY.md`, `MIGRATION_GUIDE.md`, `GITHUB_PAGES_SETUP.md`.
2. If retained, move to `docs/archive/` and add top banner: “Historical, not current architecture”.

### Batch C (living-doc refresh)

1. Rewrite `README.md` first (single source of truth for setup).
2. Rewrite architecture/API/components docs from current source.
3. Trim `DEPLOYMENT.md` to match actual Astro-based deployment workflow.

### Batch D (manual uncertains)

1. Confirm ownership and usage of `metadata.json`.
2. Confirm whether `scripts/icon-generator.html` and `Preview.png` are still desired.
