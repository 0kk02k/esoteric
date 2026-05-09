"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CrystalShardProps = {
  /** "gold" for landing page, "violet" for synthesis/generating */
  variant?: "gold" | "violet";
  /** When true, increases activity: faster arcs, more energy, stronger glow */
  synthesizing?: boolean;
  /** Overall size class */
  className?: string;
};

/**
 * Floating crystalline shards in a vertical zigzag formation.
 * Energy runs along shard edges and arcs between fragments.
 * A central binding glow holds the formation together.
 * `synthesizing` mode dramatically increases energy activity.
 */
export function CrystalShard({
  variant = "gold",
  synthesizing = false,
  className,
}: CrystalShardProps) {
  const isGold = variant === "gold";

  // Speed multiplier for synthesizing mode
  const speed = synthesizing ? 0.4 : 1;
  const intensity = synthesizing ? 1.5 : 1;

  const colors = isGold
    ? {
        glow: "rgba(200,164,93,0.7)",
        glowSoft: "rgba(200,164,93,0.2)",
        glowIntense: "rgba(200,164,93,0.5)",
        energy: "rgba(200,164,93,0.85)",
        energyBright: "rgba(255,220,140,0.95)",
        glass: "rgba(200,220,255,0.08)",
        glassBright: "rgba(200,220,255,0.18)",
        glassEdge: "rgba(255,255,255,0.3)",
        iridescent1: "rgba(120,200,255,0.2)",
        iridescent2: "rgba(160,255,200,0.15)",
        iridescent3: "rgba(200,164,93,0.25)",
        edgeGlow: "rgba(200,164,93,0.6)",
        edgeGlowBright: "rgba(255,220,140,0.9)",
        arcColor: "#C8A45D",
        arcGlow: "rgba(200,164,93,0.5)",
        bindingCore: "rgba(200,164,93,0.35)",
        bindingEdge: "rgba(200,164,93,0.08)",
      }
    : {
        glow: "rgba(124,92,255,0.7)",
        glowSoft: "rgba(124,92,255,0.2)",
        glowIntense: "rgba(124,92,255,0.5)",
        energy: "rgba(124,92,255,0.85)",
        energyBright: "rgba(180,150,255,0.95)",
        glass: "rgba(180,200,255,0.08)",
        glassBright: "rgba(180,200,255,0.18)",
        glassEdge: "rgba(255,255,255,0.3)",
        iridescent1: "rgba(100,160,255,0.2)",
        iridescent2: "rgba(180,100,255,0.15)",
        iridescent3: "rgba(124,92,255,0.25)",
        edgeGlow: "rgba(124,92,255,0.6)",
        edgeGlowBright: "rgba(180,150,255,0.9)",
        arcColor: "#7C5CFF",
        arcGlow: "rgba(124,92,255,0.5)",
        bindingCore: "rgba(124,92,255,0.35)",
        bindingEdge: "rgba(124,92,255,0.08)",
      };

  // 5 shard definitions with edge paths for energy travel
  const shards = [
    {
      clip: "polygon(20% 5%, 85% 0%, 95% 45%, 55% 60%, 10% 50%)",
      // Edge path for energy to travel along (SVG coordinates within shard bounds)
      edgePath: "M 20 5 L 85 0 L 95 45 L 55 60 L 10 50 Z",
      x: 8,
      y: -38,
      rotate: -15,
      floatY: [-2, 3],
      floatRotate: [-2, 2],
      delay: 0,
    },
    {
      clip: "polygon(5% 10%, 50% 0%, 90% 30%, 80% 70%, 15% 55%)",
      edgePath: "M 5 10 L 50 0 L 90 30 L 80 70 L 15 55 Z",
      x: -12,
      y: -18,
      rotate: 12,
      floatY: [1, -2.5],
      floatRotate: [1, -1.5],
      delay: 0.15,
    },
    {
      clip: "polygon(10% 5%, 70% 0%, 95% 40%, 85% 80%, 20% 70%, 5% 35%)",
      edgePath: "M 10 5 L 70 0 L 95 40 L 85 80 L 20 70 L 5 35 Z",
      x: 5,
      y: 0,
      rotate: -8,
      floatY: [-1.5, 2],
      floatRotate: [-1, 1.5],
      delay: 0.3,
    },
    {
      clip: "polygon(8% 20%, 55% 5%, 92% 30%, 80% 75%, 25% 85%)",
      edgePath: "M 8 20 L 55 5 L 92 30 L 80 75 L 25 85 Z",
      x: -10,
      y: 18,
      rotate: 10,
      floatY: [2, -1.5],
      floatRotate: [1.5, -2],
      delay: 0.45,
    },
    {
      clip: "polygon(15% 10%, 80% 5%, 90% 55%, 45% 70%, 5% 50%)",
      edgePath: "M 15 10 L 80 5 L 90 55 L 45 70 L 5 50 Z",
      x: 6,
      y: 36,
      rotate: -12,
      floatY: [-2.5, 1.5],
      floatRotate: [-1.5, 2],
      delay: 0.6,
    },
  ];

  // Energy arcs that jump between shards (start/end in SVG viewport coordinates)
  // These represent energy leaving one shard edge and arcing to another
  const interShardArcs = [
    // Shard 0 bottom-right → Shard 1 top-right
    { d: "M 62 18 Q 58 22 52 20 Q 46 18 42 22", delay: 0 },
    // Shard 1 bottom → Shard 2 top-left
    { d: "M 42 32 Q 46 36 50 34 Q 54 32 52 36", delay: 0.5 },
    // Shard 2 bottom-right → Shard 3 top
    { d: "M 58 52 Q 54 55 48 53 Q 42 51 40 55", delay: 1.0 },
    // Shard 3 bottom → Shard 4 top-left
    { d: "M 42 65 Q 46 68 50 66 Q 54 64 52 68", delay: 1.5 },
    // Shard 0 left → Shard 2 top (long arc)
    { d: "M 38 16 Q 34 24 36 32 Q 38 38 42 36", delay: 2.0 },
    // Shard 2 right → Shard 4 top-right (long arc)
    { d: "M 62 44 Q 64 52 60 58 Q 56 64 58 68", delay: 2.5 },
  ];

  // Additional arcs only visible during synthesis
  const synthArcs = [
    { d: "M 36 12 Q 30 18 32 24 Q 34 30 38 28", delay: 0.3 },
    { d: "M 64 24 Q 68 30 66 36 Q 64 42 60 40", delay: 0.8 },
    { d: "M 38 42 Q 34 48 36 54 Q 38 60 42 58", delay: 1.3 },
    { d: "M 56 56 Q 60 62 58 68 Q 56 74 52 72", delay: 1.8 },
    { d: "M 48 8 Q 44 14 46 20 Q 48 26 52 24", delay: 0.6 },
    { d: "M 52 48 Q 56 52 54 56 Q 52 60 48 58", delay: 2.2 },
  ];

  const allArcs = synthesizing ? [...interShardArcs, ...synthArcs] : interShardArcs;

  // Debris particles
  const debris = Array.from({ length: synthesizing ? 18 : 10 }, (_, i) => ({
    x: (i % 2 === 0 ? 1 : -1) * (25 + Math.random() * 45),
    y: -25 + (i / (synthesizing ? 18 : 10)) * 85,
    size: 1 + Math.random() * 2,
    duration: (2.5 + Math.random() * 3) * speed,
    delay: i * 0.25,
    drift: (i % 2 === 0 ? 1 : -1) * (12 + Math.random() * 30),
  }));

  return (
    <div className={cn("relative", className)}>
      {/* Central binding glow — the force that holds shards together */}
      <motion.div
        animate={{
          opacity: synthesizing ? [0.5, 0.9, 0.5] : [0.3, 0.5, 0.3],
          scale: synthesizing ? [0.95, 1.1, 0.95] : [0.98, 1.02, 0.98],
        }}
        transition={{ duration: 2.5 * speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-5%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 65% at 50% 50%, ${colors.bindingCore}, ${colors.bindingEdge} 60%, transparent 85%)`,
          filter: `blur(${synthesizing ? 8 : 14}px)`,
        }}
      />
      {/* Second glow layer — tighter, brighter center */}
      <motion.div
        animate={{
          opacity: synthesizing ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 1.8 * speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[15%] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.glowIntense}, transparent 70%)`,
          filter: `blur(${synthesizing ? 4 : 8}px)`,
        }}
      />

      {/* Crystal shards with edge energy */}
      {shards.map((shard, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6, y: shard.y * 0.5 }}
          animate={{
            opacity: 1,
            scale: synthesizing ? [1, 1.04, 1] : 1,
            y: [
              shard.y + shard.floatY[0] * (synthesizing ? 1.8 : 1),
              shard.y + shard.floatY[1] * (synthesizing ? 1.8 : 1),
              shard.y + shard.floatY[0] * (synthesizing ? 1.8 : 1),
            ],
            rotate: [
              shard.rotate + shard.floatRotate[0] * (synthesizing ? 2 : 1),
              shard.rotate + shard.floatRotate[1] * (synthesizing ? 2 : 1),
              shard.rotate + shard.floatRotate[0] * (synthesizing ? 2 : 1),
            ],
            x: shard.x,
          }}
          transition={{
            opacity: { duration: 0.8, delay: shard.delay },
            scale: { duration: 1.5 * speed, repeat: Infinity, ease: "easeInOut" },
            y: { duration: (4 + i * 0.6) * speed, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: (5 + i * 0.8) * speed, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 0.8, delay: shard.delay },
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
                background: `linear-gradient(${60 + i * 30}deg, transparent, ${colors.iridescent1} 30%, transparent 60%, ${colors.iridescent2} 80%, transparent)`,
              }}
            />
            <motion.div
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: (2.5 + i) * speed, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${180 + i * 45}deg, transparent 20%, ${colors.iridescent3} 50%, transparent 80%)`,
              }}
            />
            {/* Top edge highlight */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${colors.glassEdge} 0%, transparent 20%)`,
                opacity: 0.4,
              }}
            />
          </div>

          {/* Energy running along shard edges — SVG overlay */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ filter: `drop-shadow(0 0 3px ${colors.edgeGlow})` }}
            preserveAspectRatio="none"
          >
            {/* Continuous edge glow (static, subtle) */}
            <path
              d={shard.edgePath}
              fill="none"
              stroke={colors.edgeGlow}
              strokeWidth="0.8"
              opacity={synthesizing ? 0.7 : 0.35}
            />
            {/* Animated energy traveling along the edge */}
            <motion.path
              d={shard.edgePath}
              fill="none"
              stroke={colors.edgeGlowBright}
              strokeWidth={synthesizing ? "1.5" : "1"}
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{
                pathLength: [0, 0.3, 0.3, 0],
                pathOffset: [0, 0.2, 0.7, 1],
                opacity: [0, 1, 0.8, 0],
              }}
              transition={{
                duration: (2.5 + i * 0.3) * speed,
                repeat: Infinity,
                delay: shard.delay * 2,
                ease: "easeInOut",
              }}
            />
            {/* Second energy pulse — offset timing */}
            <motion.path
              d={shard.edgePath}
              fill="none"
              stroke={colors.energyBright}
              strokeWidth={synthesizing ? "1.2" : "0.8"}
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{
                pathLength: [0, 0.2, 0.2, 0],
                pathOffset: [0.5, 0.7, 0.9, 1.2],
                opacity: [0, 0.9, 0.6, 0],
              }}
              transition={{
                duration: (2 + i * 0.4) * speed,
                repeat: Infinity,
                delay: shard.delay * 2 + 1.2 * speed,
                ease: "easeInOut",
              }}
            />
            {/* Third pulse only in synthesizing mode */}
            {synthesizing && (
              <motion.path
                d={shard.edgePath}
                fill="none"
                stroke={colors.energy}
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{
                  pathLength: [0, 0.4, 0.4, 0],
                  pathOffset: [0.3, 0.5, 0.8, 1.1],
                  opacity: [0, 1, 0.9, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: shard.delay + 0.5,
                  ease: "linear",
                }}
              />
            )}
          </svg>
        </motion.div>
      ))}

      {/* Inter-shard energy arcs — jumping between fragments */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-[5%] pointer-events-none"
        style={{ filter: `drop-shadow(0 0 ${synthesizing ? 6 : 3}px ${colors.arcGlow})` }}
      >
        {allArcs.map((arc, i) => (
          <g key={i}>
            {/* Glow layer */}
            <motion.path
              d={arc.d}
              fill="none"
              stroke={colors.arcGlow}
              strokeWidth={synthesizing ? "3" : "2"}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.6 * intensity, 0.4 * intensity, 0],
              }}
              transition={{
                duration: (synthesizing ? 1.2 : 2) * speed,
                repeat: Infinity,
                delay: arc.delay * speed,
                ease: "easeInOut",
              }}
            />
            {/* Bright core */}
            <motion.path
              d={arc.d}
              fill="none"
              stroke={colors.arcColor}
              strokeWidth={synthesizing ? "1" : "0.6"}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.95 * intensity, 0.8 * intensity, 0],
              }}
              transition={{
                duration: (synthesizing ? 1.2 : 2) * speed,
                repeat: Infinity,
                delay: arc.delay * speed,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </motion.svg>

      {/* Debris particles */}
      {debris.map((particle, i) => (
        <motion.div
          key={`debris-${i}`}
          initial={{ opacity: 0, x: 0, y: particle.y }}
          animate={{
            opacity: [0, 0.7 * intensity, 0.5 * intensity, 0],
            x: [0, particle.drift * 0.4, particle.drift],
            y: [particle.y, particle.y + (i % 2 === 0 ? -10 : 10), particle.y + (i % 2 === 0 ? -20 : 20)],
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
            background: colors.energyBright,
            boxShadow: `0 0 4px ${colors.edgeGlow}`,
          }}
        />
      ))}

      {/* Ambient outer glow — breathing */}
      <motion.div
        animate={{ opacity: synthesizing ? [0.4, 0.7, 0.4] : [0.2, 0.35, 0.2] }}
        transition={{ duration: 3 * speed, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-20%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 45% 60% at 50% 50%, ${colors.glowSoft}, transparent 70%)`,
          filter: "blur(16px)",
        }}
      />
    </div>
  );
}
