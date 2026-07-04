import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { SKILLS, PROJECTS } from "./src/data";
import { Skill, Project } from "./src/types";

const app = express();
const PORT = 3000;

// Increase limit to allow base64 image uploads
app.use(express.json({ limit: "20mb" }));

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// AI features removed (100% bebas api key publik)

const DB_FILE = path.join(process.cwd(), "db.json");

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage: string;
  author: string;
  date: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentiment?: string;
  responseDraft?: string;
  replied?: boolean;
  createdAt: string;
}

interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
}

interface DBStructure {
  blogs: BlogPost[];
  contacts: ContactMessage[];
  profile?: UserProfile;
  skills: Skill[];
  projects: Project[];
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Akhza Fachrozy",
  title: "Senior Fullstack Developer & Creative Architect",
  bio: "Saya mendesain dan mengembangkan ekosistem web yang interaktif dengan micro-interactions responsif.",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
  githubUrl: "https://github.com/akhza",
  linkedinUrl: "https://linkedin.com/in/akhza",
  email: "akhza.04@gmail.com",
  heroTitle: "Membangun Karya Digital",
  heroSubtitle: "Melalui Arsitektur Semantik & Animasi Mikro Presisi.",
  contactTitle: "Mari Berkolaborasi!",
  contactSubtitle: "Kirimkan pesan Anda secara langsung. Setiap pesan akan tersimpan aman dan saya akan segera meresponsnya secepat mungkin."
};

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Seni Tipografi Swiss dalam UI Modern",
    summary: "Bagaimana prinsip keteraturan, kesederhanaan, dan grid dari tipografi Swiss membentuk antarmuka digital terbaik hari ini.",
    content: `## Mengapa Tipografi Swiss Begitu Relevan?

Desain Swiss, atau dikenal sebagai **International Typographic Style**, lahir pada tahun 1950-an. Namun prinsip utamanya—keterbacaan yang tinggi, objektivitas, dan keteraturan struktural—tetap menjadi landasan bagi perancang antarmuka (UI) modern.

### Karakteristik Utama Desain Swiss:
1. **Asymmetric Layouts**: Menolak tata letak simetris kaku demi komposisi dinamis yang dipandu oleh konten.
2. **The Grid System**: Setiap elemen diletakkan dengan perhitungan matematis yang harmonis.
3. **Sans-Serif Typography**: Penggunaan font seperti *Helvetica* atau *Inter* untuk menyampaikan pesan sejelas mungkin tanpa ornamen berlebih.

> "Desain bukan hanya penampilan, melainkan bagaimana sesuatu bekerja." — Steve Jobs

Dalam dunia di mana rentang perhatian pengguna semakin pendek, kesederhanaan Swiss membantu mengurangi kognitif load, membuat konten menjadi bintang utama dari antarmuka Anda.`,
    tags: ["Desain", "Tipografi", "Prinsip UI"],
    coverImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop",
    author: "Akhza Fachrozy",
    date: "2026-07-01",
    createdAt: new Date("2026-07-01T08:00:00Z").toISOString()
  },
  {
    id: "blog-2",
    title: "Menguasai Animasi Mikro di React",
    summary: "Memanfaatkan motion dan transisi halus untuk memandu navigasi pengguna tanpa mengurangi performa aplikasi web.",
    content: `## Mengapa Animasi Mikro Itu Penting?

Animasi mikro (*micro-interactions*) adalah transisi kecil yang memandu perhatian pengguna, memberikan feedback visual langsung, dan membuat aplikasi terasa hidup. 

### Kapan Harus Menggunakan Animasi?
- **Feedback Masukan**: Tombol yang memantul sedikit saat ditekan.
- **Transisi Halaman**: Transisi fade atau slide lembut untuk menghindari perpindahan kaku.
- **Penunjuk Arah**: Menu drop-down yang meluncur halus mengindikasikan asal elemen tersebut.

### Menggunakan Framer Motion (Motion) secara Efektif

Dengan library seperti \`motion\`, kita dapat membuat animasi yang dinamis dengan kode minimal:

\`\`\`tsx
import { motion } from "motion/react";

export function BounceButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      Klik Saya
    </motion.button>
  );
}
\`\`\`

Hindari animasi berlebihan. Animasi terbaik adalah animasi yang tidak disadari secara sadar oleh pengguna, namun membuat pengalaman navigasi terasa sangat menyenangkan dan mulus.`,
    tags: ["React", "Animasi", "Framer Motion"],
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    author: "Akhza Fachrozy",
    date: "2026-07-03",
    createdAt: new Date("2026-07-03T10:00:00Z").toISOString()
  }
];

