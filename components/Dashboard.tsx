"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CANADIAN_TIMEZONES, getTimeData } from "@/lib/timezones";
import ClockCard from "./ClockCard";
import LoadingScreen from "./LoadingScreen";

const CENTER: React.CSSProperties = {
  width: "100%",
  maxWidth: "780px",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "24px",
  paddingRight: "24px",
};

export default function Dashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [use24h, setUse24h] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    const t = setTimeout(() => { setNow(new Date()); setIsLoading(false); }, 1400);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  const tick = useCallback(() => setNow(new Date()), []);
  useEffect(() => {
    if (!isLoading) { const id = setInterval(tick, 1000); return () => clearInterval(id); }
  }, [isLoading, tick]);

  const filtered = CANADIAN_TIMEZONES.filter(tz => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tz.city.toLowerCase().includes(q) ||
      tz.province.toLowerCase().includes(q) ||
      tz.label.toLowerCase().includes(q) ||
      tz.short.toLowerCase().includes(q) ||
      tz.timezone.toLowerCase().includes(q)
    );
  });

  if (!mounted) return null;

  // Safe to read the browser's timezone now — we're guaranteed to be past
  // the client-only mount gate above, so this can't cause a hydration mismatch.
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", position: "relative" }}>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {/* ── BACKGROUND ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {/* Canada silhouette watermark */}
        <svg viewBox="0 0 1200 650" style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.03 }}
          preserveAspectRatio="xMidYMid slice">
          <path fill="white" d="
            M95,220 L120,195 L148,188 L162,170 L185,165 L202,148 L228,142
            L248,125 L272,120 L295,130 L322,122 L350,108 L378,102 L408,95
            L435,98 L462,86 L492,90 L518,80 L548,83 L575,75 L602,79
            L628,70 L658,75 L685,66 L715,72 L742,63 L772,69 L800,60
            L830,67 L858,60 L888,68 L915,76 L938,92 L945,112 L935,132
            L925,150 L930,172 L920,192 L905,208 L910,230 L895,248
            L878,262 L855,268 L838,285 L820,294 L802,286 L785,298
            L768,292 L750,305 L732,298 L714,312 L695,305 L677,320
            L658,312 L639,326 L618,318 L598,334 L576,326 L555,340
            L532,332 L510,348 L487,340 L465,355 L442,347 L419,362
            L396,354 L372,368 L348,360 L324,374 L300,365 L276,380
            L252,371 L228,385 L204,376 L180,390 L158,381 L136,395
            L115,385 L98,368 L92,345 L102,322 L110,300 L105,278
            L116,258 L108,236 L118,218 L95,220 Z
          "/>
        </svg>

        {/* Aurora orbs */}
        <div className="aurora-a" style={{
          position: "absolute", borderRadius: "50%",
          width: "900px", height: "900px",
          background: "radial-gradient(circle, rgba(56,189,248,0.065) 0%, transparent 65%)",
          top: "-25%", left: "-18%",
        }} />
        <div className="aurora-b" style={{
          position: "absolute", borderRadius: "50%",
          width: "750px", height: "750px",
          background: "radial-gradient(circle, rgba(129,140,248,0.055) 0%, transparent 65%)",
          bottom: "-18%", right: "-12%",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 65%)",
          top: "35%", left: "50%", transform: "translate(-50%,-50%)",
        }} />

        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.22,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, black 30%, transparent 100%)",
        }} />
      </div>

      {!isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          style={{ position: "relative", zIndex: 1 }}>

          {/* ── HEADER ── */}
          <header style={{
            position: "sticky", top: 0, zIndex: 40,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            background: "rgba(8,11,20,0.82)",
          }}>
            <div style={{ ...CENTER, paddingTop: "12px", paddingBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "15px" }}>🍁</span>
                <span className="font-display" style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                  Canada Time
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "4px" }}>
                  <span className="live-dot" style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#34d399" }} />
                  <span style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Live</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="text" placeholder="Search…" aria-label="Search cities, provinces, or time zones"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "130px", padding: "6px 12px", borderRadius: "8px", fontSize: "12px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-primary)", outline: "none",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button onClick={() => setUse24h(!use24h)} style={{
                  padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  background: use24h ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${use24h ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
                  color: use24h ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "all 0.15s",
                }}>
                  {use24h ? "24h" : "12h"}
                </button>
              </div>
            </div>
          </header>

          {/* ── MAIN ── */}
          <main style={{ ...CENTER, paddingTop: "72px", paddingBottom: "80px" }}>

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
              style={{ textAlign: "center", marginBottom: "56px" }}
            >
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px", color: "rgba(52,211,153,0.65)" }}>
                Pacific · Mountain · Central · Eastern · Atlantic · Newfoundland
              </p>
              <h1 className="font-display" style={{
                fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08,
                fontSize: "clamp(2.4rem, 6vw, 3.5rem)",
                color: "var(--text-primary)", marginBottom: "12px",
              }}>
                Time Across Canada
              </h1>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                All 13 provinces &amp; territories, coast to coast to coast — updated every second.
              </p>
            </motion.div>

            {/* Grid */}
            {now && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                <AnimatePresence mode="popLayout">
                  {filtered.map((tz, i) => (
                    <ClockCard
                      key={tz.city}
                      config={tz}
                      data={getTimeData(tz.timezone, use24h, now)}
                      use24h={use24h}
                      index={i}
                      isLocal={tz.timezone === localTz}
                    />
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ gridColumn: "1/-1", textAlign: "center", padding: "64px 0", fontSize: "14px", color: "var(--text-tertiary)" }}>
                    No results for &quot;{search}&quot;
                  </motion.div>
                )}
              </div>
            )}

            {/* Footer */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              style={{ textAlign: "center", marginTop: "56px", fontSize: "11px", color: "var(--text-tertiary)" }}>
              DST handled automatically (except Saskatchewan &amp; Yukon, which stay on standard time) · All 13 provinces &amp; territories · No backend
            </motion.p>
          </main>
        </motion.div>
      )}
    </div>
  );
}
