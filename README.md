# FinCal Retirement Planning Calculator
**FinCal Innovation Hackathon — Technex '26, IIT BHU**  
**Co-Sponsored by HDFC Mutual Fund**

---

## 🌐 Live Demo
**https://fincal-hackathon.vercel.app**

## 📦 GitHub Repository
**https://github.com/Shubham2025-ai/fincal-hackathon**

---

## 🏆 Lighthouse Scores (Production Build)
| Category       | Score |
|----------------|-------|
| Performance    | 100   |
| Accessibility  | 97    |
| Best Practices | 100   |
| SEO            | 100   |

---

## 📋 Hackathon Requirements — Compliance Checklist

### ✅ Calculator Category
- **Retirement Planning Calculator** — one of the 5 permitted categories

### ✅ Calculation Logic (Exact Formula Match)
| Step | Formula | Status |
|------|---------|--------|
| Step 1 — Inflate Expenses | `Current Expense × (1 + Inflation)^Years` | ✅ |
| Step 2 — Retirement Corpus | `Annual Expense × [(1 − (1+r)^−t) ÷ r]` | ✅ |
| Step 3 — Required SIP | `Corpus × r ÷ [((1+r)^n − 1) × (1+r)]` | ✅ |

### ✅ Mandatory Inputs
- Current Age ✅
- Retirement Age ✅
- Life Expectancy ✅
- Current Annual Expenses ✅
- Expected Inflation Rate ✅
- Pre-Retirement Return ✅
- Post-Retirement Return ✅

### ✅ Compliance
- Verbatim disclaimer always visible in header ribbon ✅
- No scheme recommendations ✅
- No performance commitments ✅
- All results labelled illustrative ✅
- Non-promotional throughout ✅

### ✅ Brand Guidelines
| Element | Value | Status |
|---------|-------|--------|
| Blue | #224c87 | ✅ |
| Red | #da3832 | ✅ |
| Grey | #919090 | ✅ |
| Font 1 | Montserrat | ✅ |
| Font 2 | Arial | ✅ |
| Font 3 | Verdana | ✅ |
| No growth arrows | — | ✅ |
| No currency imagery | — | ✅ |

### ✅ Mandatory Technology Stack
| Technology | Required | Used |
|------------|----------|------|
| Next.js | 15.5.9 | 15.5.9 ✅ |
| Node.js | 22.11.0 | 22.11.0 ✅ |
| NPM | 10.9.0 | 10.9.0 ✅ |
| Drupal | 10.5.6 | 10.5.6 ✅ |
| PHP | 8.1 | 8.1 ✅ |
| MySQL | — | ✅ (Railway) |

### ✅ Accessibility — WCAG 2.1 AA
- Semantic HTML ✅
- Screen reader compatibility ✅
- Proper ARIA roles (12 roles) ✅
- Keyboard navigation ✅
- Colour contrast compliance ✅
- Accessible form labels ✅
- Error state accessibility ✅
- Logical tab order ✅
- Lighthouse Accessibility: **97/100** ✅

### ✅ Responsiveness
- Desktop ✅
- Tablet (780px breakpoint) ✅
- Mobile (480px breakpoint) ✅
- Touch-friendly sliders (44px targets) ✅

---

## ⭐ Enhancements Beyond Requirements (Page 3 — Scope Clarification)

### 1. Step-Up SIP (Top-Up SIP)
- Toggle between Flat SIP and Step-Up SIP
- Annual percentage increase configurable (1–25%)
- Binary search algorithm for accurate first-month SIP calculation
- Shows starting SIP → final year SIP progression

### 2. Lifestyle & Healthcare Inflation Buckets
Three optional expense buckets each with independent inflation:
- 🏥 **Medical / Healthcare** — configurable inflation rate (default 8%, higher than general)
- ✈️ **Travel & Leisure** — retirement lifestyle expenses
- 👨‍👩‍👧 **Legacy / Dependents** — estate planning buffer
- Weighted average inflation calculated automatically when medical bucket is active

### 3. Flat vs Step-Up Comparison Tab
- Side-by-side cards comparing both strategies
- Shows starting SIP, final year SIP, total invested, corpus
- Key insight box: "Save ₹X/mo (Y%) in year 1 with Step-Up"

### 4. Animated 3-Step Indicator
- Steps light up sequentially (350ms apart) on every calculation
- Connector lines animate between steps
- Labels bold when reached — teaches the formula flow visually

### 5. Different Return Assumptions
- Separate pre-retirement return (accumulation phase)
- Separate post-retirement return (decumulation phase)

### 6. Year-by-Year Projections
- Full accumulation table (age → corpus → invested)
- Full drawdown table showing corpus depletion over retirement years
- Corpus sustainability indicator (✓ Sustainable / ⚠ Not Sustainable)

