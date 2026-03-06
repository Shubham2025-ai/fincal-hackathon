"use client";

import { useState } from "react";
import { formatINR } from "@/lib/financeCalc";

const C = { blue: "#224c87", blueDark: "#1a3a6b", greyText: "#595959", red: "#b91c1c" };

export default function SavePlanModal({ results, inputs, onClose, onSaved }) {
  const [name,    setName]    = useState("");
  const [notes,   setNotes]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setError("Please enter a plan name."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, notes, inputs, results }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Save failed");
      setSuccess(true);
      onSaved?.(data.plan);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Close on Escape
  const handleKey = (e) => { if (e.key === "Escape") onClose(); };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-modal-title"
      onKeyDown={handleKey}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box" style={{ maxWidth: 440 }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px 16px", borderBottom: "1px solid #dde6f5",
        }}>
          <h2 id="save-modal-title" style={{
            fontSize: 16, fontWeight: 800, color: C.blueDark,
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif", margin: 0,
          }}>
            💾 Save Plan
          </h2>
          <button onClick={onClose} aria-label="Close" style={{
            background: "none", border: "none", fontSize: 22,
            color: C.greyText, cursor: "pointer", padding: "2px 6px",
          }}>×</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Quick summary */}
          <div style={{
            background: "#eef3fb", borderRadius: 10, padding: "12px 16px",
            marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          }}>
            {[
              { label: "Monthly SIP",   value: formatINR(results.requiredMonthlySIP) },
              { label: "Target Corpus", value: formatINR(results.retirementCorpus)   },
              { label: "Retire at",     value: `Age ${inputs.retirementAge}`         },
              { label: "Mode",          value: inputs.isStepUp ? `Step-Up ${inputs.stepUpRate}%` : "Flat SIP" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.greyText,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.blueDark,
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Plan name input */}
          <label htmlFor="plan-name" style={{
            fontSize: 12, fontWeight: 700, color: C.blueDark,
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            display: "block", marginBottom: 6,
          }}>
            Plan Name *
          </label>
          <input
            id="plan-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            placeholder="e.g. My Conservative Plan"
            maxLength={80}
            autoFocus
            style={{
              width: "100%", padding: "9px 12px", fontSize: 14,
              border: `1.5px solid ${error ? C.red : "#dde6f5"}`,
              borderRadius: 8, fontFamily: "Arial, sans-serif",
              outline: "none", boxSizing: "border-box", marginBottom: 14,
            }}
          />

          {/* Notes */}
          <label htmlFor="plan-notes" style={{
            fontSize: 12, fontWeight: 700, color: C.blueDark,
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            display: "block", marginBottom: 6,
          }}>
            Notes <span style={{ fontWeight: 400, color: C.greyText }}>(optional)</span>
          </label>
          <textarea
            id="plan-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Conservative assumptions, revisit in 2027"
            maxLength={300}
            rows={2}
            style={{
              width: "100%", padding: "9px 12px", fontSize: 13,
              border: "1.5px solid #dde6f5", borderRadius: 8,
              fontFamily: "Arial, sans-serif", resize: "vertical",
              outline: "none", boxSizing: "border-box", marginBottom: 16,
            }}
          />

          {/* Error / success */}
          {error && (
            <p role="alert" style={{ color: C.red, fontSize: 12, margin: "0 0 12px",
              fontFamily: "Arial, sans-serif" }}>
              ⚠ {error}
            </p>
          )}
          {success && (
            <p role="status" style={{ color: "#166534", fontSize: 13, margin: "0 0 12px",
              fontWeight: 700, fontFamily: "Arial, sans-serif" }}>
              ✓ Plan saved successfully!
            </p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSave}
              disabled={saving || success}
              style={{
                flex: 1, padding: "10px 16px",
                background: success ? "#166534" : C.blue,
                color: "#fff", border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving…" : success ? "✓ Saved!" : "Save Plan"}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "10px 16px", background: "none",
                color: C.blue, border: `1.5px solid ${C.blue}`,
                borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
