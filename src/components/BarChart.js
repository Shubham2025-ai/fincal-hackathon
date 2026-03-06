"use client";

import { useId } from "react";
import { formatINR } from "@/lib/financeCalc";

const C = { greyText: "#595959", greyBorder: "#919090" };

export default function BarChart({ data, color, title, subtitle }) {
  const uid = useId();
  if (!data || data.length === 0) return null;

  const W   = 640, H = 140;
  const max = Math.max(...data.map((d) => d.corpus), 1);
  const bw  = Math.max(2, W / data.length - 1.5);
  const step = Math.ceil(data.length / 8);

  // Single strings — prevents SSR/client text-node mismatch
  const titleStr    = String(title);
  const subtitleStr = String(subtitle);

  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{
        fontSize: 12, color: C.greyText, marginBottom: 8,
        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        {title}
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: H, display: "block" }}
        role="img"
        aria-labelledby={`ct-${uid}`}
        aria-describedby={`cd-${uid}`}
      >
        <title id={`ct-${uid}`}>{titleStr}</title>
        <desc  id={`cd-${uid}`}>{subtitleStr}</desc>

        {data.map((d, i) => {
          const bh = (d.corpus / max) * (H - 24);
          const x  = i * (W / data.length);
          const y  = H - bh - 16;
          return (
            <g key={d.age}>
              <rect
                x={x + 0.75} y={y} width={bw} height={bh}
                fill={color} rx={2}
                opacity={0.18 + (i / data.length) * 0.82}
              />
              {i % step === 0 && (
                <text
                  aria-hidden="true"
                  x={x + bw / 2} y={H - 2}
                  textAnchor="middle" fontSize={8}
                  fill={C.greyText} fontFamily="Arial, sans-serif"
                >
                  {d.age}
                </text>
              )}
            </g>
          );
        })}

        <line
          aria-hidden="true"
          x1={0} y1={H - 16} x2={W} y2={H - 16}
          stroke={C.greyBorder} strokeWidth={0.5} opacity={0.5}
        />
      </svg>

      {subtitle && (
        <p style={{ fontSize: 11, color: C.greyText, margin: "6px 0 0", fontFamily: "Arial, sans-serif" }}>
          {subtitle}
        </p>
      )}
    </figure>
  );
}