### 7. Save & Load Named Plans (MySQL)
- Save any calculation with a name and notes
- Load plans back into calculator via URL (`/?plan=ID`)
- Delete plans
- Full CRUD via REST API

### 8. Analytics Dashboard (`/analytics`)
- Total calculations, saved plans
- Average user profile (age, SIP, corpus)
- Flat vs Step-Up mode breakdown bar
- Recent calculations table
- Top 3 largest corpus calculations

### 9. Drupal 10 Integration
- REST API module for external access
- Block plugin to embed calculator in Drupal pages
- PHP 8.1 client with strict types
- Admin settings form

### 10. UX Enhancements
- Onboarding welcome card on first load
- Animated number counters on all metric cards
- Skeleton loader during initial render
- Error boundary with friendly recovery UI
- Share button (copy URL)
- Print / PDF summary
- Staggered card entrance animations

---

## 🗂 Project Structure
```
fincal-hackathon/
├── src/
│   ├── app/
│   │   ├── page.js                    # Home — calculator
│   │   ├── plans/page.js              # Saved plans viewer
│   │   ├── analytics/page.js          # Analytics dashboard
│   │   └── api/
│   │       ├── calculate/route.js     # POST — run calculation + log to DB
│   │       ├── plans/route.js         # GET/POST saved plans
│   │       ├── plans/[id]/route.js    # GET/DELETE single plan
│   │       ├── analytics/route.js     # GET aggregate stats
│   │       └── health/route.js        # GET health check
│   ├── components/
│   │   ├── RetirementCalculator.js    # Main calculator component
│   │   ├── SliderInput.js             # Accessible slider
│   │   ├── ResultCard.js              # Animated metric card
│   │   ├── BarChart.js                # Accumulation/drawdown chart
│   │   ├── DonutChart.js              # Corpus breakdown donut
│   │   ├── AnimatedNumber.js          # Counter animation
│   │   ├── SavePlanModal.js           # Save plan dialog
│   │   ├── PrintSummary.js            # Print/PDF layout
│   │   ├── SkeletonLoader.js          # Loading skeleton
│   │   └── ErrorBoundary.js           # Error recovery UI
│   └── lib/
│       ├── financeCalc.js             # All financial formulas
│       └── prisma.js                  # Prisma client singleton
├── prisma/
│   └── schema.prisma                  # MySQL schema (3 tables)
├── drupal/
│   └── fincal_retirement/             # Drupal 10 module
└── docs/
    ├── database-setup.md
    └── drupal-integration.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 22.11.0+
- MySQL running locally

### Steps
```bash
# 1. Clone
git clone https://github.com/Shubham2025-ai/fincal-hackathon.git
cd fincal-hackathon

# 2. Install
npm install

# 3. Configure database
# Edit .env:
DATABASE_URL="mysql://root:password@localhost:3306/fincal_retirement"

# 4. Create MySQL database
# Run in MySQL Workbench:
# CREATE DATABASE fincal_retirement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 5. Push schema
npx prisma db push

# 6. Build and start
npm run build
npm start
```

Open http://localhost:3000

---

## ☁️ Production Deployment

**Frontend:** Vercel — https://fincal-hackathon.vercel.app  
**Database:** Railway MySQL

### Deploy steps
```bash
# 1. Deploy to Vercel
npm install -g vercel
vercel --prod

# 2. Add database environment variable
vercel env add DATABASE_URL
# Paste Railway MYSQL_PUBLIC_URL

# 3. Push schema to Railway
$env:DATABASE_URL="mysql://..."; npx prisma db push

# 4. Redeploy
vercel --prod
```

---

## 🔌 API Endpoints
```bash
# Health check
GET  /api/health

# Calculate retirement plan
POST /api/calculate
Body: { currentAge, retirementAge, lifeExpectancy, currentAnnualExpenses,
        inflationRate, preRetirementReturn, postRetirementReturn, stepUpRate }

# Saved plans
GET  /api/plans
POST /api/plans
GET  /api/plans/:id
DELETE /api/plans/:id

# Analytics
GET  /api/analytics
```

---

## 📐 Financial Formulas

**Step 1 — Inflate Annual Expenses**
```
Retirement Expense = Current Expense × (1 + inflation)^yearsToRetirement
```

**Step 2 — Retirement Corpus (PV of Annuity)**
```
Corpus = Annual Expense × [(1 − (1+r)^−t) ÷ r]
r = post-retirement annual return
t = retirement duration (years)
```

**Step 3 — Required Monthly SIP**
```
SIP = Corpus × r ÷ [((1+r)^n − 1) × (1+r)]
r = monthly pre-retirement return
n = months to retirement
```

**Weighted Inflation (when medical bucket active)**
```
Effective Inflation = (Base Expenses × Base Inflation + Medical × Medical Inflation) ÷ Total Expenses
```

---

## ⚠️ Disclaimer
This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.