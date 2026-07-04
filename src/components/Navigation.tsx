import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Code2, ShieldAlert, Sparkles, BookOpen, Layers } from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  profile: UserProfile;
}

export default function Navigation({ activeTab, setActiveTab, isAdminMode, setIsAdminMode, profile }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'AF';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Sparkles },
    { id: 'skills', label: 'Keahlian', icon: Layers },
    { id: 'projects', label: 'Proyek', icon: Code2 },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'contact', label: 'Hubungi', icon: Code2 },
  ];

  return (
    <nav
      id="main-nav"
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'top-4 w-[95%] md:w-[85%] max-w-5xl rounded-full border border-white/10 bg-slate-950/30 backdrop-blur-xl py-2 px-4 shadow-2xl shadow-indigo-500/10'
          : 'top-0 w-full max-w-full rounded-none border-b border-transparent bg-transparent py-5 px-4 sm:px-6 lg:px-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner transition-all duration-300 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/5">
              <span className="font-display font-extrabold text-white text-base tracking-wider">
                {initials}<span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">.</span>
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-white tracking-tight text-sm group-hover:text-indigo-300 transition-colors">{profile.name}</span>
              <span className="block text-[10px] text-slate-400 font-mono">Creative Architect</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-btn-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-slate-800/80 border border-slate-700/50 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`md:hidden px-4 pt-2 pb-4 space-y-1 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? 'mt-3 rounded-3xl border border-white/10 bg-slate-950/80'
              : 'border-b border-slate-800 bg-slate-950/95'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                id={`mobile-nav-btn-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
}
