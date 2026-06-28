#!/usr/bin/env node

/**
 * Hermes Agent 自動化發文腳本 (CLI)
 * 
 * 使用方式：
 *   export CF_ACCESS_CLIENT_ID="你的_Client_Id"
 *   export CF_ACCESS_CLIENT_SECRET="你的_Client_Secret"
 *   export BLOG_BASE_URL="https://xn--hrrs16bo6z.com"
 * 
 * 傳入 JSON 發文：
 *   node scripts/publish-post.js < post.json
 * 
 * 或以 Pipeline 傳入：
 *   echo '{"title": "AI 自動發文測試", "content": "這是內容", "excerpt": "簡介"}' | node scripts/publish-post.js
 */

const fs = require('fs');

const CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID;
const CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET;
const BASE_URL = process.env.BLOG_BASE_URL || 'https://xn--hrrs16bo6z.com';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ 錯誤: 請在環境變數中設定 CF_ACCESS_CLIENT_ID 與 CF_ACCESS_CLIENT_SECRET！');
  process.exit(1);
}

let inputData = '';

async function publish() {
  try {
    if (process.stdin.isTTY) {
      console.error('❌ 錯誤: 請以標準輸入 (stdin) 傳入發文內容的 JSON 資料。');
      console.error('範例: echo \'{"title": "標題", "content": "內文"}\' | node scripts/publish-post.js');
      process.exit(1);
    }
    
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const payload = JSON.parse(inputData);
    if (!payload.title) {
      console.error('❌ 錯誤: title 欄位為必填！');
      process.exit(1);
    }

    console.log(`🚀 正在發送文章: "${payload.title}" 至 ${BASE_URL}...`);

    const API_KEY = process.env.API_KEY || '';

    const response = await fetch(`${BASE_URL}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': CLIENT_ID,
        'CF-Access-Client-Secret': CLIENT_SECRET,
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {})
      },
      body: JSON.stringify({
        title: payload.title,
        excerpt: payload.excerpt || '',
        content: payload.content || '',
        category: payload.category || 'AI 自動生成',
        image: payload.image || '',
        date: payload.date || new Date().toISOString().split('T')[0]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    console.log('\n🎉 發文成功！');
    console.log('文章資訊:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ 發文失敗:', error.message);
    process.exit(1);
  }
}

publish();
