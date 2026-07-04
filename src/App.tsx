import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import BlogSection from './components/BlogSection';
import ContactHub from './components/ContactHub';
import AdminPortal from './components/AdminPortal';
import BackgroundAnimation from './components/BackgroundAnimation';
import { BlogPost, UserProfile } from './types';
import { Sparkles, Terminal, Mail, GitBranch, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Akhza Fachrozy",
    title: "Senior Fullstack Developer & Creative Architect",
    bio: "Saya mendesain dan mengembangkan ekosistem web yang interaktif dengan micro-interactions responsif, database modular mandiri, dan integrasi AI cerdas.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
    githubUrl: "https://github.com/akhza",
    linkedinUrl: "https://linkedin.com/in/akhza",
    email: "akhza.04@gmail.com"
  });
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Fetch blogs from server
  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  // Fetch profile from server
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchProfile();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        cursorRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Custom scroll helper when selecting a home sub-tab
  useEffect(() => {
    if (activeTab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTab === 'skills' || activeTab === 'projects' || activeTab === 'contact') {
      const el = document.getElementById(activeTab);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Blog & Admin are separate full screens, scroll to top on enter
      window.scrollTo({ top: 0 });
    }
  }, [activeTab]);

  return (
    <div id="app-root" className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      
      {/* Background Particles & Flying Aircrafts */}
      <BackgroundAnimation />
      
      {/* High-Performance Interactive Cursor Spotlight Tracker */}
      <div 
        ref={cursorRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-60 hidden sm:block"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.08), transparent 80%)`
        }}
      />

      {/* Dynamic Aesthetic Backdrop Grid Lines */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Floating Header Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        profile={profile}
      />

      {/* Main Content Render */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'blog' ? (
            <motion.div
              key="blog-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSection blogs={blogs} onRefreshBlogs={fetchBlogs} />
            </motion.div>
          ) : activeTab === 'admin' ? (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPortal blogs={blogs} onRefreshBlogs={fetchBlogs} profile={profile} onRefreshProfile={fetchProfile} />
            </motion.div>
          ) : (
            // UNIFIED MAIN SCROLLING LANDING PAGE (Home, Skills, Projects, Contact)
            <motion.div
              key="landing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="divide-y divide-slate-900/40"
            >
              <HeroSection setActiveTab={setActiveTab} profile={profile} />
              <SkillsSection />
              <ProjectsSection />
              <ContactHub profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-12 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <span className="font-display font-black text-indigo-400 text-xs">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </span>
              </div>
              <div>
                <span className="block font-bold text-slate-300">{profile.name} © 2026</span>
                <span className="text-[10px] text-slate-500 font-mono">Bebas Dependensi Cloud Eksternal</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px]">
              <button onClick={() => setActiveTab('home')} className="hover:text-indigo-400 transition-colors">Beranda</button>
              <button onClick={() => setActiveTab('skills')} className="hover:text-indigo-400 transition-colors">Keahlian</button>
              <button onClick={() => setActiveTab('projects')} className="hover:text-indigo-400 transition-colors">Proyek</button>
              <button onClick={() => setActiveTab('blog')} className="hover:text-indigo-400 transition-colors">Blog</button>
              <button onClick={() => setActiveTab('admin')} className="hover:text-indigo-400 transition-colors">Admin Hub</button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-lg">
              <Terminal size={12} className="text-emerald-400 animate-pulse" />
              <span>Fullstack Express + React App</span>
            </div>

          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 border border-indigo-500 z-50 transition-all cursor-pointer"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
