import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Mail, Github, Compass, Linkedin } from 'lucide-react';
import { UserProfile } from '../types';

interface ContactHubProps {
  profile: UserProfile;
}

export default function ContactHub({ profile }: ContactHubProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Harap isi Nama, Email, dan Pesan Anda.');
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan sistem.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Gagal mengirim pesan. Silakan coba lagi.');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <Mail size={12} />
            <span>Hubungi Saya</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {profile.contactTitle || 'Mari Berkolaborasi!'}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            {profile.contactSubtitle || 'Kirimkan pesan Anda secara langsung. Setiap pesan akan tersimpan aman dan saya akan segera meresponsnya secepat mungkin.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Side Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="font-display font-bold text-white text-lg sm:text-xl">
                Mengapa Memilih Saya?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Saya mengedepankan komunikasi transparan, kualitas kode semantik yang terstruktur, dan performa web optimal.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white text-sm">Respon Cepat</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Saya selalu berusaha memberikan balasan yang solutif dalam waktu kurang dari 24 jam.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white text-sm">Mandiri & Bebas Server Cloud Luar</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Semua data disimpan di backend Express lokal kami secara terisolasi.</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="border-t border-slate-900 pt-6">
                <span className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Tautan Sosial & Kontak</span>
                <div className="flex gap-3 font-mono">
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all" title="GitHub">
                      <Github size={18} />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all" title="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all" title="Email">
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8">
              
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-white text-xl">Pesan Terkirim!</h3>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto">
                        Terima kasih telah menghubungi saya. Pesan Anda tersimpan dengan aman di database portofolio kami.
                      </p>
                    </div>
                    <p className="text-xs text-indigo-400 font-mono">
                      ✨ Pesan Anda telah masuk ke sistem saya. Saya akan segera menghubungi Anda kembali!
                    </p>
                    <button
                      id="contact-reset-btn"
                      onClick={() => setStatus('idle')}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form-card"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-semibold text-slate-400">Nama Lengkap *</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          placeholder="Akhza Fachrozy"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold text-slate-400">Alamat Email *</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          placeholder="nama@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-xs font-semibold text-slate-400">Subjek (Opsional)</label>
                      <input
                        id="contact-subject"
                        type="text"
                        name="subject"
                        placeholder="Penawaran Kerja / Diskusi Kolaborasi"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-semibold text-slate-400">Pesan Anda *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        placeholder="Tulis pesan lengkap Anda di sini..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:from-indigo-800 disabled:to-sky-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300"
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Menganalisis & Mengirim...
                        </span>
                      ) : (
                        <>
                          <span>Kirim Pesan Instan</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
