"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

type CrystalShardProps = {
  /** "gold" for landing page, "violet" for synthesis/generating */
  variant?: "gold" | "violet";
  /** When true, increases activity: faster movement, stronger glow */
  synthesizing?: boolean;
  /** Overall size class */
  className?: string;
};

/**
 * Floating crystalline shards in a vertical zigzag formation.
 * Subtle energy pulses travel along shard edges.
 * A central binding glow holds the formation together.
 * `synthesizing` mode increases energy activity.
 */
export function CrystalShard({
  variant = "gold",
  synthesizing = false,
  className,
}: CrystalShardProps) {
  const isGold = variant === "gold";
  const hasAnimated = useRef(false);

  // Only show intro animation once per mount
  const shouldAnimateIntro = !hasAnimated.current;
  if (!hasAnimated.current) hasAnimated.current = true;

  // Timing: synthesizing is moderately faster, but base is slow/meditative
  const speed = synthesizing ? 0.7 : 1;

  // Energy colors match the glass — cool blue-white tones, not harsh primary
  const colors = isGold
    ? {
        glowSoft: "rgba(200,164,93,0.12)",
        glowIntense: "rgba(200,164,93,0.3)",
        bindingCore: "rgba(200,164,93,0.22)",
        bindingEdge: "rgba(200,164,93,0.04)",
        glass: "rgba(180,200,220,0.07)",
        glassBright: "rgba(200,215,230,0.14)",
        glassEdge: "rgba(255,255,255,0.2)",
        iridescent1: "rgba(140,200,240,0.12)",
        iridescent2: "rgba(180,230,200,0.1)",
        iridescent3: "rgba(200,180,140,0.12)",
        // Energy matches glass: cool white-blue with slight warmth
        edgeBase: "rgba(180,200,220,0.2)",
        edgePulse: "rgba(200,210,230,0.5)",
        edgePulseSynth: "rgba(220,200,160,0.7)",
        debris: "rgba(200,215,230,0.5)",
      }
    : {
        glowSoft: "rgba(124,92,255,0.12)",
        glowIntense: "rgba(124,92,255,0.3)",
        bindingCore: "rgba(124,92,255,0.22)",
        bindingEdge: "rgba(124,92,255,0.04)",
        glass: "rgba(160,180,220,0.07)",
        glassBright: "rgba(180,190,230,0.14)",
        glassEdge: "rgba(255,255,255,0.2)",
        iridescent1: "rgba(120,140,240,0.12)",
        iridescent2: "rgba(160,120,220,0.1)",
        iridescent3: "rgba(140,130,200,0.12)",
        // Energy matches glass: cool blue-violet
        edgeBase: "rgba(160,150,220,0.2)",
        edgePulse: "rgba(180,170,240,0.5)",
        edgePulseSynth: "rgba(160,140,255,0.7)",
        debris: "rgba(180,170,240,0.5)",
      };

  // 5 shard definitions
  const shards = [
    {
      clip: "polygon(20% 5%, 85% 0%, 95% 45%, 55% 60%, 10% 50%)",
      edgePath: "M 20 5 L 85 0 L 95 45 L 55 60 L 10 50 Z",
      x: 8,
      y: -38,
      rotate: -15,
      floatY: [-1.5, 2.5],
      floatRotate: [-1.2, 1.2],
    },
    {
      clip: "polygon(5% 10%, 50% 0%, 90% 30%, 80% 70%, 15% 55%)",
      edgePath: "M 5 10 L 50 0 L 90 30 L 80 70 L 15 55 Z",
      x: -12,
      y: -18,
      rotate: 12,
      floatY: [1, -2],
      floatRotate: [0.8, -1],
    },
    {
      clip: "polygon(10% 5%, 70% 0%, 95% 40%, 85% 80%, 20% 70%, 5% 35%)",
      edgePath: "M 10 5 L 70 0 L 95 40 L 85 80 L 20 70 L 5 35 Z",
      x: 5,
      y: 0,
      rotate: -8,
      floatY: [-1, 1.5],
      floatRotate: [-0.8, 1],
    },
    {
      clip: "polygon(8% 20%, 55% 5%, 92% 30%, 80% 75%, 25% 85%)",
      edgePath: "M 8 20 L 55 5 L 92 30 L 80 75 L 25 85 Z",
      x: -10,
      y: 18,
      rotate: 10,
      floatY: [1.5, -1.2],
      floatRotate: [1, -1.2],
    },
    {
      clip: "polygon(15% 10%, 80% 5%, 90% 55%, 45% 70%, 5% 50%)",
      edgePath: "M 15 10 L 80 5 L 90 55 L 45 70 L 5 50 Z",
      x: 6,
      y: 36,
      rotate: -12,
      floatY: [-2, 1.2],
      floatRotate: [-1, 1.5],
    },
  ];

  // Debris particles — small, subtle
  const debris = Array.from({ length: synthesizing ? 14 : 8 }, (_, i) => ({
    x: (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40),
    y: -20 + (i / (synthesizing ? 14 : 8)) * 80,
    size: 1 + Math.random() * 1.5,
    duration: (6 + Math.random() * 5) * speed,
    delay: i * 0.5,
    drift: (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20),
  }));

  return (
    <div className={cn("relative", className)}>
      {/* Central binding glow — holds shards together */}
      <motion.div
        animate={{
          opacity: synthesizing ? [0.4, 0.7, 0.4] : [0.25, 0.4, 0.25],
          scale: synthesizing ? [0.97, 1.05, 0.97] : [0.99, 1.01, 0.99],
        }}
        transition={{ duration: 5 * speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-5%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 65% at 50% 50%, ${colors.bindingCore}, ${colors.bindingEdge} 60%, transparent 85%)`,
          filter: "blur(14px)",
        }}
      />
      {/* Tighter center glow */}
      <motion.div
        animate={{
          opacity: synthesizing ? [0.4, 0.7, 0.4] : [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 4 * speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[20%] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.glowIntense}, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Crystal shards */}
      {shards.map((shard, i) => (
        <motion.div
          key={i}
          initial={shouldAnimateIntro ? { opacity: 0, scale: 0.7 } : false}
          animate={{
            opacity: 1,
            scale: synthesizing ? [1, 1.02, 1] : 1,
            y: [
              shard.y + shard.floatY[0] * (synthesizing ? 1.4 : 1),
              shard.y + shard.floatY[1] * (synthesizing ? 1.4 : 1),
              shard.y + shard.floatY[0] * (synthesizing ? 1.4 : 1),
            ],
            rotate: [
              shard.rotate + shard.floatRotate[0] * (synthesizing ? 1.5 : 1),
              shard.rotate + shard.floatRotate[1] * (synthesizing ? 1.5 : 1),
              shard.rotate + shard.floatRotate[0] * (synthesizing ? 1.5 : 1),
            ],
            x: shard.x,
          }}
          transition={{
            opacity: { duration: 1.2, delay: i * 0.12 },
            scale: { duration: 3 * speed, repeat: Infinity, ease: "easeInOut" },
            y: { duration: (7 + i) * speed, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: (8 + i * 1.2) * speed, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 1, delay: i * 0.12 },
          }}
          className="absolute inset-[10%]"
          style={{ transformOrigin: "center center" }}
        >
          {/* Glass body */}
          <div className="w-full h-full relative" style={{ clipPath: shard.clip }}>
            {/* Base glass */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colors.glassBright}, ${colors.glass} 50%, ${colors.glassBright})`,
                backdropFilter: "blur(2px)",
              }}
            />
            {/* Iridescent layers */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${55 + i * 28}deg, transparent, ${colors.iridescent1} 25%, transparent 55%, ${colors.iridescent2} 75%, transparent)`,
              }}
            />
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: (6 + i * 1.5) * speed, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${170 + i * 40}deg, transparent 15%, ${colors.iridescent3} 50%, transparent 85%)`,
              }}
            />
            {/* Top edge highlight */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${colors.glassEdge} 0%, transparent 18%)`,
                opacity: 0.35,
              }}
            />
          </div>

          {/* Energy traveling along shard edges — slow, subtle */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Static edge base glow */}
            <path
              d={shard.edgePath}
              fill="none"
              stroke={colors.edgeBase}
              strokeWidth="0.6"
            />
            {/* Slow traveling pulse 1 */}
            <motion.path
              d={shard.edgePath}
              fill="none"
              stroke={synthesizing ? colors.edgePulseSynth : colors.edgePulse}
              strokeWidth={synthesizing ? "1.2" : "0.9"}
              strokeLinecap="round"
              animate={{
                pathLength: [0, 0.25, 0.25, 0],
                pathOffset: [0, 0.3, 0.7, 1],
                opacity: [0, 0.7, 0.5, 0],
              }}
              transition={{
                duration: (8 + i * 1.5) * speed,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut",
              }}
            />
            {/* Slow traveling pulse 2 — offset */}
            <motion.path
              d={shard.edgePath}
              fill="none"
              stroke={synthesizing ? colors.edgePulseSynth : colors.edgePulse}
              strokeWidth={synthesizing ? "1" : "0.7"}
              strokeLinecap="round"
              animate={{
                pathLength: [0, 0.18, 0.18, 0],
                pathOffset: [0.5, 0.7, 0.9, 1.2],
                opacity: [0, 0.5, 0.35, 0],
              }}
              transition={{
                duration: (7 + i) * speed,
                repeat: Infinity,
                delay: i * 1.5 + 3,
                ease: "easeInOut",
              }}
            />
            {/* Additional pulse in synthesizing mode */}
            {synthesizing && (
              <motion.path
                d={shard.edgePath}
                fill="none"
                stroke={colors.edgePulseSynth}
                strokeWidth="1.4"
                strokeLinecap="round"
                animate={{
                  pathLength: [0, 0.3, 0.3, 0],
                  pathOffset: [0.2, 0.5, 0.8, 1.1],
                  opacity: [0, 0.8, 0.6, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 0.8 + 1,
                  ease: "easeInOut",
                }}
              />
            )}
          </svg>
        </motion.div>
      ))}

      {/* Debris particles — subtle, drifting */}
      {debris.map((particle, i) => (
        <motion.div
          key={`debris-${i}`}
          animate={{
            opacity: [0, 0.5, 0.3, 0],
            x: [0, particle.drift * 0.3, particle.drift],
            y: [particle.y, particle.y + (i % 2 === 0 ? -8 : 8), particle.y + (i % 2 === 0 ? -16 : 16)],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            top: "50%",
            left: "50%",
            background: colors.debris,
            boxShadow: `0 0 3px ${colors.debris}`,
          }}
        />
      ))}

      {/* Ambient outer glow */}
      <motion.div
        animate={{ opacity: synthesizing ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15] }}
        transition={{ duration: 5 * speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-20%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 45% 55% at 50% 50%, ${colors.glowSoft}, transparent 70%)`,
          filter: "blur(16px)",
        }}
      />
    </div>
  );
}
