import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, ContactMessage, UserProfile } from '../types';
import { 
  Lock, Unlock, Sparkles, Trash2, Plus, 
  Mail, BookOpen, Edit, Copy, Check, 
  CheckSquare, Calendar, AlertCircle, Eye, EyeOff,
  User, Settings, Upload, Terminal, FolderGit2
} from 'lucide-react';
import AdminSkills from './AdminSkills';
import AdminProjects from './AdminProjects';

interface AdminPortalProps {
  blogs: BlogPost[];
  onRefreshBlogs: () => void;
  profile: UserProfile;
  onRefreshProfile: () => void;
}

export default function AdminPortal({ blogs, onRefreshBlogs, profile, onRefreshProfile }: AdminPortalProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'blogs' | 'contacts' | 'profile' | 'skills' | 'projects'>('blogs');
  
  // Contacts State
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // New Blog Form State
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
    author: 'Akhza Fachrozy'
  });

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    heroTitle: '',
    heroSubtitle: '',
    contactTitle: '',
    contactSubtitle: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Image Upload State & Handlers
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState('');
  const [coverUploadError, setCoverUploadError] = useState('');

  const handleImageUpload = async (
    file: File, 
    type: 'avatar' | 'cover'
  ) => {
    const setUploading = type === 'avatar' ? setIsUploadingAvatar : setIsUploadingCover;
    const setError = type === 'avatar' ? setAvatarUploadError : setCoverUploadError;
    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          data: base64Data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengunggah gambar');
      }

      const result = await response.json();
      const imageUrl = result.url;

      if (type === 'avatar') {
        setProfileForm(prev => ({ ...prev, avatarUrl: imageUrl }));
      } else {
        setBlogFormData(prev => ({ ...prev, coverImage: imageUrl }));
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Gagal mengunggah berkas gambar');
    } finally {
      setUploading(false);
    }
  };

  // Sync profile form when profile prop changes
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        email: profile.email || '',
        heroTitle: profile.heroTitle || '',
        heroSubtitle: profile.heroSubtitle || '',
        contactTitle: profile.contactTitle || '',
        contactSubtitle: profile.contactSubtitle || ''
      });
    }
  }, [profile]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        setProfileSuccessMsg('Profil berhasil diperbarui!');
        onRefreshProfile();
        // Hide message after 3 seconds
        setTimeout(() => setProfileSuccessMsg(''), 3000);
      } else {
        console.error('Failed to save profile');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // PIN validation
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '230604') {
      setIsLocked(false);
      setPinError(false);
      fetchContacts();
    } else {
      setPinError(true);
      setPin('');
    }
  };

  // Fetch Contacts
  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Error fetching contact list:", err);
    } finally {
      setContactsLoading(false);
    }
  };

  // Refresh data when unlocked
  useEffect(() => {
    if (!isLocked) {
      fetchContacts();
      onRefreshBlogs();
    }
  }, [isLocked]);

  // Create Blog submit handler
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormData.title || !blogFormData.content) {
      alert('Judul dan isi artikel tidak boleh kosong.');
      return;
    }

    const payload = {
      ...blogFormData,
      tags: blogFormData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const endpoint = editingBlogId ? `/api/blogs/${editingBlogId}` : '/api/blogs';
      const method = editingBlogId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsCreatingBlog(false);
        setEditingBlogId(null);
        setBlogFormData({
          title: '',
          summary: '',
          content: '',
          tags: '',
          coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
          author: 'Akhza Fachrozy'
        });
        onRefreshBlogs();
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal menyimpan artikel.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim data ke server.');
    }
  };

  // Delete Blog handler
  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Blog setup helper
  const startEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogFormData({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      tags: blog.tags.join(', '),
      coverImage: blog.coverImage,
      author: blog.author
    });
    setIsCreatingBlog(true);
  };

  // Contact Mark Replied handler
  const handleToggleReplied = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}/replied`, { method: 'POST' });
      if (res.ok) {
        fetchContacts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Copy reply draft to clipboard
  const handleCopyDraft = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLocked) {
    return (
      <section id="admin-auth" className="py-32 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-950/60 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock size={22} />
            </div>
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl">Admin Creator Hub</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Dashboard pengelola portofolio untuk menerbitkan artikel dan meninjau pesan klien masuk bertenaga AI.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="pin-input" className="text-xs font-mono text-slate-400 block text-center">Masukkan Pin Akses Keamanan</label>
              <input
                id="pin-input"
                type="password"
                placeholder="• • • • • •"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-lg font-bold tracking-widest text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {pinError && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-mono">
                <AlertCircle size={12} />
                <span>PIN tidak valid. Silakan coba lagi.</span>
              </div>
            )}

            <button
              id="pin-submit-btn"
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Masuk Dashboard
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="admin-dashboard" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                <Unlock size={12} />
                Administrator Mode
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Creator Dashboard Hub
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-logout-btn"
              onClick={() => {
                setIsLocked(true);
                setPin('');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Kunci Portal
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/80">
          <button
            id="admin-tab-blogs"
            onClick={() => {
              setActiveSubTab('blogs');
              setIsCreatingBlog(false);
              setEditingBlogId(null);
            }}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'blogs'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} />
            <span>Kelola Artikel Blog ({blogs.length})</span>
          </button>
          <button
            id="admin-tab-contacts"
            onClick={() => setActiveSubTab('contacts')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'contacts'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail size={16} />
            <span>Klien Masuk ({contacts.length})</span>
          </button>
          <button
            id="admin-tab-profile"
            onClick={() => setActiveSubTab('profile')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'profile'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={16} />
            <span>Pengaturan Profil & Teks</span>
          </button>
          <button
            id="admin-tab-skills"
            onClick={() => setActiveSubTab('skills')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'skills'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal size={16} />
            <span>Keahlian</span>
          </button>
          <button
            id="admin-tab-projects"
            onClick={() => setActiveSubTab('projects')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'projects'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 size={16} />
            <span>Proyek</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-4">
          
          {/* 1. BLOGS MANAGEMENT */}
          {activeSubTab === 'blogs' && (
            <div className="space-y-8">
              
              {!isCreatingBlog ? (
                <>
                  <div className="flex justify-end pt-2 border-t border-slate-900">
                      <button
                        id="admin-new-blog-manual-btn"
                        onClick={() => setIsCreatingBlog(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Tulis Artikel Baru</span>
                      </button>
                    </div>

                  {/* List of current blogs */}
                  <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-slate-900/50 border-b border-slate-900 flex justify-between items-center">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Daftar Artikel Blog</h4>
                    </div>

                    {blogs.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 font-mono text-xs">Belum ada artikel diterbitkan.</div>
                    ) : (
                      <div className="divide-y divide-slate-900">
                        {blogs.map(blog => (
                          <div key={blog.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1.5 max-w-2xl">
                              <h5 className="font-display font-bold text-white text-md sm:text-lg">{blog.title}</h5>
                              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                                <span className="text-indigo-400 font-semibold">{blog.date}</span>
                                <span>•</span>
                                <span>Oleh {blog.author}</span>
                                <span>•</span>
                                <div className="flex gap-1">
                                  {blog.tags.map(t => <span key={t} className="text-[10px] text-sky-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">#{t}</span>)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <button
                                id={`admin-edit-blog-${blog.id}`}
                                onClick={() => startEditBlog(blog)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-all"
                                title="Edit Artikel"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                id={`admin-delete-blog-${blog.id}`}
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-2 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-400 rounded-lg transition-all"
                                title="Hapus Artikel"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // FORM TO WRITE / EDIT BLOG
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <h3 className="font-display font-bold text-white text-lg">
                      {editingBlogId ? 'Edit Artikel Blog' : 'Tulis Artikel Blog Baru'}
                    </h3>
                    <button
                      id="admin-form-cancel"
                      onClick={() => {
                        setIsCreatingBlog(false);
                        setEditingBlogId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleBlogSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="blog-title" className="text-xs font-semibold text-slate-400">Judul Artikel *</label>
                      <input
                        id="blog-title"
                        type="text"
                        placeholder="Contoh: Seni Tata Letak Fleksibel di Web Modern"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="blog-tags" className="text-xs font-semibold text-slate-400">Tag (Pemisah Koma) *</label>
                        <input
                          id="blog-tags"
                          type="text"
                          placeholder="React, CSS, Desain Web"
                          value={blogFormData.tags}
                          onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label htmlFor="blog-cover" className="text-xs font-semibold text-slate-400">Gambar Sampul</label>
                          {isUploadingCover && <span className="text-[10px] text-indigo-400 animate-pulse">Mengunggah...</span>}
                        </div>
                        <div className="flex gap-2">
                          <input
                            id="blog-cover"
                            type="text"
                            placeholder="https://images.unsplash.com/photo-... atau unggah berkas"
                            value={blogFormData.coverImage}
                            onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer select-none transition-all">
                            <Upload size={14} />
                            <span>Unggah</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageUpload(e.target.files[0], 'cover');
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {coverUploadError && (
                          <div className="text-xs text-rose-500 font-mono mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            <span>{coverUploadError}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="blog-summary" className="text-xs font-semibold text-slate-400">Ringkasan Pendek (Summary) *</label>
                      <textarea
                        id="blog-summary"
                        rows={2}
                        placeholder="Tulis ringkasan singkat artikel dalam 1-2 kalimat untuk kartu depan..."
                        value={blogFormData.summary}
                        onChange={(e) => setBlogFormData({ ...blogFormData, summary: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="blog-content" className="text-xs font-semibold text-slate-400">Konten Artikel Lengkap (Mendukung Markdown) *</label>
                      <textarea
                        id="blog-content"
                        rows={12}
                        placeholder="Gunakan syntax Markdown seperti ## Subheading, > Kutipan, - List, atau **Teks Tebal**"
                        value={blogFormData.content}
                        onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        id="admin-blog-cancel"
                        type="button"
                        onClick={() => {
                          setIsCreatingBlog(false);
                          setEditingBlogId(null);
                        }}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Batal
                      </button>

                      <button
                        id="admin-blog-save"
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl text-xs font-semibold"
                      >
                        {editingBlogId ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </div>
          )}

          {/* 2. CONTACT MESSAGES */}
          {activeSubTab === 'contacts' && (
            <div className="space-y-6">
              <div className="bg-slate-900/20 p-4 rounded-xl border border-slate-800/80">
                <p className="text-slate-400 text-xs font-mono">
                  🔑 Sistem di backend menganalisis secara otomatis setiap pesan yang dikirim menggunakan Gemini AI untuk mengidentifikasi Kategori/Sentimen pesan serta menyusun respons instan.
                </p>
              </div>

              {contactsLoading ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">Mengunduh daftar pesan klien...</div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs bg-slate-950/30 border border-slate-850 rounded-2xl">
                  Belum ada pesan klien masuk dari form kontak.
                </div>
              ) : (
                <div className="space-y-6">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`bg-slate-950/50 border rounded-2xl overflow-hidden p-6 space-y-4 transition-all duration-200 ${
                        contact.replied ? 'border-slate-900 opacity-70' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Message meta row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-3">
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-white text-md flex items-center gap-2">
                            <span>{contact.name}</span>
                            <span className="text-xs font-mono text-slate-400 font-normal">({contact.email})</span>
                          </h4>
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                            <Calendar size={12} />
                            <span>{new Date(contact.createdAt).toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Badges / Controls */}
                        <div className="flex items-center gap-2">
                          {contact.sentiment && (
                            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              Sentiment: {contact.sentiment}
                            </span>
                          )}

                          <button
                            id={`admin-reply-toggle-${contact.id}`}
                            onClick={() => handleToggleReplied(contact.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                              contact.replied 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'
                            }`}
                          >
                            <CheckSquare size={13} />
                            <span>{contact.replied ? 'Terbalas' : 'Tandai Terbalas'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Main original client message */}
                      <div className="space-y-1.5 bg-slate-950/80 p-4 rounded-xl border border-slate-900">
                        <div className="text-xs text-slate-500 font-mono">Pesan Terkirim:</div>
                        <p className="text-xs text-slate-400 font-semibold mb-1">Subjek: {contact.subject}</p>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                      </div>

                      {/* AI generated reply draft box */}
                      {contact.responseDraft && (
                        <div className="space-y-2 bg-gradient-to-r from-indigo-950/30 via-slate-950 to-indigo-950/20 p-4 rounded-xl border border-indigo-500/15">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1.5">
                              <Sparkles size={12} className="animate-pulse" />
                              Draf Respons Email AI (Bertenaga Gemini)
                            </span>
                            <button
                              id={`admin-copy-draft-${contact.id}`}
                              onClick={() => handleCopyDraft(contact.id, contact.responseDraft || '')}
                              className="px-2.5 py-1 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 border border-slate-850 transition-colors"
                            >
                              {copiedId === contact.id ? (
                                <>
                                  <Check size={11} className="text-emerald-400" />
                                  <span className="text-emerald-400">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>Salin Draf</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950/70 p-3.5 rounded-lg border border-slate-900/50">
                            {contact.responseDraft}
                          </div>
                          <p className="text-[10px] text-slate-500 italic text-right">
                            * Salin draf di atas untuk dikirimkan melalui layanan email eksternal Anda.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PROFILE SETTINGS */}
          {activeSubTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                <User size={20} className="text-indigo-400" />
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Kelola Informasi Profil Portofolio</h3>
                  <p className="text-slate-400 text-xs">Ubah nama, bio, dan detail kontak Anda yang ditampilkan secara dinamis di seluruh website.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                {profileSuccessMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2 text-xs">
                    <CheckSquare size={16} />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Judul Profesional */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Judul Profesional</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* URL Avatar */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Foto Profil / Avatar</label>
                      {isUploadingAvatar && <span className="text-[10px] text-indigo-400 animate-pulse font-mono">MENGUNGGAH...</span>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={profileForm.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop'}
                          alt="Avatar Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 w-full flex gap-2">
                        <input
                          type="text"
                          placeholder="https://... atau unggah berkas"
                          value={profileForm.avatarUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                          required
                        />
                        <label className="flex items-center gap-1.5 px-4 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm cursor-pointer select-none transition-all">
                          <Upload size={16} />
                          <span className="hidden sm:inline">Pilih Berkas</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageUpload(e.target.files[0], 'avatar');
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {avatarUploadError && (
                      <div className="text-xs text-rose-500 font-mono mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        <span>{avatarUploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Deskripsi Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Alamat Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* GitHub URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-400 font-bold uppercase">URL GitHub</label>
                    <input
                      type="url"
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-400 font-bold uppercase">URL LinkedIn</label>
                    <input
                      type="url"
                      value={profileForm.linkedinUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* Pengaturan Teks Beranda & Kontak */}
                  <div className="space-y-4 md:col-span-2 pt-6 border-t border-slate-800">
                    <h4 className="font-display font-bold text-white text-md">Pengaturan Teks Global (Beranda & Kontak)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Judul Utama Beranda</label>
                        <input
                          type="text"
                          value={profileForm.heroTitle}
                          onChange={(e) => setProfileForm({ ...profileForm, heroTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Sub-Judul Beranda</label>
                        <input
                          type="text"
                          value={profileForm.heroSubtitle}
                          onChange={(e) => setProfileForm({ ...profileForm, heroSubtitle: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Judul Kontak</label>
                        <input
                          type="text"
                          value={profileForm.contactTitle}
                          onChange={(e) => setProfileForm({ ...profileForm, contactTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-400 font-bold uppercase">Deskripsi Kontak</label>
                        <textarea
                          value={profileForm.contactSubtitle}
                          onChange={(e) => setProfileForm({ ...profileForm, contactSubtitle: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl text-sm focus:outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800/80">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer"
                  >
                    {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* 4. SKILLS MANAGEMENT */}
          {activeSubTab === 'skills' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <AdminSkills />
            </motion.div>
          )}

          {/* 5. PROJECTS MANAGEMENT */}
          {activeSubTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <AdminProjects />
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
