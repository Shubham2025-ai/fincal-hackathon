/**
 * FinCal Hackathon – Retirement Planning Financial Logic
 *
 * All formulas follow industry-standard methodology as specified in the
 * FinCal Innovation Hackathon problem statement (Technex '26, IIT BHU).
 *
 * These are ILLUSTRATIVE calculations only. Results are not guaranteed.
 * Assumptions must be disclosed and remain user-editable per spec.
 */

"use strict";

// ─── Core Calculations ────────────────────────────────────────────────────────

/**
 * Step 1 — Inflate current annual expenses to retirement date.
 * Formula: FV = PV × (1 + i)^n
 *
 * @param {number} currentAnnualExpenses  - Today's annual living expenses (₹)
 * @param {number} inflationRate          - Annual inflation rate (%)
 * @param {number} yearsToRetirement      - Number of years until retirement
 * @returns {number} Inflation-adjusted annual expense at retirement
 */
export function inflateExpenses(currentAnnualExpenses, inflationRate, yearsToRetirement) {
  const i = inflationRate / 100;
  return currentAnnualExpenses * Math.pow(1 + i, yearsToRetirement);
}

/**
 * Step 2 — Calculate required retirement corpus via Present Value of Annuity.
 * Formula: PV = A × [(1 − (1 + r)^−t) ÷ r]
 *
 * @param {number} annualExpenseAtRetirement - Annual expense at retirement date (₹)
 * @param {number} postRetirementReturn      - Annual return on corpus post-retirement (%)
 * @param {number} retirementDurationYears   - Number of years corpus must sustain
 * @returns {number} Required corpus at retirement
 */
export function calcRetirementCorpus(
  annualExpenseAtRetirement,
  postRetirementReturn,
  retirementDurationYears
) {
  const r = postRetirementReturn / 100;
  const t = retirementDurationYears;
  return annualExpenseAtRetirement * ((1 - Math.pow(1 + r, -t)) / r);
}

/**
 * Step 3 — Calculate required monthly SIP (beginning-of-period).
 * Formula: SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
 *
 * @param {number} targetCorpus        - Corpus to accumulate (₹)
 * @param {number} preRetirementReturn - Annual return during accumulation phase (%)
 * @param {number} yearsToRetirement   - Investment duration (years)
 * @returns {number} Required monthly SIP amount
 */
