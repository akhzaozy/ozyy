import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingShape {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
  size: number;
  duration: number;
  rotateDir: number;
}

export default function BackgroundAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  // Generate randomized particles and shapes only on the client
  useEffect(() => {
    const generatedParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 6 + 4, // 4s to 10s
      delay: Math.random() * 5,
    }));

    const generatedShapes: FloatingShape[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 30 + 15, // 15px to 45px
      duration: Math.random() * 20 + 20, // 20s to 40s
      rotateDir: Math.random() > 0.5 ? 360 : -360,
    }));

    setParticles(generatedParticles);
    setShapes(generatedShapes);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. TWINKLING STAR PARTICLES */}
      {particles.map((p) => (
        <motion.div
          key={`star-${p.id}`}
          className="absolute rounded-full bg-indigo-400/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 2. SLOW DRIFTING GEOMETRIC OUTLINES */}
      {shapes.map((s) => {
        const shapeClass = 
          s.type === 'circle' 
            ? 'rounded-full border-indigo-500/10' 
            : s.type === 'square'
            ? 'rounded-xl border-emerald-500/10'
            : 'border-amber-500/10';

        return (
          <motion.div
            key={`shape-${s.id}`}
            className={`absolute border-2 ${shapeClass} flex items-center justify-center`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, s.rotateDir],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Inner tiny dot */}
            <div className={`w-1.5 h-1.5 rounded-full ${
              s.type === 'circle' ? 'bg-indigo-500/20' : s.type === 'square' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
            }`} />
          </motion.div>
        );
      })}

      {/* 3. DYNAMIC CRUISING PAPER PLANE / SPACE JET */}
      {/* Starting from off-screen bottom-left to top-right with a cool loop-like flow */}
      <motion.div
        className="absolute w-12 h-12 flex items-center justify-center text-emerald-400/30"
        initial={{ left: '-10%', top: '80%', rotate: 15 }}
        animate={{
          left: ['-10%', '30%', '55%', '85%', '110%'],
          top: ['80%', '45%', '55%', '25%', '-10%'],
          rotate: [15, -10, 40, -15, -30],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'linear',
          delay: 2,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-emerald-400"
        >
          {/* Futuristic paper airplane / origami glider design */}
          <path d="M22 2L2 9l9.5 2.5L14 21l8-19z" />
          <path d="M11.5 11.5L22 2" />
        </svg>

        {/* Trail particles (engines / sparkles) */}
        <div className="absolute top-1/2 left-0 -translate-x-full flex space-x-1 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-ping [animation-duration:1.5s]" />
          <span className="w-1 h-1 rounded-full bg-indigo-500/40 animate-ping [animation-duration:2s]" />
        </div>
      </motion.div>

      {/* Another secondary subtle satellite orb drifting across the background */}
      <motion.div
        className="absolute w-8 h-8 flex items-center justify-center text-indigo-400/20"
        initial={{ left: '110%', top: '20%', rotate: -45 }}
        animate={{
          left: ['110%', '60%', '30%', '-10%'],
          top: ['20%', '45%', '70%', '90%'],
          rotate: [-45, -25, -5, 15],
        }}
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: 'linear',
          delay: 15,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-6 h-6 text-indigo-400"
        >
          {/* Drone/Satellite shaped outline */}
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v6" />
          <path d="M12 16v6" />
          <path d="M2 12h6" />
          <path d="M16 12h6" />
        </svg>
      </motion.div>

    </div>
  );
}
