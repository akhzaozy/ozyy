import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Project>({ 
    id: '', title: '', description: '', coverImage: '', tags: [], category: 'Web', link: '', github: '' 
  });
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    };
    
    try {
      const res = await fetch(`/api/projects${!isNew ? '/' + payload.id : ''}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus proyek ini?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-display font-bold text-white text-lg">Kelola Daftar Proyek (Portofolio)</h3>
          <p className="text-slate-400 text-xs">Atur karya proyek yang akan ditampilkan pada halaman portofolio.</p>
        </div>
      </div>

      {!isEditing ? (
        <>
          <div className="flex justify-end pt-2">
            <button onClick={() => { setIsEditing(true); setIsNew(true); setFormData({ id: '', title: '', description: '', coverImage: '', tags: [], category: 'Web', link: '', github: '' }); setTagsInput(''); }} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Plus size={14} /> Tambah Proyek Baru
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <div key={project.id} className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-32 bg-slate-900 relative">
                  <img src={project.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop'} alt={project.title} className="w-full h-full object-cover opacity-80" />
                  <span className="absolute top-2 left-2 px-2 py-1 bg-slate-950/80 text-[10px] text-white rounded font-mono">{project.category}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-white font-bold">{project.title}</h5>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-slate-800">
                    <button onClick={() => { setFormData(project); setTagsInput(project.tags.join(', ')); setIsEditing(true); setIsNew(false); }} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-400 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <div className="col-span-2 p-8 text-center text-slate-500 text-sm">Belum ada proyek ditambahkan.</div>}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-white font-bold text-lg mb-2">{isNew ? 'Tambah Proyek Baru' : 'Edit Proyek'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Nama Proyek</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Deskripsi</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500 resize-none" />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Gambar Cover URL</label>
              <input required type="text" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Tags (pisahkan koma)</label>
              <input required type="text" placeholder="React, Node.js" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Kategori</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500">
                <option value="Web">Web</option>
                <option value="System">System</option>
                <option value="AI Tool">AI Tool</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Link Live Demo (opsional)</label>
              <input type="text" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Link Github (opsional)</label>
              <input type="text" value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs text-slate-400 font-semibold bg-slate-900 hover:bg-slate-800 rounded-xl">Batal</button>
            <button type="submit" className="px-5 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl">Simpan Proyek</button>
          </div>
        </form>
      )}
    </div>
  );
}
