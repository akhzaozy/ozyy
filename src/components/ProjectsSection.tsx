import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderGit2, ExternalLink, Github, Code, Sparkles, X, 
  Terminal, Cpu, Database, Check, Play, Zap 
} from 'lucide-react';
import { Project } from '../types';

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Web' | 'System' | 'AI Tool'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [testingLatency, setTestingLatency] = useState(false);
  const [latencyResult, setLatencyResult] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  const filters = ['all', 'Web', 'System', 'AI Tool'];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  // Simulated latency test for each project
  const triggerLatencyTest = () => {
    setTestingLatency(true);
    setLatencyResult(null);
    setTimeout(() => {
      const ms = Math.floor(Math.random() * 25) + 12;
      setTestingLatency(false);
      setLatencyResult(`PING SUCCESSFUL: Response received in ${ms}ms. Status: 100% Operational.`);
    }, 1200);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setLatencyResult(null);
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-950/20">
      
      {/* Decorative backdrop mesh lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.03)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400"
            >
              <FolderGit2 size={13} />
              <span>Portofolio Karya</span>
            </motion.div>
            
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Proyek Pilihan Terpopuler
            </h2>
            <p className="text-slate-400 max-w-lg text-sm sm:text-base leading-relaxed">
              Eksplorasi pembuatan aplikasi nyata dengan kode bersih, kinerja mulus, dan fungsionalitas cerdas.
            </p>
          </div>

          {/* Filtering Tabs with Micro-stretching */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isSelected = activeFilter === f;
              return (
                <button
                  id={`project-filter-${f}`}
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/15'
                      : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                  }`}
                >
                  <span>{f === 'all' ? 'Semua' : f}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid with Hover Zoom Mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              onClick={() => setSelectedProject(project)}
              className="bg-slate-950/40 backdrop-blur-md border border-slate-900 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer relative"
            >
              {/* Cover Image with Parallax zoom */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-60 z-10" />
                <img
                  src={project.coverImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Category Pill */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-900 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest z-20">
                  {project.category}
                </div>

                {/* Hover Reveal Floating Badge */}
                <div className="absolute inset-0 bg-indigo-950/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                  <span className="bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-2xl text-xs font-mono text-white flex items-center gap-2 shadow-xl">
                    <Sparkles size={12} className="text-amber-400 fill-amber-400" />
                    <span>Detail & Interaksi</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow space-y-5 justify-between relative z-10">
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-white text-xl tracking-tight group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tech Badges Row */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-950 text-[10px] font-mono text-slate-400 group-hover:text-white group-hover:border-slate-800 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Aesthetic Call-to-action bar */}
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                    <span className="flex items-center gap-1">
                      <Code size={12} className="text-indigo-400" />
                      <span>Arsitektur Modular</span>
                    </span>
                    <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Klik Detail →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Dynamic Screen Overlay Modal / Workspace Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Dark glass backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body with spring layout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="bg-slate-950 border border-slate-900/80 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row h-[85vh] md:h-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                id="close-project-modal"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all z-30 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Left Side: Image & Live metrics console */}
              <div className="w-full md:w-5/12 bg-slate-900/40 border-r border-slate-900 flex flex-col">
                <div className="relative aspect-video md:aspect-square overflow-hidden">
                  <img
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>

                {/* Built-in latency run test Sandbox panel */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Terminal size={14} className="text-emerald-400" />
                      <span>Sandbox Uji Latency Layanan</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Jalankan simulasi interaktif untuk mengukur kecepatan respons arsitektur server di port 3000.
                    </p>
                  </div>

                  {/* Test Console Output */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 h-24 overflow-y-auto font-mono text-[10px] text-slate-400 relative">
                    {testingLatency ? (
                      <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                        <Zap size={10} className="animate-bounce" />
                        <span>$ ping -c 1 {selectedProject.title.toLowerCase().replace(/\s+/g, '_')}_server...</span>
                      </div>
                    ) : latencyResult ? (
                      <div className="space-y-1">
                        <div className="text-slate-500">$ ping -c 1 {selectedProject.title.toLowerCase().replace(/\s+/g, '_')}_server</div>
                        <div className="text-emerald-400 font-bold">{latencyResult}</div>
                      </div>
                    ) : (
                      <span className="text-slate-600">Console siap. Klik tombol di bawah untuk memulai tes...</span>
                    )}
                  </div>

                  {/* Trigger test button */}
                  <button
                    onClick={triggerLatencyTest}
                    disabled={testingLatency}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-200 hover:text-white font-mono text-xs rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Play size={11} className="fill-slate-200" />
                    <span>{testingLatency ? 'Memproses Uji...' : 'Mulai Uji Latency'}</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Narrative and Action lists */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  
                  {/* Category Pill + Title */}
                  <div className="space-y-2 pt-4 md:pt-0">
                    <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold">
                      {selectedProject.category}
                    </span>
                    <h3 className="font-display font-black text-white text-2xl sm:text-3xl tracking-tight">
                      {selectedProject.title}
                    </h3>
                  </div>

                  {/* Complete Description */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Deskripsi Arsitektur</h4>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Fitur Unggulan</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-400" />
                        <span>Sistem caching memori super-cepat bebas lag.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-400" />
                        <span>Integrasi multi-platform terstandarisasi.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-400" />
                        <span>Tampilan modular dengan fluid layout bertenaga CSS Grid.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Footer buttons row */}
                <div className="mt-8 pt-6 border-t border-slate-900 flex flex-wrap gap-3">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow sm:flex-grow-0 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all"
                    >
                      <Github size={14} />
                      <span>Buka Repository</span>
                    </a>
                  )}

                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
                    >
                      <span>Kunjungi Live Demo</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
