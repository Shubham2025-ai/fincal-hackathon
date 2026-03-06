"use client";

import { useId } from "react";
import { formatINR } from "@/lib/financeCalc";

export default function DonutChart({ invested, gains }) {
  const uid   = useId();
  const total = invested + gains;
  if (total <= 0) return null;

  const R  = 44, cx = 56, cy = 56, sw = 13;
  const Ci = 2 * Math.PI * R;
  const ip = invested / total;
  const gp = gains    / total;

  // Single string — prevents SSR/client text-node mismatch
  const titleText = `Corpus breakdown — Amount invested: ${formatINR(invested)}, Estimated returns: ${formatINR(gains)}, Total corpus: ${formatINR(total)}`;

  return (
    <svg
      width={112} height={112}
      viewBox="0 0 112 112"
      role="img"
      aria-labelledby={`dt-${uid}`}
      style={{ flexShrink: 0 }}
    >
      <title id={`dt-${uid}`}>{titleText}</title>

      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e8eef6" strokeWidth={sw} />
      <circle
        cx={cx} cy={cy} r={R} fill="none"
        stroke="#224c87" strokeWidth={sw}
        strokeDasharray={`${Ci * ip} ${Ci * (1 - ip)}`}
        strokeDashoffset={Ci * 0.25}
      />
      <circle
        cx={cx} cy={cy} r={R} fill="none"
        stroke="#b91c1c" strokeWidth={sw}
        strokeDasharray={`${Ci * gp} ${Ci * (1 - gp)}`}
        strokeDashoffset={Ci * (0.25 - ip)}
      />
      <text aria-hidden="true"
        x={cx} y={cy - 7} textAnchor="middle"
        fontSize={7} fill="#595959"
        fontFamily="var(--font-montserrat), Montserrat, sans-serif"
        fontWeight={700} letterSpacing="0.08em">
        CORPUS
      </text>
      <text aria-hidden="true"
        x={cx} y={cy + 8} textAnchor="middle"
        fontSize={9} fill="#1a3a6b"
        fontFamily="var(--font-montserrat), Montserrat, sans-serif"
        fontWeight={800}>
        {formatINR(total)}
      </text>
    </svg>
  );
}
