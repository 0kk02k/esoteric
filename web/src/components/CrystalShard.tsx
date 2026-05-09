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
 * Floating crystalline shards arranged in a vertical zigzag formation.
 * 5 elongated prismatic fragments with iridescent glass surfaces,
 * energy arcs connecting them, colored light nodes, and debris particles.
 * Inspired by Screenshot.png reference.
 */
export function CrystalShard({ variant = "gold", className }: CrystalShardProps) {
  const isGold = variant === "gold";

  // Color tokens per variant
  const colors = isGold
    ? {
        glow: "rgba(200,164,93,0.7)",
        glowSoft: "rgba(200,164,93,0.2)",
        energy: "rgba(200,164,93,0.8)",
        energySoft: "rgba(180,140,80,0.3)",
        glass: "rgba(200,220,255,0.12)",
        glassBright: "rgba(200,220,255,0.22)",
        glassEdge: "rgba(255,255,255,0.35)",
        iridescent1: "rgba(120,200,255,0.3)",
        iridescent2: "rgba(160,255,200,0.25)",
        iridescent3: "rgba(200,164,93,0.35)",
        nodeColors: ["rgba(100,180,255,0.9)", "rgba(120,255,180,0.9)", "rgba(200,164,93,0.9)", "rgba(160,120,255,0.8)", "rgba(100,200,220,0.9)"],
        lightning: "#C8A45D",
        lightningSoft: "rgba(200,164,93,0.4)",
      }
    : {
        glow: "rgba(124,92,255,0.7)",
        glowSoft: "rgba(124,92,255,0.2)",
        energy: "rgba(124,92,255,0.8)",
        energySoft: "rgba(124,92,255,0.3)",
        glass: "rgba(180,200,255,0.12)",
        glassBright: "rgba(180,200,255,0.22)",
        glassEdge: "rgba(255,255,255,0.35)",
        iridescent1: "rgba(100,160,255,0.3)",
        iridescent2: "rgba(180,100,255,0.25)",
        iridescent3: "rgba(124,92,255,0.35)",
        nodeColors: ["rgba(100,160,255,0.9)", "rgba(180,100,255,0.9)", "rgba(124,92,255,0.9)", "rgba(80,200,180,0.8)", "rgba(200,120,255,0.9)"],
        lightning: "#7C5CFF",
        lightningSoft: "rgba(124,92,255,0.4)",
      };

  // 5 shard definitions — elongated prism shapes in zigzag vertical arrangement
  // Each shard alternates left/right offset from center
  const shards = [
    {
      // Top shard — pointing upper-right
      clip: "polygon(20% 5%, 85% 0%, 95% 45%, 55% 60%, 10% 50%)",
      x: 8,
      y: -38,
      rotate: -15,
      floatY: [-2, 3],
      floatRotate: [-2, 2],
      delay: 0,
    },
    {
      // Upper-middle shard — pointing upper-left
      clip: "polygon(5% 10%, 50% 0%, 90% 30%, 80% 70%, 15% 55%)",
      x: -12,
      y: -18,
      rotate: 12,
      floatY: [1, -2.5],
      floatRotate: [1, -1.5],
      delay: 0.15,
    },
    {
      // Center shard — largest, slightly right
      clip: "polygon(10% 5%, 70% 0%, 95% 40%, 85% 80%, 20% 70%, 5% 35%)",
      x: 5,
      y: 0,
      rotate: -8,
      floatY: [-1.5, 2],
      floatRotate: [-1, 1.5],
      delay: 0.3,
    },
    {
      // Lower-middle shard — pointing lower-left
      clip: "polygon(8% 20%, 55% 5%, 92% 30%, 80% 75%, 25% 85%)",
      x: -10,
      y: 18,
      rotate: 10,
      floatY: [2, -1.5],
      floatRotate: [1.5, -2],
      delay: 0.45,
    },
    {
      // Bottom shard — pointing lower-right
      clip: "polygon(15% 10%, 80% 5%, 90% 55%, 45% 70%, 5% 50%)",
      x: 6,
      y: 36,
      rotate: -12,
      floatY: [-2.5, 1.5],
      floatRotate: [-1.5, 2],
      delay: 0.6,
    },
  ];

  // SVG lightning paths connecting shards (simplified zigzag energy arcs)
  const lightningPaths = [
    "M 50 15 Q 35 22 50 30 Q 65 37 50 44",
    "M 45 28 Q 60 35 45 42 Q 30 49 45 56",
    "M 50 44 Q 38 50 50 58 Q 62 64 50 72",
    "M 55 58 Q 40 65 55 72 Q 70 78 55 85",
  ];

  // Debris particles — small fragments that fly outward
  const debris = Array.from({ length: 12 }, (_, i) => ({
    x: (i % 2 === 0 ? 1 : -1) * (30 + Math.random() * 40),
    y: -20 + (i / 12) * 80,
    size: 1 + Math.random() * 2.5,
    duration: 3 + Math.random() * 4,
    delay: i * 0.3,
    drift: (i % 2 === 0 ? 1 : -1) * (15 + Math.random() * 25),
  }));

  return (
    <div className={cn("relative", className)}>
      {/* Central energy glow behind shards */}
      <div
        className="absolute inset-[-15%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 70% at 50% 50%, ${colors.energy}, ${colors.energySoft} 50%, transparent 80%)`,
          filter: "blur(12px)",
        }}
      />

      {/* Lightning/energy arcs SVG */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-[5%] pointer-events-none"
        style={{ filter: `drop-shadow(0 0 4px ${colors.lightning})` }}
      >
        {lightningPaths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={colors.lightning}
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Secondary glow layer */}
        {lightningPaths.map((d, i) => (
          <motion.path
            key={`glow-${i}`}
            d={d}
            fill="none"
            stroke={colors.lightningSoft}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>

      {/* Crystal shards */}
      {shards.map((shard, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6, y: shard.y * 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [shard.y + shard.floatY[0], shard.y + shard.floatY[1], shard.y + shard.floatY[0]],
            rotate: [shard.rotate + shard.floatRotate[0], shard.rotate + shard.floatRotate[1], shard.rotate + shard.floatRotate[0]],
            x: shard.x,
          }}
          transition={{
            opacity: { duration: 0.8, delay: shard.delay },
            scale: { duration: 1, delay: shard.delay },
            y: { duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 0.8, delay: shard.delay },
          }}
          className="absolute inset-[10%]"
          style={{ transformOrigin: "center center" }}
        >
          {/* Glass body — layered for depth */}
          <div
            className="w-full h-full relative"
            style={{ clipPath: shard.clip }}
          >
            {/* Base glass fill */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colors.glassBright}, ${colors.glass} 50%, ${colors.glassBright})`,
                backdropFilter: "blur(2px)",
              }}
            />
            {/* Iridescent layer 1 */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${60 + i * 30}deg, transparent, ${colors.iridescent1} 30%, transparent 60%, ${colors.iridescent2} 80%, transparent)`,
              }}
            />
            {/* Iridescent layer 2 — shimmer */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${180 + i * 45}deg, transparent 20%, ${colors.iridescent3} 50%, transparent 80%)`,
              }}
            />
            {/* Edge highlight — top edge light catch */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${colors.glassEdge} 0%, transparent 25%)`,
                opacity: 0.5,
              }}
            />
            {/* Bottom edge subtle reflection */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(0deg, ${colors.glassEdge} 0%, transparent 15%)`,
                opacity: 0.2,
              }}
            />
          </div>

          {/* Colored light node inside each shard */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shard.delay,
            }}
            className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full"
            style={{
              top: "45%",
              left: "45%",
              transform: "translate(-50%, -50%)",
              background: colors.nodeColors[i],
              boxShadow: `0 0 12px ${colors.nodeColors[i]}, 0 0 24px ${colors.nodeColors[i]}`,
              filter: "blur(1px)",
            }}
          />
        </motion.div>
      ))}

      {/* Central energy core — brighter glow between shards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [0.7, 1.1, 0.7],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-5 sm:w-7 sm:h-7 rounded-full"
          style={{
            background: `radial-gradient(circle, white 0%, ${colors.energy} 40%, transparent 70%)`,
            boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glowSoft}`,
          }}
        />
      </div>

      {/* Debris particles flying outward */}
      {debris.map((particle, i) => (
        <motion.div
          key={`debris-${i}`}
          initial={{ opacity: 0, x: 0, y: particle.y }}
          animate={{
            opacity: [0, 0.8, 0.6, 0],
            x: [0, particle.drift * 0.5, particle.drift],
            y: [particle.y, particle.y + (i % 2 === 0 ? -8 : 8), particle.y + (i % 2 === 0 ? -15 : 15)],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
          className="absolute pointer-events-none rounded-sm"
          style={{
            width: particle.size,
            height: particle.size,
            top: "50%",
            left: "50%",
            background: `rgba(200,220,255,0.7)`,
            boxShadow: `0 0 3px rgba(200,220,255,0.5)`,
          }}
        />
      ))}

      {/* Ambient outer glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-25%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 50% 50%, ${colors.glowSoft}, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
