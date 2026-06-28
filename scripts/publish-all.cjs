#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = 'C:/Users/user/Desktop/文件';
const SCRIPT = 'C:/Users/user/Desktop/vibe coding/ENC-main/ENC-main/scripts/publish-post.cjs';

const files = [
  'github-trending-1-stirling-pdf.md',
  'github-trending-2-deer-flow.md',
  'github-trending-3-worldmonitor.md'
];

for (const file of files) {
  const filePath = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    console.error(`❌ ${file}: 無法解析 frontmatter`);
    continue;
  }
  
  const fmLines = match[1].split('\n');
  const fm = {};
  for (const line of fmLines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    // Remove surrounding quotes if any
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fm[k] = v;
  }
  
  const body = match[2].trim();
  
  const payload = JSON.stringify({
    title: fm.title,
    excerpt: fm.description || '',
    content: body,
    category: '開源專案深度剖析',
    image: '',
    date: fm.date || new Date().toISOString().split('T')[0]
  });
  
  // Write temp JSON
  const tmpFile = path.join(ARTICLES_DIR, `_payload-${file.replace('.md', '.json')}`);
  fs.writeFileSync(tmpFile, payload, 'utf8');
  
  console.log(`\n📄 準備發文: ${fm.title}`);
  console.log(`   ➜ 暫存: ${tmpFile}`);
}

console.log('\n✅ 所有 payload 已準備完成！');
