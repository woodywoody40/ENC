#!/usr/bin/env node
/**
 * 每日 GitHub Trending 部落格發文腳本
 * 
 * 用法: node scripts/daily-trending.cjs
 * 需要環境變數: API_KEY
 */
const fs = require('fs');
const path = require('path');
const BASE_URL = 'https://woody-portfolio.pages.dev';
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('❌ 請設定 API_KEY 環境變數');
  process.exit(1);
}

async function main() {
  // 1️⃣ 從標準輸入讀取 JSON 文章
  let inputData = '';
  for await (const chunk of process.stdin) {
    inputData += chunk;
  }
  
  const articles = JSON.parse(inputData);
  
  if (!Array.isArray(articles) || articles.length === 0) {
    console.error('⚠️ 沒有要發佈的文章');
    process.exit(0);
  }
  
  console.log(`📤 準備發佈 ${articles.length} 篇文章...\n`);
  
  for (const article of articles) {
    console.log(`🚀 發送: "${article.title?.slice(0, 40)}..."`);
    
    const response = await fetch(`${BASE_URL}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category || 'GitHub Trending 深度解析',
        image: article.image || '',
        date: article.date || new Date().toISOString().split('T')[0]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ 成功！ID: ${data.id}`);
    } else {
      const text = await response.text();
      console.log(`   ❌ HTTP ${response.status}: ${text}`);
    }
  }
  
  console.log('\n🎉 全部發佈完成！');
}

main().catch(err => {
  console.error('❌ 錯誤:', err.message);
  process.exit(1);
});
