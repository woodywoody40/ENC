import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

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
  type?: string; // 3D 模型類型
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

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: '151 台虛擬伺服器核心運維叢集',
    description: '基於 VMware vSphere 架構，管理全縣教育體系之核心 Linux 叢集。',
    details: '此專案為教網中心的核心心臟。在 Ubuntu 24.04 環境下，透過標準化模板與自動化腳本，管理超過 150 台虛擬主機。核心挑戰在於處理 Radius 認證的併發峰值與 VDS 網路隔離。',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
    tags: ['Ubuntu 24.04', 'vSphere', 'Automation'],
    link: '#',
    media: []
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'u24-netplan-master',
    title: 'Ubuntu 24.04 網路配置聖經：Netplan 狀態管理與除錯',
    excerpt: 'Ubuntu 24.04 引入了全新的 netplan status 指令，讓網管不再需要盲目修改 YAML。本文分享 150+ VM 環境下的配置實戰。',
    content: '...',
    date: '2025-03-10',
    category: '系統運維',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200'
  }
];

export const SOCIAL_LINKS = [
  { icon: <Github size={20} />, href: '#', label: 'GitHub' },
  { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
  { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
  { icon: <Mail size={20} />, href: '#', label: 'Email' },
];