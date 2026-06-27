"use client";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "#0c0c0f" }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinning ring */}
        <div className="relative w-12 h-12">
          <svg className="spin-slow w-12 h-12" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="20" fill="none"
              stroke="rgba(242,242,245,0.35)" strokeWidth="1.5"
              strokeDasharray="30 95.8" strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg">🍁</div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "rgba(242,242,245,0.3)" }}
        >
          Loading
        </motion.p>
      </div>
    </motion.div>
  );
}
