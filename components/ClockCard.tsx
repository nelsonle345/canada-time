"use client";
import { motion } from "framer-motion";
import { TimezoneConfig, TimeData } from "@/lib/timezones";

interface Props {
  config: TimezoneConfig;
  data: TimeData;
  use24h: boolean;
  index: number;
}

export default function ClockCard({ config, data, use24h, index }: Props) {
  const { hours, minutes, seconds, period, shortDate, utcOffset, isDay } = data;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.07, ease: [0.25, 1, 0.5, 1] }}
      className={`zone-${config.zoneIndex}`}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "visible",           /* never clip content */
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
        cursor: "default",
        minWidth: 0,                   /* prevent grid blowout */
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.12)";
        el.style.borderColor = `rgba(var(--zr), 0.5)`;
        el.style.boxShadow = `0 0 0 1px rgba(var(--zr),0.18), 0 20px 48px rgba(0,0,0,0.5)`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.08)";
        el.style.borderColor = "rgba(255,255,255,0.14)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top accent line — sits inside rounded corner so no clipping needed */}
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: "2px",
        borderRadius: "0 0 4px 4px",
        background: `var(--zc)`,
        opacity: 0.75,
      }} />

      <div style={{ padding: "28px 28px 22px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginBottom: "4px", flexWrap: "wrap" }}>
              <h3 className="font-display" style={{
                fontWeight: 700, fontSize: "17px",
                color: "#ffffff", whiteSpace: "nowrap",
              }}>
                {config.city}
              </h3>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>
                {config.province} · Canada
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
              {config.label}
            </p>
          </div>

          {/* Day / Night + offset stacked right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "3px 9px", borderRadius: "20px",
              background: isDay ? "rgba(251,191,36,0.12)" : "rgba(99,102,241,0.15)",
              border: isDay ? "1px solid rgba(251,191,36,0.25)" : "1px solid rgba(99,102,241,0.28)",
            }}>
              <span style={{ fontSize: "12px" }}>{isDay ? "☀️" : "🌙"}</span>
              <span style={{ fontSize: "11px", fontWeight: 500, color: isDay ? "rgba(251,191,36,0.9)" : "rgba(165,180,252,0.9)" }}>
                {isDay ? "Day" : "Night"}
              </span>
            </div>
            <span className="font-mono-digits" style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              {utcOffset}
            </span>
          </div>
        </div>

        {/* ── CLOCK ── */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "1px", marginBottom: "22px", flexWrap: "nowrap" }}>
          <span className="font-mono-digits" style={{
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5vw, 3rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            whiteSpace: "nowrap",
          }}>
            {hours}:{minutes}
          </span>
          <span className="font-mono-digits" style={{
            fontWeight: 600,
            fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginLeft: "1px",
            color: "var(--zc)",
            whiteSpace: "nowrap",
          }}>
            :{seconds}
          </span>
          {!use24h && period && (
            <span style={{
              fontSize: "13px", marginLeft: "6px",
              color: "rgba(255,255,255,0.4)",
              alignSelf: "flex-end", paddingBottom: "2px",
              whiteSpace: "nowrap",
            }}>
              {period}
            </span>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.09)",
          gap: "8px",
        }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>
            {shortDate}
          </p>
          <span className="font-mono-digits" style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
            padding: "3px 10px", borderRadius: "20px",
            background: `rgba(var(--zr), 0.14)`,
            color: "var(--zc)",
            border: `1px solid rgba(var(--zr), 0.28)`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {config.short}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
