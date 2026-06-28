#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = 'C:/Users/user/Desktop/文件';
const SCRIPT = 'C:/Users/user/Desktop/vibe coding/ENC-main/ENC-main/scripts/publish-post.cjs';
const API_KEY = 'Woody80402';
const BASE_URL = 'https://woody-portfolio.pages.dev';

const articles = [
  {
    file: 'github-trending-1-stirling-pdf.md',
    image: 'https://repository-images.githubusercontent.com/594155488/e847631d-8898-4616-b558-8a9dde7f743a',
    id: 'ff82b2a0-07c1-4d3c-a6a6-f0e7e9a0b456'
  },
  {
    file: 'github-trending-2-deer-flow.md',
    image: 'https://opengraph.githubassets.com/aa01a4c274a2e372b2bc63e61b7a7bcb5e202e9ff947e97f9bf25dff2995209c/bytedance/deer-flow',
    id: 'a95d7a98-3b96-4c0d-930e-ac37b53db8bd'
  },
  {
    file: 'github-trending-3-worldmonitor.md',
    image: 'https://repository-images.githubusercontent.com/1130564872/59ff0927-deb4-4941-8cbc-b68cbe060417',
    id: '2505e262-478f-4620-8022-5727e93e6175'
  }
];

async function main() {
  for (const article of articles) {
    const filePath = path.join(ARTICLES_DIR, article.file);
    const raw = fs.readFileSync(filePath, 'utf8');
    
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) { console.error(`❌ ${article.file}: 無法解析 frontmatter`); continue; }
    
    const fmLines = match[1].split('\n');
    const fm = {};
    for (const line of fmLines) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const k = line.slice(0, idx).trim();
      let v = line.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      fm[k] = v;
    }
    
    const body = match[2].trim();
    
    const payload = {
      title: fm.title,
      excerpt: fm.description || '',
      content: body,
      category: '開源專案深度剖析',
      image: article.image,
      date: fm.date || '2026-06-27'
    };
    
    // DELETE corrupted post
    console.log(`\n🗑️ 刪除 ${article.file}...`);
    const delResp = await fetch(`${BASE_URL}/api/blog/${article.id}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': API_KEY }
    });
    console.log(`   刪除 ${delResp.status}`);
    
    // POST with image
    console.log(`📤 重新發佈 ${fm.title.slice(0, 30)}...`);
    const postResp = await fetch(`${BASE_URL}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(payload)
    });
    
    if (postResp.ok) {
      const data = await postResp.json();
      console.log(`   ✅ 成功！ID: ${data.id}`);
      console.log(`   🖼️  image: ${data.image ? '✅' : '❌'}`);
    } else {
      const err = await postResp.text();
      console.log(`   ❌ ${postResp.status}: ${err}`);
    }
  }
}

main().catch(console.error);
