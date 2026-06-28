#!/usr/bin/env node
const BASE_URL = 'https://woody-portfolio.pages.dev';
const API_KEY = 'Woody80402';

// 先 GET 所有 projects 取得現有資料
async function getProjects() {
  const resp = await fetch(`${BASE_URL}/api/projects`);
  return await resp.json();
}

const imageMap = {
  // === 有 GitHub OG 圖的 ===
  'vtuber-dashboard': 'https://vtuber-dashboard.pages.dev/og-image.png',
  'woodypdf': 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=1200&h=630&fit=crop',     // PDF 文件
  'save-food': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=630&fit=crop',       // 生鮮食物
  'yuanshanchurch': 'https://opengraph.githubassets.com/c55b14dd5fb13e1440cb2ca4c5feebbfeea02face1c8e6e2e44410ec9f6795d7/woodywoody40/yuanshan',
  'sfstation': 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=1200&h=630&fit=crop',     // 禮物/禮品
  'numhive': 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=1200&h=630&fit=crop',       // 拼圖/遊戲
  'woody1010': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop',       // 方塊遊戲
  'line-crm': 'https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&h=630&fit=crop',        // 通訊/CRM
  'photo-ai': 'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=1200&h=630&fit=crop',        // 影像編輯
  'aicard': 'https://opengraph.githubassets.com/29578bd7b091c61db1f8efda793d7b6812b52dfeae489e4424c7065e2800f960/woodywoody40/aibusinesscard',
  'woody-currency': 'https://opengraph.githubassets.com/d88f1b1a8d3786a2a5e8b07cc5949421c34e403837fa3dddf24f459c3cce88bc/woodywoody40/calculator',
  'echodiary': 'https://opengraph.githubassets.com/4f47c23914f4d61c56a50177a1dbdc8fb18700250c9c5994a84e83084fc350a2/woodywoody40/EchoDiary-AI-Voice-Journal',
  'stocksee': 'https://opengraph.githubassets.com/b783ad8138f2ea8ff06001006f5a108868dfd1703dfa74a3f6c8d2cc319b91ea/woodywoody40/stocksee',
  'kvideo': 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
  '151-vm-cluster': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop'    // 伺服器
};

async function main() {
  const projects = await getProjects();
  console.log(`📦 找到 ${projects.length} 個專案\n`);
  
  let updated = 0;
  for (const project of projects) {
    // 用 project id 或 title 來比對
    let matchedId = null;
    for (const [key] of Object.entries(imageMap)) {
      if (project.id === key || project.title.toLowerCase().includes(key.replace(/-/g, ' ')) || key.includes(project.id)) {
        matchedId = key;
        break;
      }
    }
    
    // 手動比對
    const title = project.title;
    let imageUrl = null;
    
    if (title.includes('VTuber') || title.includes('數據觀測')) imageUrl = imageMap['vtuber-dashboard'];
    else if (title.includes('WoodyPDF') || title.includes('PDF')) imageUrl = imageMap['woodypdf'];
    else if (title.includes('此食') || title.includes('即期品')) imageUrl = imageMap['save-food'];
    else if (title.includes('圓山') || title.includes('教會')) imageUrl = imageMap['yuanshanchurch'];
    else if (title.includes('十分幸福') || title.includes('SF Station')) imageUrl = imageMap['sfstation'];
    else if (title.includes('NumHive') || title.includes('數巢')) imageUrl = imageMap['numhive'];
    else if (title.includes('1010') || title.includes('方塊')) imageUrl = imageMap['woody1010'];
    else if (title.includes('LINE CRM')) imageUrl = imageMap['line-crm'];
    else if (title.includes('影像魔術') || title.includes('Gemini AI')) imageUrl = imageMap['photo-ai'];
    else if (title.includes('名片') || title.includes('Ai名片')) imageUrl = imageMap['aicard'];
    else if (title.includes('匯率') || title.includes('Woody匯')) imageUrl = imageMap['woody-currency'];
    else if (title.includes('EchoDiary') || title.includes('語音日記')) imageUrl = imageMap['echodiary'];
    else if (title.includes('股見') || title.includes('股市')) imageUrl = imageMap['stocksee'];
    else if (title.includes('KVideo') || title.includes('液態玻璃')) imageUrl = imageMap['kvideo'];
    else if (title.includes('151') || title.includes('虛擬伺服器')) imageUrl = imageMap['151-vm-cluster'];
    
    if (!imageUrl) {
      console.log(`⏭️  ${title.slice(0, 25)}... → 找不到對應圖片`);
      continue;
    }
    
    // 如果圖已經對了就跳過
    if (project.image === imageUrl) {
      console.log(`✅  ${title.slice(0, 25)}... → 圖片已是正確的`);
      continue;
    }
    
    // PUT 更新圖片
    const resp = await fetch(`${BASE_URL}/api/projects/${project.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        details: project.details,
        image: imageUrl,
        tags: project.tags,
        link: project.link,
        media: project.media,
        type: project.type
      })
    });
    
    if (resp.ok) {
      console.log(`🖼️  ${title.slice(0, 25)}... → ✅ 圖片已更新`);
      updated++;
    } else {
      const err = await resp.text();
      console.log(`❌  ${title.slice(0, 25)}... → ${resp.status}: ${err.slice(0, 60)}`);
    }
  }
  
  console.log(`\n🎉 完成！更新了 ${updated} 個專案的圖片`);
}

main().catch(console.error);
