export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  heroTitle?: string;
  heroSubtitle?: string;
  contactTitle?: string;
  contactSubtitle?: string;
}

export interface BlogPost {
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentiment?: string; // e.g. "Positive", "Neutral", "Inquiry", "Urgent"
  responseDraft?: string; // AI generated reply draft
  replied?: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  link?: string;
  github?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'design' | 'tools';
  iconName: string;
}
