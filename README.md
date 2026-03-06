# FinCal Retirement Planning Calculator
**FinCal Innovation Hackathon — Technex '26, IIT BHU**  
**Co-Sponsored by HDFC Mutual Fund**

---

## Lighthouse Scores (Production Build)
| Category       | Score |
|----------------|-------|
| Performance    | 100   |
| Accessibility  | 97    |
| Best Practices | 100   |
| SEO            | 100   |

---

## Tech Stack
| Layer      | Technology       | Version  |
|------------|------------------|----------|
| Frontend   | Next.js          | 15.5.9   |
| Runtime    | Node.js          | 22.11.0  |
| Package    | NPM              | 10.9.0   |
| Database   | MySQL + Prisma   | 5.22.0   |
| CMS        | Drupal           | 10.5.6   |
| Language   | PHP              | 8.1      |

---

## Quick Start

### Prerequisites
- Node.js 22.11.0+
- MySQL running locally (via MySQL Workbench / XAMPP)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create MySQL database
Run in MySQL Workbench:
```sql
CREATE DATABASE fincal_retirement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3 — Configure environment
Edit `.env`:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/fincal_retirement"
```

### Step 4 — Push database schema
```bash
npx prisma db push
```
Creates 3 tables: `Calculation`, `SavedPlan`, `DailyAnalytics`

### Step 5 — Build and start
```bash
npm run build
npm start
```

### Step 6 — Open in browser
| URL | Page |
|-----|------|
| http://localhost:3000 | Calculator |
| http://localhost:3000/plans | Saved Plans |
| http://localhost:3000/analytics | Analytics Dashboard |

---

## API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Calculate (flat SIP)
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"currentAge":28,"retirementAge":60,"lifeExpectancy":85,"currentAnnualExpenses":600000,"inflationRate":6,"preRetirementReturn":12,"postRetirementReturn":7,"stepUpRate":0}'

# Calculate (step-up SIP)
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"currentAge":28,"retirementAge":60,"lifeExpectancy":85,"currentAnnualExpenses":600000,"inflationRate":6,"preRetirementReturn":12,"postRetirementReturn":7,"stepUpRate":10}'

# List saved plans
curl http://localhost:3000/api/plans

# Analytics
curl http://localhost:3000/api/analytics
```

---

## Financial Formula
**Step 1 — Inflate Expenses**
```
Retirement Expense = Current Expense × (1 + inflation)^years
```

**Step 2 — Retirement Corpus (PV of Annuity)**
```
Corpus = Annual Expense × [(1 − (1+r)^−t) ÷ r]
```

**Step 3 — Required Monthly SIP**
```
SIP = Corpus × r ÷ [((1+r)^n − 1) × (1+r)]
```

---

## Features
- 3-step financial calculation (exact formula match)
- Step-Up SIP toggle (annual % increase)
- Save / Load / Delete named plans (MySQL)
- Analytics dashboard with usage stats
- Drupal 10 REST API + Block plugin
- WCAG 2.1 AA (Lighthouse 97/100)
- Skeleton loader + Error boundaries
- Share / Print PDF summary
- Mobile responsive (480px, 780px breakpoints)

---

## Disclaimer
This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
