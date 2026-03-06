"use client";

/**
 * AnimatedNumber — Smoothly counts up to a new value when it changes.
 * Respects prefers-reduced-motion (skips animation if user opted out).
 */

import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, format, duration = 600 }) {
  const [displayed, setDisplayed] = useState(value);
  const rafRef     = useRef(null);
  const startRef   = useRef(null);
  const fromRef    = useRef(value);

  useEffect(() => {
    // Respect reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(value);
      return;
    }

    const from = fromRef.current;
    const to   = value;
    if (from === to) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <span>{format ? format(displayed) : displayed}</span>;
}
