import { Project, Skill } from './types';

export const SKILLS: Skill[] = [
  { name: 'React / Next.js', level: 95, category: 'frontend', iconName: 'Code' },
  { name: 'TypeScript', level: 90, category: 'frontend', iconName: 'Shield' },
  { name: 'Tailwind CSS', level: 95, category: 'frontend', iconName: 'Palette' },
  { name: 'Node.js / Express', level: 88, category: 'backend', iconName: 'Server' },
  { name: 'PostgreSQL / MariaDB', level: 85, category: 'backend', iconName: 'Database' },
  { name: 'Framer Motion', level: 92, category: 'design', iconName: 'Sparkles' },
  { name: 'Figma UI/UX', level: 80, category: 'design', iconName: 'Compass' },
  { name: 'Git & GitHub', level: 90, category: 'tools', iconName: 'GitBranch' },
  { name: 'Docker', level: 75, category: 'tools', iconName: 'Container' }
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Aesthetic Landing Space',
    description: 'Sebuah website interaktif dengan sistem partikel 3D, tipografi Swiss, dan transisi halaman yang terinspirasi dari fiksi ilmiah.',
    category: 'Web',
    tags: ['React', 'Three.js', 'Framer Motion'],
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    link: 'https://demo.example.com/aesthetic',
    github: 'https://github.com/akhza/aesthetic-space',
    featured: true
  },
  {
    id: 'proj-2',
    title: 'Collaborative Canvas Engine',
    description: 'Papan tulis digital kolaboratif real-time yang mendukung sinkronisasi kursor, pengenalan bentuk cerdas, dan ekspor instan.',
    category: 'System',
    tags: ['TypeScript', 'WebSockets', 'HTML5 Canvas'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    link: 'https://canvas.example.com',
    github: 'https://github.com/akhza/canvas-engine',
    featured: true
  },
  {
    id: 'proj-3',
    title: 'AI Smart Summary Extension',
    description: 'Ekstensi browser bertenaga Gemini AI untuk menyederhanakan artikel akademis yang panjang menjadi poin-poin penting yang mudah dibaca.',
    category: 'AI Tool',
    tags: ['Gemini SDK', 'Chrome Extension', 'Tailwind'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    github: 'https://github.com/akhza/ai-summary-ext',
    featured: false
  }
];
