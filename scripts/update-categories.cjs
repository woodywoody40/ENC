#!/usr/bin/env node
const BASE_URL = 'https://woody-portfolio.pages.dev';
const API_KEY = 'Woody80402';

const updates = [
  { id: '550adbf7-72fb-4942-99f7-18aeea3a727e', category: '🤖 AI 開發者工具' },
  { id: 'bc1957f1-8f4e-49b3-a8ef-f3bbb3b2a789', category: '🤖 AI 開發者工具' },
  { id: '91959e25-076b-4ab1-9ac9-d9d90e595c25', category: '🛠️ 開發者工具' },
  { id: 'a334f03c-aaef-41aa-b969-47bc6531455e', category: '🛠️ 開發者工具' },
  { id: '73f603f6-da9c-4a0f-b741-fdc0e4f33d4b', category: '📖 開源專案深度' },
  { id: 'ca8a50cf-34ff-4c2f-9812-9dcd385b96fb', category: '🤖 AI 開發者工具' },
  { id: 'b1157697-aa52-42df-b8b0-02716a7c1760', category: '📖 開源專案深度' },
  { id: 'u24-netplan-master', category: '⚙️ 系統維運' },
];

async function main() {
  for (const { id, category } of updates) {
    // GET current post data first
    const getResp = await fetch(`${BASE_URL}/api/blog/${id}`);
    const post = await getResp.json();
    
    // PUT with updated category, keeping all other fields
    const resp = await fetch(`${BASE_URL}/api/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        date: post.date || '',
        category: category,
        image: post.image || ''
      })
    });
    
    if (resp.ok) {
      const updated = await resp.json();
      console.log(`✅ ${post.title?.slice(0, 30)}... → ${updated.category}`);
    } else {
      const err = await resp.text();
      console.log(`❌ ${post.title?.slice(0, 30)}... → HTTP ${resp.status}: ${err}`);
    }
  }
}

main().catch(console.error);
