#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const BASE_URL = 'https://woody-portfolio.pages.dev';
const API_KEY = 'Woody80402';
const CHROME = 'C:/Users/user/AppData/Local/Google/Chrome/Application/chrome.exe';
const SCREENSHOTS_DIR = 'C:/Users/user/Desktop/文件/screenshots';

const projects = [
  { id: 'vtuber-dashboard', url: 'https://vtuber-dashboard.pages.dev/' },
  { id: 'woodypdf', url: 'https://pdf-8wg.pages.dev/' },
  { id: 'save-food', url: 'https://save-food.pages.dev/' },
  { id: 'yuanshanchurch', url: 'https://yuanshanchurch.pages.dev/' },
  { id: 'sfstation', url: 'https://sfstation.pages.dev/' },
  { id: 'numhive', url: 'https://numhive.pages.dev/' },
  { id: 'woody1010', url: 'https://woody1010.pages.dev/' },
  { id: 'line-crm', url: 'https://linebot-5w2.pages.dev/' },
  { id: 'photo-ai', url: 'https://photo-48m.pages.dev/' },
  { id: 'aicard', url: 'https://aicard-b4x.pages.dev/' },
  { id: 'woody-currency', url: 'https://woody-calculator.pages.dev/' },
];

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function uploadScreenshot(filePath) {
  const fileBuf = fs.readFileSync(filePath);
  const blob = new Blob([fileBuf], { type: 'image/png' });
  const file = new File([blob], path.basename(filePath), { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('file', file);
  
  const resp = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY },
    body: formData
  });
  
  if (resp.ok) {
    const data = await resp.json();
    return `${BASE_URL}${data.url}`;
  } else {
    const err = await resp.text();
    console.error(`    上傳失敗: ${resp.status}`);
    return null;
  }
}

async function getProjectList() {
  const resp = await fetch(`${BASE_URL}/api/projects`);
  return await resp.json();
}

async function updateProjectImage(projectId, imageUrl) {
  const getResp = await fetch(`${BASE_URL}/api/projects/${projectId}`);
  const project = await getResp.json();
  
  const resp = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
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
  return resp.ok;
}

async function main() {
  const projectList = await getProjectList();
  console.log(`📦 ${projectList.length} 個專案\n`);
  
  for (const proj of projects) {
    const descFile = path.join(SCREENSHOTS_DIR, `${proj.id}-desktop.png`);
    
    console.log(`📸 ${proj.id} (${proj.url})`);
    
    // Desktop screenshot
    try {
      execSync(`"${CHROME}" --headless --screenshot="${descFile}" --window-size=1280,800 "${proj.url}"`, {
        timeout: 30000, stdio: 'pipe'
      });
      const size = fs.existsSync(descFile) ? fs.statSync(descFile).size : 0;
      console.log(`   桌面截圖: ${(size/1024).toFixed(1)}KB`);
    } catch (e) {
      console.log(`   桌面截圖失敗`);
      continue;
    }
    
    // Upload
    if (fs.existsSync(descFile) && fs.statSync(descFile).size > 1000) {
      const imageUrl = await uploadScreenshot(descFile);
      if (imageUrl) {
        const ok = await updateProjectImage(proj.id, imageUrl);
        console.log(`   ${ok ? '✅' : '❌'} 已更新: ${imageUrl}`);
      }
    } else {
      console.log(`   ⚠️ 截圖太短或不存在`);
    }
    console.log('');
  }
  
  console.log('🎉 完成！');
}

main().catch(console.error);
