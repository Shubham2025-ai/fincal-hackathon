"use client";

/**
 * ResultCard — Metric display card with left accent bar.
 */

export default function ResultCard({ label, value, sub, accentColor, large }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1.5px solid #dde6f5",
      borderRadius: 12,
      padding: large ? "20px 18px" : "14px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Left accent bar — decorative */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0,
          width: 4, height: "100%",
          background: accentColor,
          borderRadius: "12px 0 0 12px",
        }}
      />
      <div style={{ paddingLeft: 10 }}>
        <div style={{
          fontSize: 10, color: "#595959",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: 6,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: large ? 24 : 20,
          fontWeight: 900, color: "#1a3a6b",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          lineHeight: 1.1,
        }}>
          {value}
        </div>
        {sub && (
          <div style={{
            fontSize: 11, color: "#595959",
            marginTop: 4, fontFamily: "Arial, sans-serif",
          }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
