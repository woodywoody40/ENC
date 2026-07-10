import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import type { Project, BlogPost } from './types';

export const PROJECTS: Project[] = [];

export const BLOG_POSTS: BlogPost[] = [];

export const SOCIAL_LINKS = [
  { icon: <Github size={20} />, href: 'https://github.com/woodywoody40', label: 'GitHub' },
  { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/woodywu', label: 'LinkedIn' },
  { icon: <Twitter size={20} />, href: 'https://x.com/woodywu', label: 'Twitter' },
  { icon: <Mail size={20} />, href: 'mailto:hello@xn--hrrs16bo6z.com', label: 'Email' },
];
