import Link from "next/link";

/**
 * Next.js App Router 404 page.
 */
export default function NotFound() {
  return (
    <div
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
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 4px 32px rgba(34,76,135,0.10)",
        textAlign: "center",
        border: "1.5px solid #dde6f5",
      }}>
        <div aria-hidden="true" style={{
          fontSize: 48, marginBottom: 16, lineHeight: 1,
        }}>
          🔍
        </div>

        <h1 style={{
          fontSize: 20, fontWeight: 800, color: "#1a3a6b",
          fontFamily: "Montserrat, sans-serif", margin: "0 0 10px",
        }}>
          Page Not Found
        </h1>

        <p style={{
          fontSize: 14, color: "#595959", lineHeight: 1.6, margin: "0 0 24px",
        }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#224c87", color: "#fff",
            borderRadius: 8, padding: "10px 28px",
            fontSize: 14, fontWeight: 700,
            textDecoration: "none",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Back to Calculator
        </Link>

        <p style={{ fontSize: 10, color: "#595959", marginTop: 24, lineHeight: 1.5 }}>
          FinCal Retirement Calculator | HDFC Mutual Fund × Technex &#8217;26, IIT BHU
        </p>
      </div>
    </div>
  );
}
