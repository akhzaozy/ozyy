import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Github, Send, Terminal, Clock, Star, Sparkles, Shield, Cpu, Code, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
}

export default function HeroSection({ setActiveTab, profile }: HeroSectionProps) {
  const [time, setTime] = useState(new Date());
  const [terminalText, setTerminalText] = useState('');
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  
  // Interactive 3D Card mouse tracking
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for buttery smooth cursor physics
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse positions to rotational angles
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Terminal simulated logs loop
  const terminalLines = [
    'npm run start:fullstack',
    '> booting development server on port 3000...',
    '> routes: mounting Express API controllers...',
    '> database: local JSON isolated storage online (OK)',
    '> ai: Gemini-3.5-Flash cognitive engine connected',
    '> system: listening for client inquiries at /api/contacts',
    '> ready: fully responsive premium animation engine ready.'
  ];

  useEffect(() => {
    let charIdx = 0;
    let timer: NodeJS.Timeout;
    
    const typeLine = () => {
      const line = terminalLines[currentLineIdx];
      if (charIdx <= line.length) {
        setTerminalText(line.substring(0, charIdx));
        charIdx++;
        timer = setTimeout(typeLine, 45);
      } else {
        // Line fully typed, wait and move to next
        timer = setTimeout(() => {
          setCurrentLineIdx((prev) => (prev + 1) % terminalLines.length);
          setTerminalText('');
        }, 3000);
      }
    };

    typeLine();
    return () => clearTimeout(timer);
  }, [currentLineIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized position from -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      
      {/* Dynamic Background Glowing Spheres */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.08)_0%,transparent_50%)]" />
      
      {/* Decorative Interactive Stars/Sparks layer */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute top-[40%] right-[10%] w-1 h-1 bg-emerald-400 rounded-full animate-ping [animation-duration:4s]" />
        <div className="absolute bottom-[30%] left-[45%] w-2 h-2 bg-sky-400 rounded-full animate-pulse [animation-duration:5s]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Typography & Introduction */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 text-left">
            
            {/* Animated Status Tag with physical spring */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex self-start items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-indigo-400 shadow-xl shadow-indigo-500/5 hover:border-indigo-500/30 transition-all duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Creative Fullstack Roles</span>
            </motion.div>

            {/* Typography with asymmetric sizes */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
              >
                Membangun <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 hover:brightness-110 transition-all">
                  Karya Digital
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-xl sm:text-2xl font-semibold text-slate-300 tracking-tight"
              >
                Melalui Arsitektur Semantik & Animasi Mikro Presisi.
              </motion.h2>
            </div>

            {/* Dynamic Bio Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed font-sans"
            >
              {profile.bio}
            </motion.p>

            {/* High-fidelity Interactive Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                id="hero-cta-projects"
                onClick={() => setActiveTab('projects')}
                className="group px-7 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-2xl text-sm font-semibold flex items-center gap-2.5 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <span>Eksplorasi Proyek</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>

              <button
                id="hero-cta-contact"
                onClick={() => setActiveTab('contact')}
                className="group px-7 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-2xl text-sm font-semibold border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Hubungi Saya</span>
                <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Side - Interactive 3D Avatar and Terminal Grid */}
          <div className="lg:col-span-6 flex flex-col space-y-6 relative">
            
            {/* 3D Perspective Photo Card */}
            <div 
              className="perspective-1000 w-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={cardRef}
            >
              <motion.div
                style={{ rotateX, rotateY }}
                className="w-full bg-slate-950/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-shadow hover:shadow-indigo-500/5 duration-500"
              >
                {/* Embedded dynamic light follow grid */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

                {/* Main Avatar layout inside card */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                  
                  {/* Avatar Container with glowing rings */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 opacity-75 blur animate-pulse [animation-duration:4s]" />
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-950">
                      <img
                        src={profile.avatarUrl}
                        alt={`${profile.name} Portrait`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Miniature overlay status chip */}
                    <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-slate-300 font-bold">LIVE</span>
                    </div>
                  </div>

                  {/* Dev metadata column */}
                  <div className="space-y-4 text-center sm:text-left flex-grow">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <h3 className="font-display font-bold text-white text-xl sm:text-2xl">{profile.name}</h3>
                        <Sparkles size={16} className="text-amber-400 fill-amber-400" />
                      </div>
                      <p className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">{profile.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1.5">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 flex items-center gap-2">
                        <Cpu size={14} className="text-indigo-400" />
                        <div>
                          <div className="text-[10px] font-mono text-slate-500">ENGINE</div>
                          <div className="text-xs font-bold text-white font-mono">React 19</div>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 flex items-center gap-2">
                        <Database size={14} className="text-emerald-400" />
                        <div>
                          <div className="text-[10px] font-mono text-slate-500">DATABASE</div>
                          <div className="text-xs font-bold text-white font-mono">MariaDB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Metrics banner removed based on request */}

              </motion.div>
            </div>

            {/* Interactive Shell Console Widget */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                  <Terminal size={14} className="text-indigo-400" />
                  <span className="font-semibold text-slate-300">akhza_node_console_v2.0</span>
                </div>
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
              </div>

              {/* Console Body showing typed command lines */}
              <div className="font-mono text-xs text-left space-y-1.5 h-24 overflow-y-auto">
                {terminalLines.slice(0, currentLineIdx).map((line, idx) => (
                  <div key={idx} className="text-slate-500">
                    {line.startsWith('npm') || line.startsWith('>') ? '' : '$ '}
                    {line}
                  </div>
                ))}
                <div className="text-emerald-400 flex items-center gap-1">
                  <span>$</span>
                  <span>{terminalText}</span>
                  <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block" />
                </div>
              </div>

              {/* Embedded Real-time Dynamic Clock */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-indigo-400" />
                  <span>Waktu Lokal: <strong className="text-slate-300">{formatTime(time)}</strong></span>
                </span>
                <span>{formatDate(time)}</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
