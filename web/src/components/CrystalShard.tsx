"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CrystalShardProps = {
  /** "gold" for landing page, "violet" for synthesis/generating */
  variant?: "gold" | "violet";
  /** Overall size class */
  className?: string;
};

/**
 * A fractured crystalline prism composed of 4-5 semi-transparent fragments
 * that float and rotate independently, held together by luminous energy.
 * Orbital dust particles drift outward from between the fragments.
 */
export function CrystalShard({ variant = "gold", className }: CrystalShardProps) {
  const isGold = variant === "gold";

  // Color tokens per variant
  const colors = isGold
    ? {
        glow: "rgba(200,164,93,0.6)",
        glowSoft: "rgba(200,164,93,0.15)",
        border: "rgba(200,164,93,0.4)",
        borderSoft: "rgba(200,164,93,0.15)",
        fill: "rgba(200,164,93,0.08)",
        fillBright: "rgba(200,164,93,0.18)",
        core: "rgba(200,164,93,0.9)",
        dust: "bg-gold/60",
        crack: "rgba(200,164,93,0.35)",
      }
    : {
        glow: "rgba(124,92,255,0.6)",
        glowSoft: "rgba(124,92,255,0.15)",
        border: "rgba(124,92,255,0.4)",
        borderSoft: "rgba(124,92,255,0.15)",
        fill: "rgba(124,92,255,0.08)",
        fillBright: "rgba(124,92,255,0.18)",
        core: "rgba(124,92,255,0.9)",
        dust: "bg-violet/60",
        crack: "rgba(124,92,255,0.35)",
      };

  // Fragment definitions: clip-path polygons forming a fractured diamond/prism
  const fragments = [
    {
      // Top shard
      clip: "polygon(50% 0%, 72% 38%, 50% 48%, 28% 38%)",
      rotate: { from: -1, to: 1.5 },
      float: { from: -2, to: 2 },
      delay: 0,
      size: "inset-0",
    },
    {
      // Right shard
      clip: "polygon(73% 39%, 95% 52%, 72% 65%, 51% 49%)",
      rotate: { from: 0.5, to: -1 },
      float: { from: 1, to: -1.5 },
      delay: 0.3,
      size: "inset-0",
    },
    {
      // Bottom shard
      clip: "polygon(50% 50%, 71% 66%, 50% 100%, 29% 66%)",
      rotate: { from: 1, to: -0.8 },
      float: { from: -1, to: 2.5 },
      delay: 0.6,
      size: "inset-0",
    },
    {
      // Left shard
      clip: "polygon(27% 39%, 49% 49%, 28% 65%, 5% 52%)",
      rotate: { from: -0.8, to: 1.2 },
      float: { from: 1.5, to: -2 },
      delay: 0.9,
      size: "inset-0",
    },
  ];

  // Orbital dust particles
  const dustParticles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * 360,
    duration: 6 + (i % 3) * 2,
    delay: i * 0.4,
    distance: 55 + (i % 3) * 12,
  }));

  return (
    <div className={cn("relative", className)}>
      {/* Outer ambient glow */}
      <div
        className="absolute inset-[-20%] rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.glowSoft}, transparent 70%)` }}
      />

      {/* Orbital rings (subtle) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10%]"
      >
        <div
          className="w-full h-full rounded-full border"
          style={{ borderColor: colors.borderSoft }}
        />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[5%]"
      >
        <div
          className="w-full h-full rounded-full border"
          style={{ borderColor: colors.borderSoft }}
        />
      </motion.div>

      {/* Crystal fragments */}
      {fragments.map((frag, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [frag.rotate.from, frag.rotate.to, frag.rotate.from],
            y: [frag.float.from, frag.float.to, frag.float.from],
          }}
          transition={{
            opacity: { duration: 0.8, delay: frag.delay },
            scale: { duration: 1, delay: frag.delay },
            rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className={cn("absolute", frag.size)}
        >
          {/* Glass surface */}
          <div
            className="w-full h-full backdrop-blur-[2px]"
            style={{
              clipPath: frag.clip,
              background: `linear-gradient(135deg, ${colors.fillBright}, ${colors.fill})`,
              border: `1px solid ${colors.border}`,
              boxShadow: `inset 0 0 20px ${colors.glowSoft}`,
            }}
          />
          {/* Edge highlight */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: frag.clip,
              background: `linear-gradient(180deg, ${colors.border} 0%, transparent 40%)`,
              opacity: 0.3,
            }}
          />
        </motion.div>
      ))}

      {/* Energy in the cracks between fragments */}
      <div className="absolute inset-[20%] pointer-events-none">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full"
          style={{
            background: `radial-gradient(circle, ${colors.crack}, transparent 70%)`,
            filter: "blur(3px)",
          }}
        />
      </div>

      {/* Central core pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
          style={{
            background: colors.core,
            boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glowSoft}`,
          }}
        />
      </div>

      {/* Drifting dust particles */}
      {dustParticles.map((particle, i) => (
        <motion.div
          key={`dust-${i}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: particle.duration * 0.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: particle.delay,
            }}
            className={cn("absolute w-1 h-1 rounded-full", colors.dust)}
            style={{
              top: `${50 - (particle.distance / 2)}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      ))}

      {/* Orbiting bright nodes (3) */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`orbit-${i}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 10 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-5%] pointer-events-none"
        >
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: `${15 + i * 12}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: isGold ? "#C8A45D" : "#7C5CFF",
              boxShadow: `0 0 8px ${colors.glow}, 0 0 16px ${colors.glowSoft}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
