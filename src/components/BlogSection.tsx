import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost } from '../types';
import { BookOpen, Calendar, User, ArrowLeft, Search, Tag, MessageSquareCode } from 'lucide-react';

interface BlogSectionProps {
  blogs: BlogPost[];
  onRefreshBlogs: () => void;
}

// Simple and highly robust custom Markdown-to-HTML formatter to keep things 100% stable without risky packages
function CustomMarkdownRenderer({ markdown }: { markdown: string }) {
  if (!markdown) return null;

  const lines = markdown.split('\n');
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  
  const parsedElements = lines.map((line, idx) => {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeContent = codeBlockLines.join('\n');
        codeBlockLines = [];
        return (
          <pre key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto my-4 text-xs font-mono text-indigo-300">
            <code>{codeContent}</code>
          </pre>
        );
      } else {
        inCodeBlock = true;
        return null;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return null;
    }

    // Heading 2
    if (line.trim().startsWith('## ')) {
      return <h2 key={idx} className="text-xl sm:text-2xl font-display font-bold text-white mt-8 mb-4 border-b border-slate-900 pb-2">{line.replace('## ', '')}</h2>;
    }

    // Heading 3
    if (line.trim().startsWith('### ')) {
      return <h3 key={idx} className="text-lg font-display font-bold text-slate-200 mt-6 mb-3">{line.replace('### ', '')}</h3>;
    }

    // Blockquote
    if (line.trim().startsWith('> ')) {
      return (
        <blockquote key={idx} className="border-l-4 border-indigo-500 pl-4 py-1 my-4 text-slate-400 italic bg-slate-900/40 rounded-r-md">
          {line.replace('> ', '')}
        </blockquote>
      );
    }

    // List item
    if (line.trim().startsWith('- ')) {
      return <li key={idx} className="ml-6 list-disc text-slate-300 mb-1.5">{line.replace('- ', '')}</li>;
    }
    if (line.trim().startsWith('* ')) {
      return <li key={idx} className="ml-6 list-disc text-slate-300 mb-1.5">{line.replace('* ', '')}</li>;
    }

    // Empty line
    if (!line.trim()) {
      return <div key={idx} className="h-4" />;
    }

    // Standard paragraph with bold parsing (**word**) and inline code (`code`)
    const parts: React.ReactNode[] = [];
    let currentText = line;
    let textIndex = 0;

    // A simple parser for bold and inline code
    const tokenRegex = /(\*\*.*?\*\*|`.*?`)/g;
    let match;
    
    while ((match = tokenRegex.exec(currentText)) !== null) {
      const matchIndex = match.index;
      const matchText = match[0];
      
      // Push text preceding the match
      if (matchIndex > textIndex) {
        parts.push(currentText.substring(textIndex, matchIndex));
      }

      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(<strong key={matchIndex} className="text-white font-semibold">{matchText.substring(2, matchText.length - 2)}</strong>);
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        parts.push(<code key={matchIndex} className="bg-slate-900 text-rose-400 font-mono px-1.5 py-0.5 rounded text-xs">{matchText.substring(1, matchText.length - 1)}</code>);
      }

      textIndex = tokenRegex.lastIndex;
    }

    if (textIndex < currentText.length) {
      parts.push(currentText.substring(textIndex));
    }

    return <p key={idx} className="text-slate-300 mb-4 leading-relaxed text-sm sm:text-base">{parts}</p>;
  });

  return <div className="prose max-w-none">{parsedElements.filter(el => el !== null)}</div>;
}

export default function BlogSection({ blogs, onRefreshBlogs }: BlogSectionProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Auto refresh blogs on component mount
  useEffect(() => {
    onRefreshBlogs();
  }, []);

  // Filter logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  // Extract all unique tags
  const allTags = Array.from(
    new Set(blogs.flatMap(blog => blog.tags || []))
  );

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-slate-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {!selectedBlog ? (
            // LIST VIEW
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Header section */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-400">
                  <BookOpen size={12} />
                  <span>Jurnal & Catatan</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Blog & Pemikiran Dinamis
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  Artikel teknologi, wawasan desain UI/UX, dan pemikiran seputar full-stack coding yang terintegrasi langsung dengan database lokal.
                </p>
              </div>

              {/* Search & Tag Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
                
                {/* Search field */}
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="blog-search-input"
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Tags filters */}
                <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                  <button
                    id="blog-tag-all"
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTag === null
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Semua Tag
                  </button>
                  {allTags.map((tag) => (
                    <button
                      id={`blog-tag-btn-${tag}`}
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        selectedTag === tag
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Tag size={10} />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blogs Grid */}
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-2xl">
                  <MessageSquareCode size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400 font-mono text-sm">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredBlogs.map((blog, idx) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      onClick={() => setSelectedBlog(blog)}
                      className="group cursor-pointer bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-indigo-950/5"
                    >
                      {/* Cover Image */}
                      <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      </div>

                      {/* Content details */}
                      <div className="p-6 flex flex-col flex-grow space-y-3">
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-indigo-400" />
                            {blog.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} className="text-sky-400" />
                            {blog.author}
                          </span>
                        </div>

                        {/* Title & summary */}
                        <div className="space-y-1">
                          <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-indigo-400 transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                            {blog.summary}
                          </p>
                        </div>

                        {/* Tags list */}
                        <div className="flex flex-wrap gap-1.5 pt-3 mt-auto">
                          {blog.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-indigo-400 border border-slate-800/80">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            // DETAIL VIEW
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Back Button */}
              <button
                id="blog-back-btn"
                onClick={() => setSelectedBlog(null)}
                className="group px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Daftar</span>
              </button>

              {/* Main Cover Image */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={selectedBlog.coverImage}
                  alt={selectedBlog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Header Title Information */}
              <div className="space-y-4 border-b border-slate-900 pb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags.map(t => (
                    <span key={t} className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-xs font-mono text-indigo-400 border border-indigo-500/20">
                      {t}
                    </span>
                  ))}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {selectedBlog.title}
                </h1>

                <div className="flex items-center gap-6 text-sm font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-indigo-400" />
                    {selectedBlog.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-sky-400" />
                    Ditulis oleh {selectedBlog.author}
                  </span>
                </div>
              </div>

              {/* Formatted Article Body */}
              <div className="py-2">
                <CustomMarkdownRenderer markdown={selectedBlog.content} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