function readDb(): DBStructure {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DBStructure = { blogs: INITIAL_BLOGS, contacts: [], profile: DEFAULT_PROFILE, skills: SKILLS, projects: PROJECTS };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const db: DBStructure = JSON.parse(data);
    if (!db.profile) {
      db.profile = DEFAULT_PROFILE;
    }
    if (!db.skills) db.skills = SKILLS;
    if (!db.projects) db.projects = PROJECTS;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    return db;
  } catch (err) {
    console.error("Error reading database file:", err);
    return { blogs: INITIAL_BLOGS, contacts: [], profile: DEFAULT_PROFILE };
  }
}

function writeDb(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Ensure database is initialized
readDb();

// --- API ROUTES ---

// Upload endpoint
app.post("/api/upload", (req, res) => {
  const { name, type, data } = req.body;
  if (!name || !data) {
    return res.status(400).json({ error: "Nama berkas dan data gambar wajib diisi" });
  }

  try {
    // Clean base64 header if present
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    // Generate unique name
    const fileExt = path.extname(name) || (type === "image/png" ? ".png" : ".jpg");
    const uniqueName = `upload-${Date.now()}${fileExt}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);
    
    fs.writeFileSync(filePath, buffer);
    
    res.json({ 
      url: `/uploads/${uniqueName}` 
    });
  } catch (error: any) {
    console.error("Gagal mengunggah berkas:", error);
    res.status(500).json({ error: "Gagal menyimpan berkas gambar: " + error.message });
  }
});

// 0. Get user profile
app.get("/api/profile", (req, res) => {
  const db = readDb();
  res.json(db.profile || DEFAULT_PROFILE);
});

// 0.1 Update user profile
app.put("/api/profile", (req, res) => {
  const { name, title, bio, avatarUrl, githubUrl, linkedinUrl, email, heroTitle, heroSubtitle, contactTitle, contactSubtitle } = req.body;
  const db = readDb();
  db.profile = {
    ...db.profile,
    name: name || db.profile?.name || DEFAULT_PROFILE.name,
    title: title || db.profile?.title || DEFAULT_PROFILE.title,
    bio: bio || db.profile?.bio || DEFAULT_PROFILE.bio,
    avatarUrl: avatarUrl || db.profile?.avatarUrl || DEFAULT_PROFILE.avatarUrl,
    githubUrl: githubUrl || db.profile?.githubUrl || DEFAULT_PROFILE.githubUrl,
    linkedinUrl: linkedinUrl || db.profile?.linkedinUrl || DEFAULT_PROFILE.linkedinUrl,
    email: email || db.profile?.email || DEFAULT_PROFILE.email,
    heroTitle: heroTitle !== undefined ? heroTitle : db.profile?.heroTitle,
    heroSubtitle: heroSubtitle !== undefined ? heroSubtitle : db.profile?.heroSubtitle,
    contactTitle: contactTitle !== undefined ? contactTitle : db.profile?.contactTitle,
    contactSubtitle: contactSubtitle !== undefined ? contactSubtitle : db.profile?.contactSubtitle,
  };
  writeDb(db);
  res.json(db.profile);
});

// 1. Get all blogs
app.get("/api/blogs", (req, res) => {
  const db = readDb();
  // Sort by date descending
  const sortedBlogs = [...db.blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sortedBlogs);
});

// 2. Create new blog
app.post("/api/blogs", (req, res) => {
  const { title, summary, content, tags, coverImage, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const db = readDb();
  const newBlog: BlogPost = {
    id: "blog-" + Date.now(),
    title,
    summary: summary || title.substring(0, 150) + "...",
    content,
    tags: Array.isArray(tags) ? tags : ["General"],
    coverImage: coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
    author: author || "Akhza Fachrozy",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  };

  db.blogs.push(newBlog);
  writeDb(db);
  res.status(201).json(newBlog);
});

// 3. Edit blog
app.put("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const { title, summary, content, tags, coverImage, author } = req.body;

  const db = readDb();
  const index = db.blogs.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Blog not found" });
  }

  db.blogs[index] = {
    ...db.blogs[index],
    title: title || db.blogs[index].title,
    summary: summary !== undefined ? summary : db.blogs[index].summary,
    content: content || db.blogs[index].content,
    tags: Array.isArray(tags) ? tags : db.blogs[index].tags,
    coverImage: coverImage || db.blogs[index].coverImage,
    author: author || db.blogs[index].author,
  };

  writeDb(db);
  res.json(db.blogs[index]);
});

// 4. Delete blog
app.delete("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.blogs.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Blog not found" });
  }

  db.blogs.splice(index, 1);
  writeDb(db);
  res.json({ message: "Blog deleted successfully" });
});

// 5. Generate blog draft endpoint removed (100% bebas api key publik)

// 6. Get all contact messages (Admin Dashboard)
app.get("/api/contacts", (req, res) => {
  const db = readDb();
  // Sort by date descending
  const sortedContacts = [...db.contacts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sortedContacts);
});

// 7. Post contact form (Public Portfolio page)
app.post("/api/contacts", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const db = readDb();
  const newMessage: ContactMessage = {
    id: "contact-" + Date.now(),
    name,
    email,
    subject: subject || "No Subject",
    message,
    sentiment: "Neutral",
    responseDraft: "Halo " + name + ",\n\nTerima kasih telah menghubungi saya. Saya akan segera merespons pesan Anda.\n\nSalam,\nAkhza Fachrozy",
    replied: false,
    createdAt: new Date().toISOString()
  };

  // AI analysis removed

  db.contacts.push(newMessage);
  writeDb(db);
  res.status(201).json({ 
    message: "Contact inquiry received successfully", 
    data: newMessage 
  });
});

// 8. Toggle reply status
app.post("/api/contacts/:id/replied", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.contacts.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Contact message not found" });
  }

  db.contacts[index].replied = !db.contacts[index].replied;
  writeDb(db);
  res.json(db.contacts[index]);
});

// --- SKILLS API ---
app.get("/api/skills", (req, res) => {
  const db = readDb();
  res.json(db.skills || []);
});

app.post("/api/skills", (req, res) => {
  const db = readDb();
  db.skills.push(req.body);
  writeDb(db);
  res.status(201).json(req.body);
});

app.put("/api/skills/:name", (req, res) => {
  const db = readDb();
  const index = db.skills.findIndex(s => s.name === req.params.name);
  if (index !== -1) {
    // Keep original name if modifying others, or update everything
    db.skills[index] = { ...db.skills[index], ...req.body };
    writeDb(db);
    res.json(db.skills[index]);
  } else {
    res.status(404).json({ error: "Skill not found" });
  }
});

app.delete("/api/skills/:name", (req, res) => {
  const db = readDb();
  const index = db.skills.findIndex(s => s.name === req.params.name);
  if (index !== -1) {
    db.skills.splice(index, 1);
    writeDb(db);
    res.json({ message: "Deleted" });
  } else {
    res.status(404).json({ error: "Skill not found" });
  }
});

// --- PROJECTS API ---
app.get("/api/projects", (req, res) => {
  const db = readDb();
  res.json(db.projects || []);
});

app.post("/api/projects", (req, res) => {
  const db = readDb();
  const newProject = { ...req.body, id: req.body.id || 'proj-' + Date.now() };
  db.projects.push(newProject);
  writeDb(db);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", (req, res) => {
  const db = readDb();
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    db.projects[index] = { ...db.projects[index], ...req.body };
    writeDb(db);
    res.json(db.projects[index]);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

app.delete("/api/projects/:id", (req, res) => {
  const db = readDb();
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    db.projects.splice(index, 1);
    writeDb(db);
    res.json({ message: "Deleted" });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
