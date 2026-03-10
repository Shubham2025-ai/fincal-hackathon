"use client";

import { useId } from "react";
import { formatINR } from "@/lib/financeCalc";

const C = { greyText: "#595959", greyBorder: "#919090" };

export default function BarChart({ data, color, title, subtitle }) {
  const uid = useId();
  if (!data || data.length === 0) return null;

  const W = 640, H = 160, PAD_B = 20, PAD_T = 10;
  const plotH = H - PAD_B - PAD_T;
  const max   = Math.max(...data.map((d) => d.corpus), 1);
  const step  = Math.ceil(data.length / 7);

  // Build smooth area path
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: PAD_T + plotH - (d.corpus / max) * plotH,
  }));

  // Catmull-Rom smooth path
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${W} ${H - PAD_B} L 0 ${H - PAD_B} Z`;
  const gradId   = `grad-${uid}`;
  const clipId   = `clip-${uid}`;

  const titleStr    = String(title);
  const subtitleStr = String(subtitle ?? "");

  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{
        fontSize: 12, color: C.greyText, marginBottom: 8,
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        {title}
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: H, display: "block", overflow: "visible" }}
        role="img"
        aria-labelledby={`ct-${uid}`}
        aria-describedby={`cd-${uid}`}
      >
        <title id={`ct-${uid}`}>{titleStr}</title>
        <desc  id={`cd-${uid}`}>{subtitleStr}</desc>

        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} aria-hidden="true"
            x1={0} y1={PAD_T + plotH * (1 - t)}
            x2={W} y2={PAD_T + plotH * (1 - t)}
            stroke={C.greyBorder} strokeWidth={0.4} strokeDasharray="4 4" opacity={0.4}
          />
        ))}

        {/* Area fill */}
        <path clipPath={`url(#${clipId})`} d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path clipPath={`url(#${clipId})`} d={linePath}
          fill="none" stroke={color} strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Data points + labels */}
        {points.map((pt, i) => {
          if (i % step !== 0 && i !== points.length - 1) return null;
          const d = data[i];
          return (
            <g key={d.age} aria-hidden="true">
              <circle cx={pt.x} cy={pt.y} r={3.5} fill={color} stroke="#fff" strokeWidth={1.5} />
              <text x={pt.x} y={H - 4} textAnchor="middle"
                fontSize={8} fill={C.greyText} fontFamily="Arial, sans-serif">
                {d.age}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line aria-hidden="true"
          x1={0} y1={H - PAD_B} x2={W} y2={H - PAD_B}
          stroke={C.greyBorder} strokeWidth={0.8} opacity={0.6}
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