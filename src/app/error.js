"use client";

/**
 * Next.js App Router error boundary.
 * Catches server-side and client-side errors at the route level.
 * Shown when an unhandled error bubbles up from the page.
 */

export default function Error({ error, reset }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "40px 36px",
        maxWidth: 520,
        width: "100%",
        boxShadow: "0 4px 32px rgba(34,76,135,0.10)",
        textAlign: "center",
        border: "1.5px solid #dde6f5",
      }}>
        <div aria-hidden="true" style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#fff1f2", border: "2px solid #fca5a5",
          margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24,
        }}>
          ⚠️
        </div>

        <h1 style={{
          fontSize: 20, fontWeight: 800, color: "#1a3a6b",
          fontFamily: "Montserrat, sans-serif", margin: "0 0 10px",
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: 14, color: "#595959", lineHeight: 1.6, margin: "0 0 24px",
        }}>
          An unexpected error occurred. Please try again or reload the page.
        </p>

        {process.env.NODE_ENV === "development" && error?.message && (
          <pre style={{
            background: "#f9fafb", border: "1px solid #dde6f5",
            borderRadius: 8, padding: "10px 12px",
            fontSize: 11, color: "#b91c1c", textAlign: "left",
            overflowX: "auto", marginBottom: 24,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {error.message}
          </pre>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              background: "#224c87", color: "#fff",
              border: "none", borderRadius: 8,
              padding: "10px 24px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              background: "none", color: "#224c87",
              border: "1.5px solid #224c87", borderRadius: 8,
              padding: "10px 24px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            }}
          >
            Go Home
          </button>
        </div>

        <p style={{ fontSize: 10, color: "#595959", marginTop: 24, lineHeight: 1.5 }}>
          FinCal Retirement Calculator | HDFC Mutual Fund × Technex &#8217;26, IIT BHU
        </p>
      </div>
    </div>
  );
}
