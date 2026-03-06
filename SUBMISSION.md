# Submission Summary
## FinCal Innovation Hackathon — Technex '26, IIT BHU
**Co-Sponsored by HDFC Mutual Fund**

---

## Lighthouse Scores (Production Build)
| Category       | Score |
|----------------|-------|
| Performance    | 97    |
| Accessibility  | 97    |
| Best Practices | 100   |
| SEO            | 100   |

---

## Tech Stack
| Layer     | Technology  | Version  |
|-----------|-------------|----------|
| Frontend  | Next.js     | 15.5.9   |
| Runtime   | Node.js     | 22.11.0  |
| Package   | NPM         | 10.9.0   |
| CMS       | Drupal      | 10.5.6   |

---

## Features Implemented

### Core Calculator
- 3-step financial logic: Inflate Expenses → PV of Annuity Corpus → Required SIP
- Flat SIP mode (standard monthly investment)
- Step-Up SIP mode (annual % increase — lower starting SIP)
- Year-by-year accumulation + drawdown projections
- Mandatory HDFC Mutual Fund disclaimer (verbatim)

### Accessibility (WCAG 2.1 AA — 97/100)
- Skip navigation link
- Semantic landmarks and heading hierarchy
- All form controls labelled (`<label>`, `<output htmlFor>`)
- Keyboard-only tablist with ArrowLeft/ArrowRight navigation
- `role="alert"` / `role="status"` on dynamic regions
- All SVGs: `role="img"` + `<title>` + `aria-labelledby`
- Touch targets ≥ 44px (WCAG 2.5.5)
- `prefers-reduced-motion` respected
- Colour contrast: all text ≥ 4.5:1 (body text 7:1)

### UX
- Animated number counters (count-up on value change)
- Staggered card entrance animations
- Shimmer skeleton loader (zero layout shift)
- Share modal (copy to clipboard)
- Print / Save PDF summary
- Tooltips on metric cards
- Reset to defaults button
- Mobile responsive (2-up cards, stacked layout, short tab labels)

### API (Drupal Integration)
- `POST /api/calculate` — full REST endpoint (flat + step-up modes)
- `GET /api/health` — health check for Drupal ping
- Input validation with field-level error messages
- CORS headers (configurable via `DRUPAL_ORIGIN` env var)
- Full Drupal 10 custom module (`drupal/fincal_retirement/`)
  - Guzzle HTTP client service
  - Block plugin (iframe embed with auto-resize)
  - Admin settings form with live health indicator

### Production Robustness
- React `ErrorBoundary` (catches render crashes)
- Next.js `error.js` (route-level errors)
- Next.js `loading.js` + `SkeletonLoader` (loading states)
- `not-found.js` (404 page)
- `try/catch` around all calculations

---

## Running the Project
```bash
npm install
npm run build
npm start
# Open http://localhost:3000
```

## API Test
```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"currentAge":28,"retirementAge":60,"lifeExpectancy":85,"currentAnnualExpenses":600000,"inflationRate":6,"preRetirementReturn":12,"postRetirementReturn":7,"stepUpRate":0}'
```
