"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/financeCalc";

const C = { blue: "#224c87", blueDark: "#1a3a6b", red: "#da3832", greyText: "#595959", grey: "#919090" };

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      boxShadow: "0 2px 16px rgba(34,76,135,0.08)",
      border: "1.5px solid #dde6f5", overflow: "hidden",
    }}>
      <div style={{ height: 4, background: accent ?? C.blue }} />
      <div style={{ padding: "18px 20px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: C.greyText,
          textTransform: "uppercase", letterSpacing: "0.1em",
          fontFamily: "Montserrat, sans-serif", marginBottom: 8,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 28, fontWeight: 900, color: C.blueDark,
          fontFamily: "Montserrat, sans-serif", lineHeight: 1,
        }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: C.greyText, marginTop: 4, fontFamily: "Verdana, Arial, sans-serif" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function ModeBar({ flat, stepup }) {
  const total = flat + stepup;
  if (total === 0) return null;
  const flatPct  = Math.round((flat   / total) * 100);
  const stepPct  = Math.round((stepup / total) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.blueDark, fontFamily: "Montserrat, sans-serif" }}>
          Flat SIP — {flatPct}%
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", fontFamily: "Montserrat, sans-serif" }}>
          Step-Up — {stepPct}%
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: "#dde6f5", overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${flatPct}%`, background: C.blue, borderRadius: "5px 0 0 5px", transition: "width 0.6s" }} />
        <div style={{ width: `${stepPct}%`, background: "#0369a1", borderRadius: "0 5px 5px 0", transition: "width 0.6s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: C.greyText, fontFamily: "Arial, sans-serif" }}>{flat} calculations</span>
        <span style={{ fontSize: 10, color: C.greyText, fontFamily: "Arial, sans-serif" }}>{stepup} calculations</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.analytics); else setError(d.error); })
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fb", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header style={{ background: C.blue, borderBottom: `4px solid ${C.red}`, padding: "22px 0" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{
              fontSize: 10, color: "rgba(255,255,255,0.6)", margin: "0 0 4px",
              fontFamily: "Montserrat, sans-serif", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              HDFC Mutual Fund × FinCal — Technex &#8217;26
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, fontFamily: "Montserrat, sans-serif" }}>
              Analytics Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/plans" style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8,
              padding: "8px 16px", fontSize: 12, fontWeight: 700,
              textDecoration: "none", fontFamily: "Montserrat, sans-serif",
            }}>
              My Plans
            </Link>
            <Link href="/" style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8,
              padding: "8px 16px", fontSize: 12, fontWeight: 700,
              textDecoration: "none", fontFamily: "Montserrat, sans-serif",
            }}>
              ← Calculator
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.greyText, fontSize: 16 }}>
            Loading analytics…
          </div>
        )}

        {error && (
          <div role="alert" style={{
            background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: 12,
            padding: "16px 20px", color: "#b91c1c",
          }}>
            {error} — make sure the database is connected and has data.
          </div>
        )}

        {data && (
          <>
            {/* Top stat cards */}
            <div style={{
              display: "grid", gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginBottom: 24,
            }}>
              <StatCard
                label="Total Calculations"
                value={data.totals.calculations.toLocaleString()}
                sub="All-time API calls"
                accent={C.blue}
              />
              <StatCard
                label="Saved Plans"
                value={data.totals.savedPlans.toLocaleString()}
                sub="Named plans in DB"
                accent={C.red}
              />
              <StatCard
                label="Avg Monthly SIP"
                value={formatINR(data.averages.monthlySIP)}
                sub="Across all calculations"
                accent="#0369a1"
              />
              <StatCard
                label="Avg Corpus Needed"
                value={formatINR(data.averages.corpus)}
                sub="Across all calculations"
                accent="#166534"
              />
              <StatCard
                label="Largest Corpus"
                value={formatINR(data.extremes.maxCorpus)}
                sub="Highest single result"
                accent="#7c3aed"
              />
              <StatCard
                label="Lowest SIP"
                value={formatINR(data.extremes.minSIP)}
                sub="Best case SIP found"
                accent="#b45309"
              />
            </div>

            {/* Middle row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {/* Mode breakdown */}
              <div style={{
                background: "#fff", borderRadius: 14,
                boxShadow: "0 2px 16px rgba(34,76,135,0.08)",
                border: "1.5px solid #dde6f5", padding: "20px 24px",
              }}>
                <h2 style={{
                  fontSize: 13, fontWeight: 800, color: C.blueDark,
                  fontFamily: "Montserrat, sans-serif", margin: "0 0 18px",
                }}>
                  SIP Mode Breakdown
                </h2>
                <ModeBar flat={data.modes.flat} stepup={data.modes.stepup} />
              </div>

              {/* Average profile */}
              <div style={{
                background: "#fff", borderRadius: 14,
                boxShadow: "0 2px 16px rgba(34,76,135,0.08)",
                border: "1.5px solid #dde6f5", padding: "20px 24px",
              }}>
                <h2 style={{
                  fontSize: 13, fontWeight: 800, color: C.blueDark,
                  fontFamily: "Montserrat, sans-serif", margin: "0 0 18px",
                }}>
                  Average User Profile
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Current Age",    value: `${data.averages.currentAge} yrs`    },
                    { label: "Retirement Age", value: `${data.averages.retirementAge} yrs` },
                    { label: "Total Invested", value: formatINR(data.averages.totalInvested) },
                    { label: "Corpus Target",  value: formatINR(data.averages.corpus)        },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: "#eef3fb", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{
                        fontSize: 9, fontWeight: 700, color: C.greyText,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontFamily: "Montserrat, sans-serif", marginBottom: 4,
                      }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.blueDark, fontFamily: "Montserrat, sans-serif" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent calculations table */}
            <div style={{
              background: "#fff", borderRadius: 14,
              boxShadow: "0 2px 16px rgba(34,76,135,0.08)",
              border: "1.5px solid #dde6f5", marginBottom: 24, overflow: "hidden",
            }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #dde6f5" }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, color: C.blueDark, fontFamily: "Montserrat, sans-serif", margin: 0 }}>
                  Recent Calculations
                </h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#eef3fb" }}>
                      {["ID", "Date", "Age", "Retires at", "Mode", "Monthly SIP", "Corpus", "Sustainable"].map((h) => (
                        <th key={h} style={{
                          padding: "10px 16px", textAlign: "left", fontWeight: 700,
                          color: C.blueDark, fontFamily: "Montserrat, sans-serif",
                          fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em",
                          borderBottom: "1px solid #dde6f5",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentCalculations.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: "24px", textAlign: "center", color: C.greyText }}>
                          No calculations yet — use the calculator to generate data.
                        </td>
                      </tr>
                    ) : data.recentCalculations.map((c, i) => (
                      <tr key={c.id} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                        <td style={{ padding: "10px 16px", color: C.greyText }}>#{c.id}</td>
                        <td style={{ padding: "10px 16px", color: C.greyText }}>
                          {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: C.blueDark }}>{c.currentAge}</td>
                        <td style={{ padding: "10px 16px", color: C.greyText }}>{c.retirementAge}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{
                            background: c.mode === "stepup" ? "#e0f2fe" : "#f0fdf4",
                            color: c.mode === "stepup" ? "#0369a1" : "#166534",
                            padding: "2px 7px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                          }}>
                            {c.mode === "stepup" ? "Step-Up" : "Flat"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: C.blueDark }}>
                          {formatINR(c.requiredMonthlySIP)}
                        </td>
                        <td style={{ padding: "10px 16px", fontWeight: 700, color: C.blueDark }}>
                          {formatINR(c.retirementCorpus)}
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ color: c.isSustainable ? "#166534" : "#b91c1c", fontWeight: 700 }}>
                            {c.isSustainable ? "✓ Yes" : "⚠ No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top corpus table */}
            {data.topCorpusCalculations.length > 0 && (
              <div style={{
                background: "#fff", borderRadius: 14,
                boxShadow: "0 2px 16px rgba(34,76,135,0.08)",
                border: "1.5px solid #dde6f5", overflow: "hidden",
              }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #dde6f5" }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: C.blueDark, fontFamily: "Montserrat, sans-serif", margin: 0 }}>
                    Top 3 Largest Corpus Calculations
                  </h2>
                </div>
                <div style={{ padding: "16px 24px", display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {data.topCorpusCalculations.map((c, i) => (
                    <div key={c.id} style={{
                      flex: "1 1 200px", background: "#eef3fb", borderRadius: 10,
                      padding: "14px 18px", border: "1.5px solid #dde6f5",
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: C.greyText,
                        fontFamily: "Montserrat, sans-serif", marginBottom: 6,
                      }}>
                        #{i + 1} — Calculation #{c.id}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: C.blueDark, fontFamily: "Montserrat, sans-serif" }}>
                        {formatINR(c.retirementCorpus)}
                      </div>
                      <div style={{ fontSize: 11, color: C.greyText, marginTop: 4, fontFamily: "Arial, sans-serif" }}>
                        SIP: {formatINR(c.requiredMonthlySIP)} · Age {c.currentAge}→{c.retirementAge}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <aside style={{
              marginTop: 32, background: "#f9fafb", border: "1px solid #dde6f5",
              borderRadius: 10, padding: "14px 18px",
              fontSize: 10, color: C.greyText, lineHeight: 1.7,
              fontFamily: "Verdana, Arial, sans-serif",
            }}>
              <strong style={{ fontFamily: "Montserrat, sans-serif", color: C.blueDark }}>Disclaimer: </strong>
              This tool has been designed for information purposes only. Actual results may vary depending on
              various factors involved in capital market. Investor should not consider above as a recommendation
              for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and
              is not a guarantee of any future returns.
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
