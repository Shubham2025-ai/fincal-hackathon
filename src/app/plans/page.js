"use client";

import { useState, useEffect, useCallback } from "react";
import { formatINR } from "@/lib/financeCalc";
import Link from "next/link";

const C = { blue: "#224c87", blueDark: "#1a3a6b", greyText: "#595959", red: "#b91c1c", bgPage: "#f4f7fb" };

export default function PlansPage() {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/plans");
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setPlans(data.plans);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/plans/${id}`, { method: "DELETE" });
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete plan.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bgPage, fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: C.blue, borderBottom: "4px solid #da3832", padding: "22px 0",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", margin: "0 0 4px",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              HDFC Mutual Fund × FinCal — Technex &#8217;26
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
              Saved Plans
            </h1>
          </div>
          <Link href="/" style={{
            background: "rgba(255,255,255,0.15)", color: "#fff",
            border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8,
            padding: "8px 18px", fontSize: 13, fontWeight: 700,
            textDecoration: "none",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}>
            ← Calculator
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.greyText }}>
            Loading plans…
          </div>
        )}

        {error && (
          <div role="alert" style={{
            background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: 12,
            padding: "16px 20px", color: C.red, marginBottom: 20,
          }}>
            Error: {error}
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "60px 40px",
            textAlign: "center", boxShadow: "0 2px 20px rgba(34,76,135,0.07)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.blueDark,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif", margin: "0 0 8px" }}>
              No saved plans yet
            </h2>
            <p style={{ color: C.greyText, marginBottom: 24 }}>
              Go to the calculator and click &quot;Save Plan&quot; to save your first retirement plan.
            </p>
            <Link href="/" style={{
              background: C.blue, color: "#fff", borderRadius: 8,
              padding: "10px 28px", fontSize: 14, fontWeight: 700,
              textDecoration: "none",
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}>
              Open Calculator
            </Link>
          </div>
        )}

        {/* Plans grid */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              background: "#fff", borderRadius: 14,
              boxShadow: "0 2px 16px rgba(34,76,135,0.08)",
              border: "1.5px solid #dde6f5", overflow: "hidden",
            }}>
              {/* Card header */}
              <div style={{
                background: "#eef3fb", padding: "14px 18px",
                borderBottom: "1px solid #dde6f5",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: C.blueDark,
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    margin: "0 0 3px" }}>
                    {plan.name}
                  </h2>
                  <div style={{ fontSize: 10, color: C.greyText }}>
                    {new Date(plan.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    {" · "}
                    <span style={{
                      background: plan.mode === "stepup" ? "#e0f2fe" : "#f0fdf4",
                      color:      plan.mode === "stepup" ? "#0369a1" : "#166534",
                      padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                    }}>
                      {plan.mode === "stepup" ? `Step-Up ${plan.stepUpRate}%` : "Flat SIP"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(plan.id, plan.name)}
                  disabled={deleting === plan.id}
                  aria-label={`Delete ${plan.name}`}
                  style={{
                    background: "none", border: "none", color: "#fca5a5",
                    fontSize: 18, cursor: "pointer", padding: "0 2px",
                  }}
                >
                  🗑
                </button>
              </div>

              {/* Metrics */}
              <div style={{ padding: "14px 18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  {[
                    { label: "Monthly SIP",   value: formatINR(plan.requiredMonthlySIP) },
                    { label: "Corpus Needed", value: formatINR(plan.retirementCorpus)   },
                    { label: "Retire at",     value: `Age ${plan.retirementAge}`        },
                    { label: "Sustainable",   value: plan.isSustainable ? "✓ Yes" : "⚠ No",
                      color: plan.isSustainable ? "#166534" : C.red },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: C.greyText,
                        textTransform: "uppercase", letterSpacing: "0.07em",
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        marginBottom: 2 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: color ?? C.blueDark,
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {plan.notes && (
                  <p style={{ fontSize: 11, color: C.greyText, margin: "8px 0 0",
                    fontStyle: "italic", lineHeight: 1.5 }}>
                    {plan.notes}
                  </p>
                )}

                {/* Load plan link */}
                <Link
                  href={`/?plan=${plan.id}`}
                  style={{
                    display: "block", textAlign: "center", marginTop: 12,
                    background: C.blue, color: "#fff", borderRadius: 7,
                    padding: "8px 0", fontSize: 12, fontWeight: 700,
                    textDecoration: "none",
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  Load Plan →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
