
// ===== 前端型別（單一事實來源）=====

export interface ProjectMedia {
  url: string;
  type: 'image' | 'video';
  frame: 'none' | 'phone' | 'desktop';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  tags: string[];
  link: string;
  media?: ProjectMedia[];
  type?: string;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SiteConfig {
  hero_title?: string;
  hero_intro?: string;
  stat_vm?: string;
  stat_defense?: string;
  stat_uptime?: string;
  resume_name?: string;
  resume_title?: string;
  resume_email?: string;
  resume_location?: string;
  resume_github?: string;
  resume_linkedin?: string;
  [key: string]: string | undefined;
}
