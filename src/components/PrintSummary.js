"use client";

/**
 * PrintSummary — A print-optimised summary of the retirement plan.
 * Triggered via window.print(). Hidden on screen, visible in print.
 * Also used for the on-screen "summary card" share view.
 */

import { formatINR } from "@/lib/financeCalc";

export default function PrintSummary({ results, inputs }) {
  if (!results) return null;

  const {
    currentAge, retirementAge, lifeExpectancy,
    currentAnnualExpenses, inflationRate,
    preRetirementReturn, postRetirementReturn,
    isStepUp, stepUpRate,
  } = inputs;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div id="print-summary" style={{ display: "none" }}>
      <style>{`
        @media print {
          /* Hide everything except print summary */
          body > * { display: none !important; }
          #print-summary { display: block !important; }

          #print-summary {
            font-family: Arial, sans-serif;
            color: #1a1a2e;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }

          .print-header {
            border-bottom: 3px solid #224c87;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }

          .print-title {
            font-family: Georgia, serif;
            font-size: 22px;
            font-weight: bold;
            color: #224c87;
            margin: 0 0 4px;
          }

          .print-subtitle {
            font-size: 11px;
            color: #595959;
            margin: 0;
          }

          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }

          .print-card {
            border: 1.5px solid #dde6f5;
            border-radius: 8px;
            padding: 12px 14px;
            border-left: 4px solid #224c87;
          }

          .print-card-label {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #595959;
            margin-bottom: 4px;
          }

          .print-card-value {
            font-size: 20px;
            font-weight: 900;
            color: #1a3a6b;
          }

          .print-card-sub {
            font-size: 10px;
            color: #595959;
            margin-top: 2px;
          }

          .print-section-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #224c87;
            margin: 18px 0 10px;
            border-bottom: 1px solid #dde6f5;
            padding-bottom: 4px;
          }

          .print-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 5px 0;
            border-bottom: 1px solid #f0f4fb;
          }

          .print-row-label { color: #595959; }
          .print-row-value { font-weight: 700; color: #1a3a6b; }

          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-top: 8px;
          }

          .print-table th {
            background: #224c87;
            color: white;
            padding: 6px 8px;
            text-align: left;
            font-size: 10px;
          }

          .print-table td {
            padding: 5px 8px;
            border-bottom: 1px solid #eef3fb;
          }

          .print-table tr:nth-child(even) td {
            background: #f4f7fb;
          }

          .print-disclaimer {
            font-size: 9px;
            color: #595959;
            line-height: 1.5;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #dde6f5;
          }

          .print-footer {
            font-size: 9px;
            color: #919090;
            text-align: center;
            margin-top: 12px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="print-header">
        <p className="print-title">Retirement Planning Summary</p>
        <p className="print-subtitle">
          FinCal Innovation Hackathon — Co-Sponsored by HDFC Mutual Fund &nbsp;|&nbsp; Generated: {today}
        </p>
      </div>

      {/* Key metrics */}
      <div className="print-grid">
        <div className="print-card">
          <div className="print-card-label">{isStepUp ? "Starting Monthly SIP" : "Monthly SIP Required"}</div>
          <div className="print-card-value">{formatINR(results.requiredMonthlySIP)}</div>
          <div className="print-card-sub">
            {isStepUp
              ? `Grows ${stepUpRate}%/yr → ${formatINR(results.finalMonthlySIP)}/mo`
              : `For ${results.yearsToRetirement} years`}
          </div>
        </div>
        <div className="print-card">
          <div className="print-card-label">Retirement Corpus Needed</div>
          <div className="print-card-value">{formatINR(results.retirementCorpus)}</div>
          <div className="print-card-sub">At age {retirementAge}</div>
        </div>
        <div className="print-card">
          <div className="print-card-label">Total Amount Invested</div>
          <div className="print-card-value">{formatINR(results.totalInvested)}</div>
          <div className="print-card-sub">Estimated gains: {formatINR(results.wealthGained)}</div>
        </div>
        <div className="print-card">
          <div className="print-card-label">Inflation-Adjusted Expenses</div>
          <div className="print-card-value">{formatINR(results.retirementAnnualExpense)}</div>
          <div className="print-card-sub">Annual at retirement</div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="print-section-title">Your Assumptions</div>
      {[
        ["Current Age",              `${currentAge} years`],
        ["Retirement Age",           `${retirementAge} years`],
        ["Life Expectancy",          `${lifeExpectancy} years`],
        ["Current Annual Expenses",  formatINR(currentAnnualExpenses)],
        ["Inflation Rate",           `${inflationRate}% p.a.`],
        ["Pre-Retirement Return",    `${preRetirementReturn}% p.a.`],
        ["Post-Retirement Return",   `${postRetirementReturn}% p.a.`],
        ...(isStepUp ? [["Step-Up Rate", `${stepUpRate}% p.a. annual SIP increase`]] : []),
      ].map(([label, val]) => (
        <div key={label} className="print-row">
          <span className="print-row-label">{label}</span>
          <span className="print-row-value">{val}</span>
        </div>
      ))}

      {/* How it's calculated */}
      <div className="print-section-title">Calculation Steps</div>
      {[
        [
          "Step 1 — Inflate Expenses",
          `${formatINR(currentAnnualExpenses)} × (1 + ${inflationRate}%)^${results.yearsToRetirement}`,
          `${formatINR(results.retirementAnnualExpense)}/yr`,
        ],
        [
          "Step 2 — Retirement Corpus (PV of Annuity)",
          `Expense × [(1 − (1+r)^−${results.retirementDuration}) ÷ r]`,
          formatINR(results.retirementCorpus),
        ],
        [
          "Step 3 — Required Monthly SIP",
          `Corpus × r ÷ [((1+r)^n − 1)(1+r)]`,
          `${formatINR(results.requiredMonthlySIP)}/mo`,
        ],
      ].map(([step, formula, result]) => (
        <div key={step} className="print-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{step}</span>
          <span style={{ fontSize: 10, color: "#595959" }}>{formula} = <strong>{result}</strong></span>
        </div>
      ))}

      {/* Year-by-year milestones (every 5 years) */}
      <div className="print-section-title">Corpus Growth Milestones</div>
      <table className="print-table">
        <thead>
          <tr>
            <th>Age</th>
            <th>Year</th>
            <th>Total Invested</th>
            <th>Estimated Corpus</th>
          </tr>
        </thead>
        <tbody>
          {results.accumulationData
            .filter((_, i, arr) => i % 5 === 4 || i === arr.length - 1)
            .map((d) => (
              <tr key={d.age}>
                <td>{d.age}</td>
                <td>{d.age - currentAge}</td>
                <td>{formatINR(d.invested)}</td>
                <td><strong>{formatINR(d.corpus)}</strong></td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Disclaimer */}
      <p className="print-disclaimer">
        <strong>DISCLAIMER:</strong> This tool has been designed for information purposes only.
        Actual results may vary depending on various factors involved in capital market. Investor
        should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past
        performance may or may not be sustained in future and is not a guarantee of any future returns.
      </p>
      <p className="print-footer">
        FinCal Innovation Hackathon | Technex &#8217;26, IIT BHU | Co-Sponsored by HDFC Mutual Fund
      </p>
    </div>
  );
}
