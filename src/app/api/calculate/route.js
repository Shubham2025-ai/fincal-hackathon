/**
 * POST /api/calculate
 *
 * Drupal-compatible REST endpoint for the Retirement Planning Calculator.
 * Designed to be consumed by Drupal 10 via its REST module or via a
 * custom Drupal module using Guzzle HTTP client.
 *
 * ── Request (JSON body) ─────────────────────────────────────────────────────
 * {
 *   "currentAge":            28,       // integer, 18–55
 *   "retirementAge":         60,       // integer, currentAge+2 to 75
 *   "lifeExpectancy":        85,       // integer, retirementAge+2 to 100
 *   "currentAnnualExpenses": 600000,   // number, 120000–5000000 (INR)
 *   "inflationRate":         6,        // number, 2–12 (%)
 *   "preRetirementReturn":   12,       // number, 4–18 (%)
 *   "postRetirementReturn":  7,        // number, 4–12 (%)
 *   "stepUpRate":            0         // number, 0–25 (%) — 0 = flat SIP mode
 * }
 *
 * ── Response 200 (JSON) ─────────────────────────────────────────────────────
 * {
 *   "success": true,
 *   "mode": "flat" | "stepup",
 *   "inputs": { ...validated inputs },
 *   "results": {
 *     "requiredMonthlySIP":      10007,
 *     "finalMonthlySIP":         null | 26000,   // step-up only
 *     "retirementCorpus":        45100000,
 *     "retirementAnnualExpense": 3872000,
 *     "totalInvested":           3840000,
 *     "wealthGained":            41260000,
 *     "yearsToRetirement":       32,
 *     "retirementDuration":      25,
 *     "isSustainable":           true,
 *     "remainingCorpus":         1200000,
 *     "accumulationData": [...],
 *     "drawdownData":     [...]
 *   },
 *   "disclaimer": "..."
 * }
 *
 * ── Response 400 (JSON) ─────────────────────────────────────────────────────
 * { "success": false, "errors": ["field: message", ...] }
 *
 * ── CORS ────────────────────────────────────────────────────────────────────
 * Allows requests from Drupal origins. Configure DRUPAL_ORIGIN env var.
 * Defaults to * in development (NODE_ENV !== "production").
 *
 * ── Usage from Drupal (PHP / Guzzle) ────────────────────────────────────────
 * See /docs/drupal-integration.md for a full example Drupal custom module.
 */

import {
  calculateRetirement,
  calculateStepUpRetirement,
} from "@/lib/financeCalc";
import prisma from "@/lib/prisma";

// ─── CORS helper ─────────────────────────────────────────────────────────────
function corsHeaders(origin) {
  const allowed =
    process.env.DRUPAL_ORIGIN ||
    (process.env.NODE_ENV !== "production" ? "*" : null);

  if (!allowed) return {};

  return {
    "Access-Control-Allow-Origin":  allowed === "*" ? "*" : origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, X-Drupal-Cache",
    "Access-Control-Max-Age":       "86400",
  };
}

// ─── Input validation ─────────────────────────────────────────────────────────
function validateInputs(body) {
  const errors = [];

  const rules = [
    { field: "currentAge",            min: 18,     max: 55,      required: true,  integer: true  },
    { field: "retirementAge",         min: 20,     max: 75,      required: true,  integer: true  },
    { field: "lifeExpectancy",        min: 22,     max: 100,     required: true,  integer: true  },
    { field: "currentAnnualExpenses", min: 120000, max: 5000000, required: true,  integer: false },
    { field: "inflationRate",         min: 2,      max: 12,      required: true,  integer: false },
    { field: "preRetirementReturn",   min: 4,      max: 18,      required: true,  integer: false },
    { field: "postRetirementReturn",  min: 4,      max: 12,      required: true,  integer: false },
    { field: "stepUpRate",            min: 0,      max: 25,      required: false, integer: false },
  ];

  for (const rule of rules) {
    const val = body[rule.field];

    if (rule.required && (val === undefined || val === null || val === "")) {
      errors.push(`${rule.field}: required`);
      continue;
    }
    if (val === undefined || val === null) continue;

    const num = Number(val);
    if (isNaN(num)) {
      errors.push(`${rule.field}: must be a number`);
      continue;
    }
    if (rule.integer && !Number.isInteger(num)) {
      errors.push(`${rule.field}: must be an integer`);
    }
    if (num < rule.min) {
      errors.push(`${rule.field}: minimum is ${rule.min}`);
    }
    if (num > rule.max) {
      errors.push(`${rule.field}: maximum is ${rule.max}`);
    }
  }

  // Cross-field validation
  const ca = Number(body.currentAge);
  const ra = Number(body.retirementAge);
  const le = Number(body.lifeExpectancy);

  if (!isNaN(ca) && !isNaN(ra) && ra <= ca + 1) {
    errors.push("retirementAge: must be at least 2 years greater than currentAge");
  }
  if (!isNaN(ra) && !isNaN(le) && le <= ra + 1) {
    errors.push("lifeExpectancy: must be at least 2 years greater than retirementAge");
  }

  return errors;
}

