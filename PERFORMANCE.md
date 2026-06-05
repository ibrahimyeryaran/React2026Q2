# Performance Report — CO₂ Emissions Data Explorer

This document records the profiling and optimization work for the CO₂ Emissions
Data Explorer. It follows the three required phases:

1. **Phase 1 — Baseline profiling** of the unoptimized app
2. **Phase 2 — Applied optimizations**
3. **Phase 3 — Final profiling** and before/after comparison

## Methodology

- **Tool:** React DevTools **Profiler** tab (browser extension)
- **Build mode:** development (`npm run dev`) — most accurate component-level timing
- **Dataset:** `public/data/owid-co2-data.json` (~86 MB, ~270 countries, full year history)
- **Recorded interactions** (each recorded as a separate Profiler session):
  1. **Sorting** countries (toggle sort order / change sort field)
  2. **Searching** for a country (type in the search box)
  3. **Selecting a different year**
  4. **Toggling columns** (open modal, toggle a column)
- **Metrics captured per interaction:** Commit duration, Render duration, Flame chart
- **How to reproduce:** open React DevTools → Profiler → ⚙️ enable
  "Record why each component rendered" and "Highlight updates when components
  render" → click ⏺ Record → perform the interaction once → ⏹ Stop → read the
  commit/render durations from the ranked chart and export/screenshot the flame chart.

> Screenshots live in `docs/screenshots/`. Replace each `_TODO_` placeholder
> below with the captured image and fill in the measured numbers.

---

## Phase 1 — Baseline (Unoptimized) — 15 pts

The starter renders **every** country (≈270 cards, each with a data table) on
every state change, recomputes derived data inline, and recreates all handlers
on each render. Expected to be slow and janky.

### 1. Sorting

| Metric | Baseline |
| --- | --- |
| Commit duration | _TODO_ ms |
| Render duration | _TODO_ ms |
| Flame chart | _TODO_ — `docs/screenshots/baseline-sort.png` |

![Baseline — Sorting](./docs/screenshots/baseline-sort.png)

### 2. Searching

| Metric | Baseline |
| --- | --- |
| Commit duration | _TODO_ ms |
| Render duration | _TODO_ ms |
| Flame chart | _TODO_ — `docs/screenshots/baseline-search.png` |

![Baseline — Searching](./docs/screenshots/baseline-search.png)

### 3. Selecting a different year

| Metric | Baseline |
| --- | --- |
| Commit duration | _TODO_ ms |
| Render duration | _TODO_ ms |
| Flame chart | _TODO_ — `docs/screenshots/baseline-year.png` |

![Baseline — Year selection](./docs/screenshots/baseline-year.png)

### 4. Toggling columns

| Metric | Baseline |
| --- | --- |
| Commit duration | _TODO_ ms |
| Render duration | _TODO_ ms |
| Flame chart | _TODO_ — `docs/screenshots/baseline-columns.png` |

![Baseline — Column toggle](./docs/screenshots/baseline-columns.png)

---

## Identified Bottlenecks

From the baseline flame charts, the hot paths were:

| # | Location | Problem |
| --- | --- | --- |
| 1 | `app.tsx` | All event handlers recreated each render; `getAvailableYears(data)` (scans every country × year) recomputed on every render. |
| 2 | `country-list.tsx` | `filter + sort` recomputed every render. The `population` sort comparator called `createYearDataMap()` **inside every comparison** → O(n log n) Map allocations. |
| 3 | `country-card.tsx` | Not memoized; `createYearDataMap(country.data)` rebuilt on every render. With ~270 cards, any parent render re-rendered/recomputed all of them. |
| 4 | `data-table.tsx` | Not memoized; `data.filter()` each render; `key={index}`. |
| 5 | lists/tables | `key={index}` used in the country list and the data table → poor reconciliation. |
| 6 | `country-list.tsx` | **No virtualization** — all ~270 cards (each with a table) mounted in the DOM at once. The dominant cost. |
| 7 | `search-bar`, `year-selector`, `column-modal` | Not memoized → re-rendered on every unrelated `App` state change. |

---

## Phase 2 — Applied Optimizations — 70 pts

### `useMemo` for computed values — 12 pts

