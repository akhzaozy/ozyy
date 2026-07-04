import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill } from '../types';
import { 
  Code, Shield, Palette, Server, Database, Sparkles, 
  Compass, GitBranch, Terminal, Layout, Wrench, ChevronRight 
} from 'lucide-react';

// Map icon name from data dynamically to Lucide icons
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Code': return Code;
    case 'Shield': return Shield;
    case 'Palette': return Palette;
    case 'Server': return Server;
    case 'Database': return Database;
    case 'Sparkles': return Sparkles;
    case 'Compass': return Compass;
    case 'GitBranch': return GitBranch;
    default: return Terminal;
  }
};

// Custom interactive syntax snippets for each skill
const getCodeSnippet = (name: string) => {
  switch (name) {
    case 'React / Next.js':
      return 'const App = () => <AkhzaPortfolio interactive={true} />;';
    case 'TypeScript':
      return 'type Architect = { name: "Akhza"; mastery: "Fullstack"; };';
    case 'Tailwind CSS':
      return '<div className="hover:scale-105 active:rotate-1 transition-all" />';
    case 'Node.js / Express':
      return 'app.listen(3000, () => console.log("System Online"));';
    case 'PostgreSQL / MariaDB':
      return 'SELECT * FROM metrics WHERE owner = "Akhza" ORDER BY level DESC;';
    case 'Framer Motion':
      return '<motion.div animate={{ scale: [0.9, 1.05, 1] }} />';
    case 'Figma UI/UX':
      return '// Variables, AutoLayout, Fluid Spacing & Style Tokens';
    case 'Git & GitHub':
      return 'git commit -m "feat: added interactive custom micro-animations"';
    case 'Docker':
      return 'FROM node:alpine \\n COPY . . \\n CMD ["node", "server.js"]';
    default:
      return 'console.log("Exploring creative engineering...");';
  }
};

export default function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'frontend' | 'backend' | 'design' | 'tools'>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error(err));
  }, []);

  const categories = [
    { id: 'all', label: 'Semua', icon: Layout },
    { id: 'frontend', label: 'Frontend', icon: Layout },
    { id: 'backend', label: 'Backend & DB', icon: Server },
    { id: 'design', label: 'Creative Design', icon: Palette },
    { id: 'tools', label: 'DevOps & Tools', icon: Wrench },
  ];

  const filteredSkills = activeFilter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeFilter);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background Decorative Mesh lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.03)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-900 text-xs font-mono text-indigo-400 shadow-sm"
          >
            <Shield size={13} className="text-indigo-400" />
            <span>Keahlian & Kemampuan Teknis</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Teknologi yang Saya Kuasai
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Kombinasi antara kerangka kerja modern, arsitektur data mandiri berkinerja tinggi, dan perhatian tinggi pada estetika visual.
          </motion.p>
        </div>

        {/* Categories Tab Selector with Micro-interactivity */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeFilter === cat.id;
            return (
              <button
                id={`skill-filter-${cat.id}`}
                key={cat.id}
                onClick={() => setActiveFilter(cat.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2.5 border relative cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-600/15' 
                    : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
                {isSelected && (
                  <motion.span 
                    layoutId="activeFilterGlow"
                    className="absolute inset-0 rounded-2xl border border-indigo-400 opacity-30 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const IconComponent = getIconComponent(skill.iconName || '');
              const isHovered = hoveredSkill === skill.name;

              return (
                <motion.div
                  layout
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="bg-slate-950/40 backdrop-blur-md border border-slate-900 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 group hover:shadow-2xl hover:shadow-indigo-500/5 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Glowing background card shine */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    {/* Header: Icon, Name & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 group-hover:bg-emerald-950/10 transition-all duration-300">
                          <IconComponent size={18} />
                        </div>
                        <span className="font-display font-bold text-slate-100 text-sm group-hover:text-white transition-colors">{skill.name}</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 transition-all">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar Container with Interactive glow */}
                    <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden border border-slate-900">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 h-full rounded-full"
                      />
                    </div>
                  </div>

                  {/* Interactive Dynamic Code Sandbox Preview area */}
                  <div className="mt-5 pt-4 border-t border-slate-900/60 flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>SYNTAX PREVIEW</span>
                      <span className="text-indigo-400/80 group-hover:text-emerald-400 transition-colors flex items-center gap-0.5">
                        Interactive <ChevronRight size={10} />
                      </span>
                    </div>
                    
                    <div className="bg-slate-950 border border-slate-900/80 rounded-xl p-3 h-14 flex items-center overflow-x-auto font-mono text-[10.5px] text-slate-400 relative group-hover:border-indigo-500/20 transition-all">
                      <span className="text-indigo-400/90 mr-1.5 select-none">$</span>
                      <span className="text-slate-300 font-medium truncate">
                        {getCodeSnippet(skill.name)}
                      </span>
                    </div>
                  </div>

                  {/* Aesthetic Category label at bottom-right */}
                  <div className="flex justify-end mt-3">
                    <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase bg-slate-900/40 px-2 py-0.5 rounded-md border border-slate-900/60">
                      {skill.category}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
