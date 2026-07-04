import React, { useState, useEffect } from 'react';
import { Skill } from '../types';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Skill>({ name: '', level: 50, iconName: '', category: 'frontend' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/skills${!isNew ? '/' + formData.name : ''}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsEditing(false);
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Hapus keahlian ini?')) return;
    try {
      const res = await fetch(`/api/skills/${name}`, { method: 'DELETE' });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-display font-bold text-white text-lg">Kelola Daftar Keahlian (Skills)</h3>
          <p className="text-slate-400 text-xs">Atur teknologi dan skill yang akan ditampilkan pada bagian Keahlian.</p>
        </div>
      </div>

      {!isEditing ? (
        <>
          <div className="flex justify-end pt-2">
            <button onClick={() => { setIsEditing(true); setIsNew(true); setFormData({ name: '', level: 50, iconName: '', category: 'frontend' }); }} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Plus size={14} /> Tambah Keahlian Baru
            </button>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-900">
            {skills.map(skill => (
              <div key={skill.name} className="p-4 flex justify-between items-center">
                <div>
                  <h5 className="text-white font-bold">{skill.name}</h5>
                  <p className="text-xs text-slate-400 font-mono mt-1">Kategori: {skill.category} | Level: {skill.level}% | Icon: {skill.iconName || 'Terminal'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFormData(skill); setIsEditing(true); setIsNew(false); }} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(skill.name)} className="p-2 bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-400 rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {skills.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">Belum ada keahlian ditambahkan.</div>}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-white font-bold text-lg mb-2">{isNew ? 'Tambah Keahlian Baru' : 'Edit Keahlian'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Nama Skill</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={!isNew} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500 disabled:opacity-50" />
              {!isNew && <span className="text-[10px] text-slate-500">Nama skill tidak dapat diubah setelah dibuat.</span>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Kategori</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500">
                <option value="frontend">Frontend</option>
                <option value="backend">Backend & DB</option>
                <option value="design">Creative Design</option>
                <option value="tools">DevOps & Tools</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Level Penguasaan (0-100)</label>
              <input required type="number" min="0" max="100" value={formData.level} onChange={e => setFormData({...formData, level: Number(e.target.value)})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 font-bold uppercase">Nama Icon (Lucide)</label>
              <input type="text" placeholder="Code, Server, Database..." value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-indigo-500" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs text-slate-400 font-semibold bg-slate-900 hover:bg-slate-800 rounded-xl">Batal</button>
            <button type="submit" className="px-5 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl">Simpan Keahlian</button>
          </div>
        </form>
      )}
    </div>
  );
}