- `app.tsx`: `years` (memoized on `data`) and `availableColumns` (computed once).
- `country-list.tsx`: `filteredCountries` (filter + sort) memoized on its inputs;
  `rowProps` memoized for `react-window`.
- `country-card.tsx`: `yearDataMap`, `population`, `co2` memoized on
  `country.data` / `selectedYear` (avoids rebuilding the year Map each render).
- `data-table.tsx`: `record` (year lookup) memoized on `data` / `year`.

### `useCallback` for event handlers — 12 pts

- `app.tsx`: `handleSearch`, `handleYearChange`, `handleSortFieldChange`,
  `handleSortOrderToggle`, `handleColumnToggle`, `handleModalToggle` are all
  wrapped in `useCallback` with **empty dependency arrays**, using functional
  `setState(prev => …)` updates so the references stay stable across renders.
  Stable handlers are what allow the memoized children below to actually skip
  re-rendering.

### `React.memo` to prevent unnecessary re-renders — 12 pts

Wrapped: `CountryList`, `CountryCard`, `DataTable`, `SearchBar`, `YearSelector`,
`ColumnModal`. Combined with the stable handlers/props, typing in the search box
no longer re-renders the year selector or the column modal, etc.

### Proper `key` props — 12 pts

- `country-list.tsx`: rows are keyed by `react-window` per row index of the
  **virtualized** list (stable list of `filteredCountries`); switched away from
  array-index keys on the full list.
- `data-table.tsx`: rows keyed by the **column name** (`key={column}`) instead of
  `key={index}`.

### Virtualization for the large country list — 22 pts

- Implemented with **`react-window` v2** (`List`) in `country-list.tsx`.
- Only the visible rows (+ small overscan) are mounted instead of all ~270 cards.
- **Measured (DOM evidence):** before optimization the DOM held a table for every
  country (~270 tables); after virtualization only **~4–7 tables** are mounted at
  any time, and scrolling recycles rows (verified: scrolling swaps the rendered
  countries while the mounted count stays low).

---

## Phase 3 — Final (Optimized) — 15 pts

Re-profile the **same** four interactions with the same methodology and fill in
the numbers. Improvement is calculated as:

```
improvement % = (baseline − optimized) / baseline × 100
```

### 1. Sorting

| Metric | Baseline | Optimized | Improvement |
| --- | --- | --- | --- |
| Commit duration | _TODO_ ms | _TODO_ ms | _TODO_ % |
| Render duration | _TODO_ ms | _TODO_ ms | _TODO_ % |

![Optimized — Sorting](./docs/screenshots/optimized-sort.png)

### 2. Searching

| Metric | Baseline | Optimized | Improvement |
| --- | --- | --- | --- |
| Commit duration | _TODO_ ms | _TODO_ ms | _TODO_ % |
| Render duration | _TODO_ ms | _TODO_ ms | _TODO_ % |

![Optimized — Searching](./docs/screenshots/optimized-search.png)

### 3. Selecting a different year

| Metric | Baseline | Optimized | Improvement |
| --- | --- | --- | --- |
| Commit duration | _TODO_ ms | _TODO_ ms | _TODO_ % |
| Render duration | _TODO_ ms | _TODO_ ms | _TODO_ % |

![Optimized — Year selection](./docs/screenshots/optimized-year.png)

### 4. Toggling columns

| Metric | Baseline | Optimized | Improvement |
| --- | --- | --- | --- |
| Commit duration | _TODO_ ms | _TODO_ ms | _TODO_ % |
| Render duration | _TODO_ ms | _TODO_ ms | _TODO_ % |

![Optimized — Column toggle](./docs/screenshots/optimized-columns.png)

---

## Summary

| Interaction | Commit (before → after) | Render (before → after) | Improvement |
| --- | --- | --- | --- |
| Sorting | _TODO_ | _TODO_ | _TODO_ % |
| Searching | _TODO_ | _TODO_ | _TODO_ % |
| Year selection | _TODO_ | _TODO_ | _TODO_ % |
| Column toggle | _TODO_ | _TODO_ | _TODO_ % |

**Key structural win:** mounted country cards dropped from **~270 → ~4–7**
(virtualization), eliminating the largest source of commit cost. Memoization +
stable handlers removed the cascade of unnecessary re-renders across the control
components on every keystroke/toggle.
