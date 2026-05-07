"use client";

import { motion } from "framer-motion";

export const CelestialBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-celestial">
      {/* Central Sun/Engine Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-gold/10 flex items-center justify-center"
        >
          {/* Outer Ring with markers */}
          <div className="absolute inset-0 border-[0.5px] border-gold/20 rounded-full after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-4 after:bg-gold/40" />
          
          {/* Zodiac/Symbol Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            className="w-[70%] h-[70%] rounded-full border border-gold/10 relative"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold/60 glow-gold" />
          </motion.div>
        </motion.div>

        {/* Inner Mechanics */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] border-[0.5px] border-gold/20 rounded-full"
        >
           <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gold/10" />
           <div className="absolute top-0 left-1/2 w-[0.5px] h-full bg-gold/10" />
        </motion.div>
      </div>

      {/* Floating Geometric Dust */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 2000 - 1000, 
            y: Math.random() * 2000 - 1000,
            opacity: Math.random() * 0.3
          }}
          animate={{ 
            y: [null, Math.random() * -100],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20 + Math.random() * 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-1 h-1 bg-gold/30 rounded-full"
          style={{ 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%` 
          }}
        />
      ))}
    </div>
  );
};