// ─── Preflight (OPTIONS) ──────────────────────────────────────────────────────
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...corsHeaders(origin),
  };

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, errors: ["Request body must be valid JSON"] },
      { status: 400, headers }
    );
  }

  // Validate
  const errors = validateInputs(body);
  if (errors.length > 0) {
    return Response.json(
      { success: false, errors },
      { status: 400, headers }
    );
  }

  // Parse inputs
  const params = {
    currentAge:            parseInt(body.currentAge, 10),
    retirementAge:         parseInt(body.retirementAge, 10),
    lifeExpectancy:        parseInt(body.lifeExpectancy, 10),
    currentAnnualExpenses: Number(body.currentAnnualExpenses),
    inflationRate:         Number(body.inflationRate),
    preRetirementReturn:   Number(body.preRetirementReturn),
    postRetirementReturn:  Number(body.postRetirementReturn),
  };

  const stepUpRate = Number(body.stepUpRate ?? 0);
  const isStepUp   = stepUpRate > 0;

  // Calculate
  let results;
  try {
    results = isStepUp
      ? calculateStepUpRetirement({ ...params, stepUpRate })
      : calculateRetirement(params);
  } catch (err) {
    return Response.json(
      { success: false, errors: [`Calculation error: ${err.message}`] },
      { status: 500, headers }
    );
  }

  // Shape response — strip internal flags, keep only serialisable data
  const {
    yearsToRetirement,
    retirementDuration,
    retirementAnnualExpense,
    retirementCorpus,
    requiredMonthlySIP,
    finalMonthlySIP,
    totalInvested,
    wealthGained,
    isSustainable,
    remainingCorpus,
    accumulationData,
    drawdownData,
  } = results;

  // ── Log calculation to database (non-blocking) ──────────────────────────
  try {
    await prisma.calculation.create({
      data: {
        currentAge:            params.currentAge,
        retirementAge:         params.retirementAge,
        lifeExpectancy:        params.lifeExpectancy,
        currentAnnualExpenses: params.currentAnnualExpenses,
        inflationRate:         params.inflationRate,
        preRetirementReturn:   params.preRetirementReturn,
        postRetirementReturn:  params.postRetirementReturn,
        stepUpRate:            stepUpRate,
        mode:                  isStepUp ? "stepup" : "flat",
        requiredMonthlySIP:      requiredMonthlySIP,
        finalMonthlySIP:         finalMonthlySIP ?? null,
        retirementCorpus,
        retirementAnnualExpense,
        totalInvested,
        wealthGained,
        yearsToRetirement,
        retirementDuration,
        isSustainable,
      },
    });
  } catch {
    // DB errors must never break the API response
  }

  return Response.json(
    {
      success: true,
      mode: isStepUp ? "stepup" : "flat",
      inputs: {
        ...params,
        ...(isStepUp ? { stepUpRate } : {}),
      },
      results: {
        requiredMonthlySIP,
        finalMonthlySIP:        finalMonthlySIP ?? null,
        retirementCorpus,
        retirementAnnualExpense,
        totalInvested,
        wealthGained,
        yearsToRetirement,
        retirementDuration,
        isSustainable,
        remainingCorpus,
        accumulationData,
        drawdownData,
      },
      disclaimer:
        "This tool has been designed for information purposes only. " +
        "Actual results may vary depending on various factors involved in capital market. " +
        "Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. " +
        "Past performance may or may not be sustained in future and is not a guarantee of any future returns.",
    },
    { status: 200, headers }
  );
}

// ─── GET — friendly error ─────────────────────────────────────────────────────
export async function GET() {
  return Response.json(
    {
      success: false,
      errors: ["This endpoint only accepts POST requests."],
      docs: "Send a POST request with JSON body. See /docs/drupal-integration.md for usage.",
    },
    { status: 405 }
  );
}
