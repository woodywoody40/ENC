#!/usr/bin/env node
const BASE_URL = 'https://woody-portfolio.pages.dev';
const API_KEY = 'Woody80402';

const projects = [
  {
    id: 'kvideo',
    title: 'KVideo - 液態玻璃設計的影片整合播放平台',
    description: '一個基於 Next.js 16 的現代化影片聚合播放平台。採用獨特的「Liquid Glass」設計語言，整合多源搜尋、HLS 串流、豆瓣評分，提供流暢的觀影體驗。',
    details: `## 為什麼想做這個？

老實說，平常工作之餘最常做的事就是看影片。但每次都要在不同平台之間切來切去——這個平台有這部、那個平台有那部，搜尋也要分開找，真的很麻煩。

當時我在想：如果可以有一個地方，把所有影片源整合在一起，用一套漂亮的介面統一搜尋和播放，那不是很好嗎？

## 設計思路：Liquid Glass

我對 UI 設計一直有很高的標準。市面上的影片平台不是太雜亂就是太老氣，我想要一套**既有科技感又不會太冰冷**的設計語言。

Liquid Glass（液態玻璃）就是從這個想法出發的：

- **玻璃擬態**：利用 backdrop-filter 做出磨砂半透明效果，讓 UI 像真實的玻璃材質
- **光影互動**：hover 和 focus 時的內發光效果，模擬光線被玻璃「捕捉」的感覺
- **流暢動畫**：基於物理的 cubic-bezier 曲線，讓過渡效果像真實物體的加速減速
- **深度層級**：清楚的 z-axis 層次，增強操作的空間感

## 技術架構

選 Next.js 16 不是為了跟風，而是因為它真的適合這種內容型的應用——SSR 做 SEO、API Routes 做後端代理、Server Actions 做表單處理，一套搞定前後端。

最讓我自豪的是**多源並行搜尋**功能：同時對多個影片源發出請求，哪個先回來就先顯示，大幅減少使用者等待時間。背後用 Promise.race 搭配自定義的解析器系統，每個源的資料格式不同，統一轉成標準格式。

播放器方面選了 HLS.js 搭配自定義的 Service Worker 快取策略——會根據觀看歷史在背景預載下一集，離線也能接著看。

## 學到最多的

這個專案讓我對 Next.js 的 Streaming SSR 和 Suspense 邊界有了更深的理解。特別是影片列表頁面的載入體驗——用 streaming 先讓骨架屏出來，內容一塊一塊補上，使用者就不會盯著空白畫面發呆。

## 部署

部署在 Cloudflare Pages，https://kvideo.pages.dev/ 可以直接體驗。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'HLS', 'Cloudflare Pages'],
    link: 'https://github.com/woodywoody40/KVideo',
    media: [],
    type: '前端開發'
  },
  {
    id: 'echodiary',
    title: 'EchoDiary - AI 驅動的智慧語音日記',
    description: '用語音記錄日常，AI 自動分析情緒與行為模式。支援 PWA 離線使用，所有資料本地儲存，隱私無虞。',
    details: `## 為什麼想做這個？

寫日記這個習慣我維持了好幾年，但老實說——打字真的很累。尤其是下班後累得半死的時候，根本不想再碰鍵盤。

那時候 Gemini API 剛出來，我就在想：如果**用說的**代替打字，讓 AI 幫我整理成文字、順便分析一下我今天的心情怎麼樣，會不會讓寫日記這件事變得更輕鬆？

## 設計理念：低摩擦 x 高回饋

EchoDiary 的核心設計原則是**把記錄的摩擦降到最低**：

- 打開 App → 按錄音 → 開始說話 → 結束 → AI 自動整理
- 不用打字、不用分類、不用想格式
- 說就對了，剩下的交給 AI

但單純的語音轉文字不夠——我加了**情緒分析**和**模式識別**。一段時間後，你可以看到自己這週哪幾天心情比較好、什麼事情讓你焦慮、你的睡眠和情緒之間有沒有關聯。

這些洞察是用 Recharts 做的視覺化儀表板呈現的，一目瞭然。

## 技術架構

前端用 React 19 + Vite + TypeScript，AI 引擎接 Google Gemini API（gemini-2.5-flash）。

最關鍵的設計是**PWA 離線支援**——因為日記是很私人的東西，我不希望使用者的資料一定要上雲端才能用。vite-plugin-pwa 讓 EchoDiary 可以安裝到手機桌面，離線也能錄音和查看歷史，資料都存在 IndexedDB 裡。

API Key 也是存在瀏覽器的 LocalStorage，不會經過任何伺服器——使用者的語音和日記內容，從頭到尾都是自己的。

## 特別的挑戰

語音辨識的準確度在安靜環境下沒問題，但在咖啡廳或路上就很容易出錯。後來我加了**錄音前環境檢測**——如果背景噪音太大，App 會提醒使用者換個安靜的地方，或在錄音時自動降噪。

## 未來規劃

原本想加多語系支援和社群分享功能（可選擇性地分享匿名心情統計），但目前先維持純本地、重隱私的路線。`,
    image: 'https://opengraph.githubassets.com/4f47c23914f4d61c56a50177a1dbdc8fb18700250c9c5994a84e83084fc350a2/woodywoody40/EchoDiary-AI-Voice-Journal',
    tags: ['React', 'TypeScript', 'Gemini API', 'PWA', 'Recharts', 'Vite'],
    link: 'https://github.com/woodywoody40/EchoDiary-AI-Voice-Journal',
    media: [],
    type: 'AI 應用'
  },
  {
    id: 'stocksee',
    title: '股見 - 台灣股市即時洞察平台',
    description: '專為台灣股市設計的 Web 應用，即時台股數據搭配 AI 新聞情緒分析，幫你從財經新聞中洞察市場先機。',
    details: `## 為什麼想做這個？

有在玩台股的都知道——每天的財經新聞一大堆，但你真的有時間一篇一篇看嗎？而且看了也不確定這篇新聞對股價是正面還負面影響。

我一開始只是想要一個工具，可以讓我快速知道**今天大盤的狀況**和**我有在關注的股票**。但後來發現光是看價格不夠——價格漲跌的「原因」往往藏在新聞裡。

所以就這樣做出了「股見」——台灣股市洞察平台。

## 核心功能

**即時市場數據**：透過 TWSE 的公開資料取得即時股價、開盤、最高、最低、成交量等資訊。

**自訂關注清單**：把有在追的股票加到清單，一頁看完所有關注重點的狀態。

**AI 新聞分析（這是我最滿意的功能）**：
貼上任何財經新聞的內容，Google Gemini API 會自動生成：
- 重點摘要 — 一分鐘掌握新聞核心
- 情緒分析 — 這篇新聞對股價是正面、負面還是中性？
- 趨勢預測 — 短期可能的股價波動方向

## 技術架構

純前端應用，React + TypeScript + Tailwind CSS。

為什麼不做後端？因為台灣證交所的資料其實都是公開的，透過 CORS proxy 就可以直接從前端取得。AI 分析也是用使用者自己的 Gemini API Key（存在 LocalStorage 不上傳），**不需要任何後端基礎設施**。

部署在任何靜態託管都能跑——Cloudflare Pages、Vercel、Netlify 都行。

## 設計取捨

老實說這個專案還在持續改進中。目前的版本是 stocksee 和 stocksee1 兩個 repo，一個是主要開發線，一個是實驗性的重寫版本。

我一直在想是否要加後端來做使用者帳號和跨裝置同步，但目前覺得「純前端 + 自己的 API Key」這個模式對開發者來說最友善——clone 下來就能跑，不用設定資料庫、不用申請額外服務。

股市資訊這種東西，越快能上手使用越有價值。`,
    image: 'https://opengraph.githubassets.com/b783ad8138f2ea8ff06001006f5a108868dfd1703dfa74a3f6c8d2cc319b91ea/woodywoody40/stocksee',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'TWSE'],
    link: 'https://github.com/woodywoody40/stocksee',
    media: [],
    type: '前端開發'
  }
];

async function main() {
  for (const project of projects) {
    console.log(`📤 上傳: ${project.title}...`);
    
    const resp = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(project)
    });
    
    if (resp.ok) {
      const data = await resp.json();
      console.log(`   ✅ 成功！ID: ${data.id}, 標籤: ${data.tags.join(', ')}`);
    } else {
      const err = await resp.text();
      console.log(`   ❌ ${resp.status}: ${err}`);
    }
  }
}

main().catch(console.error);
