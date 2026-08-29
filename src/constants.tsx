import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import type { Project, BlogPost } from './types';

export const SITE_URL = 'https://xn--hrrs16bo6z.com';

export const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4';

export const CAP_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4';

export const PROJECTS: Project[] = [];

export const BLOG_POSTS: BlogPost[] = [];

export const SOCIAL_LINKS = [
  { icon: <Github size={20} />, href: 'https://github.com/woodywoody40', label: 'GitHub' },
  { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/woodywu', label: 'LinkedIn' },
  { icon: <Twitter size={20} />, href: 'https://x.com/woodywu', label: 'Twitter' },
  { icon: <Mail size={20} />, href: 'mailto:hello@xn--hrrs16bo6z.com', label: 'Email' },
];
