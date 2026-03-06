"use client";

const C = {
  blue:     "#224c87",
  blueDark: "#1a3a6b",
  greyText: "#595959",
};

export default function SliderInput({
  id, label, value, min, max, step, onChange, display, hint,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  // gradient applied to the input so ::-webkit-slider-runnable-track inherits it
  const sliderBg = {
    background: `linear-gradient(to right, #224c87 ${pct}%, #dde6f5 ${pct}%)`,
  };

  return (
    <div style={{ marginBottom: 28 }}>

      {/* Label + value badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <label htmlFor={id} style={{
          fontSize: 13, fontWeight: 700, color: C.blueDark,
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        }}>
          {label}
        </label>
        <span aria-live="polite" style={{
          background: C.blue, color: "#fff", borderRadius: 6,
          padding: "4px 12px", fontSize: 13, fontWeight: 700,
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          minWidth: 72, textAlign: "center", display: "inline-block",
        }}>
          {display(value)}
        </span>
      </div>

      {/* Native range with gradient track */}
      <input
        id={id}
        type="range"
        className="fincal-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={hintId}
        aria-valuetext={display(value)}
        style={sliderBg}
      />

      {/* Min / max labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: C.greyText, fontFamily: "Arial, sans-serif" }}>{display(min)}</span>
        <span style={{ fontSize: 10, color: C.greyText, fontFamily: "Arial, sans-serif" }}>{display(max)}</span>
      </div>

      {hint && (
        <p id={hintId} style={{ margin: "5px 0 0", fontSize: 11, color: C.greyText, fontFamily: "Verdana, Arial, sans-serif" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
