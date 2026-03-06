"use client";

/**
 * ErrorBoundary — React class component that catches runtime errors
 * anywhere in the calculator tree and renders a graceful fallback
 * instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <RetirementCalculator />
 *   </ErrorBoundary>
 *
 * WCAG: fallback uses role="alert" so screen readers announce the error.
 */

import { Component } from "react";

const C = {
  blue:     "#224c87",
  blueDark: "#1a3a6b",
  red:      "#b91c1c",
  greyText: "#595959",
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError:  false,
      errorMsg:  null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message ?? "Unknown error" };
  }

  componentDidCatch(error, info) {
    this.setState({ errorInfo: info?.componentStack ?? null });
    // In production you'd send this to an error reporting service
    if (process.env.NODE_ENV === "development") {
      console.error("[FinCal ErrorBoundary]", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMsg: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

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
          {/* Icon */}
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
            fontSize: 20, fontWeight: 800, color: C.blueDark,
            fontFamily: "Montserrat, sans-serif", margin: "0 0 10px",
          }}>
            Something went wrong
          </h1>

          <p style={{
            fontSize: 14, color: C.greyText, lineHeight: 1.6,
            margin: "0 0 24px",
          }}>
            The calculator encountered an unexpected error. Your inputs have not been saved.
            Please try refreshing the page or resetting the calculator.
          </p>

          {/* Error detail — dev only */}
          {process.env.NODE_ENV === "development" && this.state.errorMsg && (
            <pre style={{
              background: "#f9fafb", border: "1px solid #dde6f5",
              borderRadius: 8, padding: "10px 12px",
              fontSize: 11, color: C.red, textAlign: "left",
              overflowX: "auto", marginBottom: 24,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {this.state.errorMsg}
              {this.state.errorInfo && `\n\nComponent stack:${this.state.errorInfo}`}
            </pre>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={this.handleReset}
              style={{
                background: C.blue, color: "#fff",
                border: "none", borderRadius: 8,
                padding: "10px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "none", color: C.blue,
                border: `1.5px solid ${C.blue}`, borderRadius: 8,
                padding: "10px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
              }}
            >
              Reload Page
            </button>
          </div>

          {/* Disclaimer — required even in error state */}
          <p style={{
            fontSize: 10, color: C.greyText, marginTop: 24,
            lineHeight: 1.5,
          }}>
            FinCal Retirement Calculator | HDFC Mutual Fund × Technex &#8217;26, IIT BHU
          </p>
        </div>
      </div>
    );
  }
}
