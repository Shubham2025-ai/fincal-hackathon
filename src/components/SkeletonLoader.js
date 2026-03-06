"use client";

/**
 * SkeletonLoader — Shimmer placeholder UI shown during initial hydration.
 *
 * Matches the exact layout of the calculator so there is zero layout shift
 * when the real content appears. Respects prefers-reduced-motion.
 *
 * WCAG: aria-busy="true" + aria-label tells screen readers content is loading.
 */

const C = {
  blue:   "#224c87",
  redBrand: "#da3832",
};

// Single shimmer block
function Shimmer({ width = "100%", height = 16, radius = 6, style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width, height,
        borderRadius: radius,
        background: "linear-gradient(90deg, #e8eef6 25%, #f4f7fb 50%, #e8eef6 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s ease-in-out infinite",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// Card skeleton
function CardSkeleton({ tall }) {
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #dde6f5",
      borderRadius: 12, padding: tall ? "20px 18px" : "14px 16px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Accent bar */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, width: 4, height: "100%",
        background: "#dde6f5", borderRadius: "12px 0 0 12px",
      }} />
      <div style={{ paddingLeft: 10 }}>
        <Shimmer width="60%" height={10} style={{ marginBottom: 10 }} />
        <Shimmer width="80%" height={tall ? 28 : 22} style={{ marginBottom: 8 }} />
        <Shimmer width="55%" height={10} />
      </div>
    </div>
  );
}

// Slider skeleton
function SliderSkeleton() {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <Shimmer width="40%" height={13} />
        <Shimmer width={72} height={28} radius={6} />
      </div>
      <Shimmer width="100%" height={6} radius={3} style={{ marginBottom: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Shimmer width={36} height={10} />
        <Shimmer width={36} height={10} />
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes shimmer {
            0%, 100% { background-position: 0 0; }
          }
        }
      `}</style>

      <div
        aria-busy="true"
        aria-label="Loading retirement calculator…"
        style={{ minHeight: "100vh", background: "#f4f7fb" }}
      >
        {/* Header skeleton */}
        <div style={{
          background: C.blue,
          borderBottom: `4px solid ${C.redBrand}`,
          padding: "28px 24px 22px",
        }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <Shimmer width={320} height={10} style={{ marginBottom: 14, opacity: 0.4 }} />
            <Shimmer width={420} height={34} style={{ marginBottom: 12, opacity: 0.5 }} />
            <Shimmer width={280} height={14} style={{ opacity: 0.35 }} />
          </div>
        </div>

        {/* Step indicator skeleton */}
        <div style={{ background: "#fff", borderBottom: "1px solid #dde6f5", padding: "12px 24px" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", gap: 16, alignItems: "center" }}>
            {[1, 2, 3].map((n, i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <div style={{ width: 20, height: 1, background: "#dde6f5" }} />}
                <Shimmer width={24} height={24} radius={12} />
                <Shimmer width={90} height={11} />
              </div>
            ))}
          </div>
        </div>

        {/* Main grid skeleton */}
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          padding: "28px 24px 60px",
          display: "grid",
          gridTemplateColumns: "minmax(290px, 390px) 1fr",
          gap: 24, alignItems: "start",
        }}>
          {/* Left panel */}
          <div style={{
            background: "#fff", borderRadius: 16,
            boxShadow: "0 2px 20px rgba(34,76,135,0.08)",
          }}>
            {/* Card header */}
            <div style={{
              background: "#eef3fb", borderBottom: "1px solid #dde6f5",
              padding: "14px 22px", borderRadius: "16px 16px 0 0",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <Shimmer width={120} height={14} />
              <Shimmer width={50} height={28} radius={6} />
            </div>
            <div style={{ padding: "22px 22px 14px" }}>
              <Shimmer width={100} height={10} style={{ marginBottom: 18 }} />
              <SliderSkeleton />
              <SliderSkeleton />
              <SliderSkeleton />
              <div style={{ borderTop: "1px solid #dde6f5", margin: "4px 0 22px" }} />
              <Shimmer width={80} height={10} style={{ marginBottom: 18 }} />
              <SliderSkeleton />
              <div style={{ borderTop: "1px solid #dde6f5", margin: "4px 0 22px" }} />
              <Shimmer width={140} height={10} style={{ marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Shimmer width={90} height={30} radius={6} />
                <Shimmer width={110} height={30} radius={6} />
                <Shimmer width={120} height={30} radius={6} />
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div>
            {/* Metric cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
              gap: 12, marginBottom: 18,
            }}>
              <CardSkeleton tall />
              <CardSkeleton tall />
              <CardSkeleton />
              <CardSkeleton />
            </div>

            {/* Donut card */}
            <div style={{
              background: "#fff", borderRadius: 16,
              boxShadow: "0 2px 20px rgba(34,76,135,0.07)",
              padding: "20px 22px", marginBottom: 18,
            }}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                {/* Donut placeholder */}
                <Shimmer width={112} height={112} radius={56} />
                <div style={{ flex: "1 1 160px" }}>
                  <Shimmer width={160} height={10} style={{ marginBottom: 16 }} />
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                      <Shimmer width={11} height={11} radius={2} />
                      <Shimmer width="50%" height={13} style={{ flex: 1 }} />
                      <Shimmer width={70} height={13} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: "1 1 180px", borderLeft: "2px solid #dde6f5", paddingLeft: 20 }}>
                  <Shimmer width={140} height={10} style={{ marginBottom: 16 }} />
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ marginBottom: 13 }}>
                      <Shimmer width="70%" height={11} style={{ marginBottom: 4 }} />
                      <Shimmer width="90%" height={10} style={{ marginBottom: 2 }} />
                      <Shimmer width="40%" height={11} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart card */}
            <div style={{
              background: "#fff", borderRadius: 16,
              boxShadow: "0 2px 20px rgba(34,76,135,0.07)",
              overflow: "hidden", marginBottom: 18,
            }}>
              {/* Tab bar */}
              <div style={{ display: "flex", borderBottom: "1px solid #dde6f5" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    flex: 1, padding: "11px 6px", display: "flex",
                    justifyContent: "center", alignItems: "center",
                  }}>
                    <Shimmer width="60%" height={12} />
                  </div>
                ))}
              </div>
              <div style={{ padding: "20px 22px" }}>
                <Shimmer width="50%" height={12} style={{ marginBottom: 12 }} />
                <Shimmer width="100%" height={140} radius={4} style={{ marginBottom: 8 }} />
                <Shimmer width="70%" height={11} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