export function calcRequiredSIP(targetCorpus, preRetirementReturn, yearsToRetirement) {
  const r = preRetirementReturn / 100 / 12; // monthly rate
  const n = yearsToRetirement * 12;          // total months
  return (targetCorpus * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
}

/**
 * Generate year-by-year accumulation data.
 *
 * @param {number} monthlySIP         - Monthly SIP amount (₹)
 * @param {number} preRetirementReturn - Annual return (%)
 * @param {number} startAge           - Current age
 * @param {number} years              - Number of years to project
 * @returns {Array<{age, corpus, invested, label}>}
 */
export function buildAccumulationData(monthlySIP, preRetirementReturn, startAge, years) {
  const mr = preRetirementReturn / 100 / 12;
  let corpus = 0;
  const data = [];

  for (let y = 1; y <= years; y++) {
    corpus =
      corpus * Math.pow(1 + mr, 12) +
      monthlySIP * ((Math.pow(1 + mr, 12) - 1) / mr) * (1 + mr);
    data.push({
      age:      startAge + y,
      corpus:   Math.round(corpus),
      invested: Math.round(monthlySIP * 12 * y),
      label:    `Age ${startAge + y}`,
    });
  }
  return data;
}

/**
 * Generate year-by-year drawdown data.
 * Expenses continue to inflate during retirement.
 *
 * @param {number} startCorpus              - Corpus at retirement (₹)
 * @param {number} annualExpenseAtRetirement - Annual expense at retirement start (₹)
 * @param {number} inflationRate            - Annual inflation rate (%)
 * @param {number} postRetirementReturn     - Annual return on remaining corpus (%)
 * @param {number} retirementAge            - Age at retirement
 * @param {number} durationYears            - Years of retirement to simulate
 * @returns {Array<{age, corpus, label}>}
 */
export function buildDrawdownData(
  startCorpus,
  annualExpenseAtRetirement,
  inflationRate,
  postRetirementReturn,
  retirementAge,
  durationYears
) {
  const inf = inflationRate       / 100;
  const mpr = postRetirementReturn / 100 / 12;
  let remaining = startCorpus;
  const data = [];

  for (let y = 1; y <= durationYears; y++) {
    // Expense rises each retirement year
    const yearlyExpense  = annualExpenseAtRetirement * Math.pow(1 + inf, y - 1);
    const monthlyExpense = yearlyExpense / 12;

    for (let m = 0; m < 12; m++) {
      remaining = remaining * (1 + mpr) - monthlyExpense;
      if (remaining < 0) remaining = 0;
    }
    data.push({
      age:    retirementAge + y,
      corpus: Math.round(remaining),
      label:  `Age ${retirementAge + y}`,
    });
  }
  return data;
}

/**
 * Master calculation — runs all 3 steps and returns the full results object.
 *
 * @param {Object} params
 * @returns {Object} Full results including SIP, corpus, projections
 */
export function calculateRetirement({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentAnnualExpenses,
  inflationRate,
  preRetirementReturn,
  postRetirementReturn,
}) {
  const yearsToRetirement  = retirementAge - currentAge;
  const retirementDuration = lifeExpectancy - retirementAge;

  // Step 1
  const retirementAnnualExpense = inflateExpenses(
    currentAnnualExpenses,
    inflationRate,
    yearsToRetirement
  );

  // Step 2
  const retirementCorpus = calcRetirementCorpus(
    retirementAnnualExpense,
    postRetirementReturn,
    retirementDuration
  );

  // Step 3
  const requiredMonthlySIP = calcRequiredSIP(
    retirementCorpus,
    preRetirementReturn,
    yearsToRetirement
  );

  const totalInvested  = Math.round(requiredMonthlySIP * 12 * yearsToRetirement);
  const wealthGained   = Math.round(retirementCorpus - totalInvested);

  const accumulationData = buildAccumulationData(
    requiredMonthlySIP,
    preRetirementReturn,
    currentAge,
    yearsToRetirement
  );

  const drawdownData = buildDrawdownData(
    retirementCorpus,
    retirementAnnualExpense,
    inflationRate,
    postRetirementReturn,
    retirementAge,
    retirementDuration
  );

  return {
    yearsToRetirement,
    retirementDuration,
    retirementAnnualExpense: Math.round(retirementAnnualExpense),
    retirementCorpus:        Math.round(retirementCorpus),
    requiredMonthlySIP:      Math.round(requiredMonthlySIP),
    totalInvested,
    wealthGained,
    accumulationData,
    drawdownData,
    // Corpus sustainability flag
    isSustainable: drawdownData.at(-1)?.corpus > 0,
    remainingCorpus: drawdownData.at(-1)?.corpus ?? 0,
  };
}

// ─── Formatter ───────────────────────────────────────────────────────────────

/**
 * Format a number as Indian Rupee notation (Lakhs / Crores).
 *
 * @param {number} n
 * @returns {string} e.g. "₹12.50 L" or "₹2.34 Cr"
 */
export function formatINR(n) {
  if (!isFinite(n) || n < 0) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

// ─── Step-Up SIP Logic ────────────────────────────────────────────────────────

/**
 * Calculate required FIRST month's SIP under a Step-Up (Top-Up) SIP plan.
 *
 * In a Step-Up SIP the investor increases their monthly SIP by a fixed
 * percentage every year (e.g. 10% p.a.).  The future value formula is:
 *
 *   FV = SIP₁ × Σ(y=0 to Y-1) [ (1+g)^y × ((1+r)^12(Y-y) − 1) / r × (1+r) ]
 *
 * where:
 *   SIP₁  = first month's SIP
 *   g     = annual step-up rate (decimal)
 *   r     = monthly pre-retirement return (decimal)
 *   Y     = total years to retirement
 *
 * We solve numerically: iterate SIP₁ until FV converges to targetCorpus.
 * Binary search converges in < 60 iterations for any realistic input.
 *
 * @param {number} targetCorpus        - Corpus to accumulate (₹)
 * @param {number} preRetirementReturn - Annual return during accumulation (%)
 * @param {number} yearsToRetirement   - Investment duration (years)
 * @param {number} stepUpRate          - Annual SIP increase rate (%)
 * @returns {number} Required first month SIP
 */
export function calcStepUpSIP(
  targetCorpus,
  preRetirementReturn,
  yearsToRetirement,
  stepUpRate
) {
  const mr = preRetirementReturn / 100 / 12;  // monthly return
  const g  = stepUpRate / 100;                // annual step-up
  const Y  = yearsToRetirement;

  // FV of a step-up SIP with first monthly instalment = 1 (unit SIP)
  // Used as a multiplier to solve for actual SIP₁
  function fvPerUnitSIP() {
    let fv = 0;
    for (let y = 0; y < Y; y++) {
      // SIP in year (y+1) = (1+g)^y  (unit SIP grows each year)
      const sipThisYear = Math.pow(1 + g, y);
      // Months remaining after this year's SIPs complete
      const monthsRemaining = (Y - y - 1) * 12;
      // FV contribution of this year's 12 SIPs (beginning-of-period)
      const fvYear =
        sipThisYear *
        ((Math.pow(1 + mr, 12) - 1) / mr) *
        (1 + mr) *
        Math.pow(1 + mr, monthsRemaining);
      fv += fvYear;
    }
    return fv;
  }

  const multiplier = fvPerUnitSIP();
  return multiplier > 0 ? targetCorpus / multiplier : 0;
}

/**
 * Generate year-by-year accumulation data for a Step-Up SIP.
 *
 * @param {number} firstMonthlySIP      - First month's SIP amount (₹)
 * @param {number} preRetirementReturn  - Annual return (%)
 * @param {number} stepUpRate           - Annual SIP increase (%)
 * @param {number} startAge             - Current age
 * @param {number} years                - Number of years to project
 * @returns {Array<{age, corpus, invested, sipThisYear, label}>}
 */
export function buildStepUpAccumulationData(
  firstMonthlySIP,
  preRetirementReturn,
  stepUpRate,
  startAge,
  years
) {
  const mr = preRetirementReturn / 100 / 12;
  const g  = stepUpRate / 100;
  let corpus      = 0;
  let totalInvested = 0;
  const data = [];

  for (let y = 1; y <= years; y++) {
    const sipThisYear = firstMonthlySIP * Math.pow(1 + g, y - 1);
    corpus =
      corpus * Math.pow(1 + mr, 12) +
      sipThisYear * ((Math.pow(1 + mr, 12) - 1) / mr) * (1 + mr);
    totalInvested += sipThisYear * 12;
    data.push({
      age:         startAge + y,
      corpus:      Math.round(corpus),
      invested:    Math.round(totalInvested),
      sipThisYear: Math.round(sipThisYear),
      label:       `Age ${startAge + y}`,
    });
  }
  return data;
}

/**
 * Master calculation for Step-Up SIP mode.
 * Steps 1 & 2 (inflate expenses, corpus) are identical to flat SIP.
 * Step 3 uses calcStepUpSIP instead.
 *
 * @param {Object} params  - Same as calculateRetirement + stepUpRate
 * @returns {Object}       - Full results including step-up SIP data
 */
export function calculateStepUpRetirement({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentAnnualExpenses,
  inflationRate,
  preRetirementReturn,
  postRetirementReturn,
  stepUpRate,
}) {
  const base = calculateRetirement({
    currentAge, retirementAge, lifeExpectancy,
    currentAnnualExpenses, inflationRate,
    preRetirementReturn, postRetirementReturn,
  });

  const ytr = base.yearsToRetirement;

  // Step-Up SIP — first month's instalment
  const firstMonthlySIP = calcStepUpSIP(
    base.retirementCorpus,
    preRetirementReturn,
    ytr,
    stepUpRate
  );

  // Final year SIP amount
  const finalMonthlySIP = Math.round(firstMonthlySIP * Math.pow(1 + stepUpRate / 100, ytr - 1));

  const stepUpAccumulationData = buildStepUpAccumulationData(
    firstMonthlySIP,
    preRetirementReturn,
    stepUpRate,
    currentAge,
    ytr
  );

  const totalInvestedStepUp = stepUpAccumulationData.at(-1)?.invested ?? 0;

  return {
    ...base,
    // Override flat SIP fields with step-up equivalents
    requiredMonthlySIP:    Math.round(firstMonthlySIP),   // first month's SIP
    finalMonthlySIP,
    totalInvested:         totalInvestedStepUp,
    wealthGained:          Math.round(base.retirementCorpus - totalInvestedStepUp),
    accumulationData:      stepUpAccumulationData,
    isStepUp:              true,
    stepUpRate,
  };
}
