#!/usr/bin/env node
const BASE_URL = 'https://woody-portfolio.pages.dev';
const API_KEY = 'Woody80402';

const projects = [
  {
    id: 'vtuber-dashboard',
    title: '台灣 VTuber 即時數據觀測站',
    description: '整合 YouTube 與 Twitch 數據的 VTuber 儀表板，即時追蹤 2,500+ 台灣 VTuber 的直播狀態、訂閱排行與成長趨勢。',
    details: `## 為什麼想做這個？

身為一個有在看 VTuber 的人，我發現台灣 VTuber 圈其實很活躍，但沒有一個地方可以讓人快速掌握「現在誰在直播？」、「這週誰成長最多？」、「最近有哪些新人出道？」

YT 和 Twitch 的搜尋功能又不是很友善，要一個一個找很麻煩。所以我就自己做了一個。

## 核心功能

**即時直播牆**：隨時顯示正在直播的台灣 VTuber，可以一鍵點進去觀看。支援水平捲動，快速瀏覽。

**排行系統**：整合 YouTube 訂閱數、Twitch 追蹤數、7 日成長率等多維度排行。

**數據統計**：總人數 2,589 位、直播中 345 位、本月新人 43 位——這些數字會即時更新。

**近期活動**：出道資訊、週年慶、重大活動一覽。

## 技術架構

前端用 Next.js 搭配即時數據更新機制。數據來源透過 YouTube 和 Twitch 的公開 API 整合，定時更新快取，確保儀表板不會因為大量請求被限制。

後端部署在 Cloudflare Pages Functions，搭配 D1 做數據快取，減少對第三方 API 的呼叫頻率。

## 設計理念

UI 設計走乾淨的數據儀表板風格，重點是讓使用者可以快速掃描資訊——哪些 VTuber 正在直播、他們的 thumbnail、分類標籤（個人勢、團體勢），一目瞭然。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['Next.js', 'TypeScript', 'YouTube API', 'Twitch API', 'Cloudflare D1', 'Dashboard'],
    link: 'https://vtuber-dashboard.pages.dev/',
    media: [],
    type: '數據視覺化'
  },
  {
    id: 'woodypdf',
    title: 'WoodyPDF - 極致簡約的線上 PDF 工具',
    description: '完全在瀏覽器中處理的 PDF 工具箱——合併、分割、編輯、轉換、加密，不需上傳到任何伺服器，保護你的文件隱私。',
    details: `## 為什麼想做這個？

市面上不是沒有 PDF 工具，但我對那些要把檔案上傳到不明的伺服器才能處理的工具很不放心——尤其是處理合約或個人文件的時候。

Stirling-PDF 很厲害，但每次都要開 Docker 也麻煩。我想要一個更輕量的方案——打開瀏覽器就能用，檔案不用離開我的電腦。

## 功能特色

WoodyPDF 涵蓋了 PDF 處理的全流程：

**組織頁面**：合併、分割、旋轉、多合一操作
**格式轉換**：圖片轉 PDF、PDF 轉圖片、PDF 轉 Word
**安全與簽名**：加密保護、解鎖 PDF、添加浮水印、簽署 PDF
**編輯與優化**：PDF 編輯器、壓縮、添加頁碼、編輯元數據、扁平化 PDF

## 技術亮點

所有處理都透過瀏覽器端的 JavaScript 完成——採用 PDF.js 和相關的 WebAssembly 函式庫。檔案從頭到尾不會離開使用者的裝置，真正做到隱私無虞。

UI 設計走簡潔路線，側邊欄分類清楚，使用者可以快速找到需要的工具。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'PDF.js', 'WebAssembly', 'PWA'],
    link: 'https://pdf-8wg.pages.dev/',
    media: [],
    type: '前端開發'
  },
  {
    id: 'save-food',
    title: '此食此刻 - 超商即期品地圖',
    description: '串接 7-11 i珍食 與 全家友善時光，地圖顯示附近超商的打折即期食品，省錢又環保。',
    details: `## 為什麼想做這個？

每天下班經過超商都會進去晃一下，看看有沒有打折的即期品。但有時候跑了三家 7-11 都賣完了，有時候全家卻有一堆。

我就在想——如果有一個地圖，可以直接看到附近所有超商還有哪些即期品在打折，不是就不用一家一家跑了嗎？

## 功能

**附近優惠地圖**：打開定位，地圖直接顯示周圍超商的即期品庫存狀態。
**輪盤功能**：不知道吃什麼？轉一下輪盤隨機決定。
**收藏**：把自己常去的超商加入收藏，快速查看。

## 技術架構

純前端應用，串接 7-11 和全家的公開優惠資料。使用地理定位 API 計算距離，地圖渲染使用 Leaflet。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Leaflet', 'Geolocation', 'PWA'],
    link: 'https://save-food.pages.dev/',
    media: [],
    type: '生活應用'
  },
  {
    id: 'yuanshanchurch',
    title: '圓山貴格會 - 教會官方網站',
    description: '為台北圓山貴格會打造的官方網站，整合主日影音、最新消息、線上敬拜與教會資訊。',
    details: `## 為什麼想做這個？

教會一直以來都是用 Facebook 粉絲頁发布消息，但資訊很分散——週報在 LINE 群組、信息影片在 YouTube、活動公告在 FB。對新朋友來說，想了解教會在幹嘛很不方便。

所以幫教會做了一個官網，把所有東西整合在一起。

## 功能

**主日影音**：最新主日崇拜信息直接嵌入 YouTube，不用跳轉。
**最新消息**：教會公告、活動資訊即時更新。
**線上敬拜**：遠距參與的會友可以直接線上敬拜。
**關於我們**：貴格會的信仰傳統介紹——安靜心靈、在靜默中聆聽神。

## 設計風格

走溫暖、安靜的視覺風格，呼應貴格會「在靜默中聆聽神」的傳統。色調以大地色系為主，給人安心、平靜的感覺。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'YouTube API', 'Cloudflare Pages'],
    link: 'https://yuanshanchurch.pages.dev/',
    media: [],
    type: '網頁設計'
  },
  {
    id: 'sfstation',
    title: '十分幸福站 SF Station - 精品伴手禮官網',
    description: '為平溪十分老街的實體店鋪打造的品牌官網，融合鐵道文化與精品伴手禮，含即時火車時刻顯示。',
    details: `## 為什麼想做這個？

十分幸福站是一間在十分老街的實體店鋪，賣精品台式伴手禮，二樓還有咖啡空間。他們需要一個網站讓遊客可以：

- 在來之前先了解品牌故事和商品
- 看到即時的火車時刻（十分是鐵道景點，火車時刻很重要）
- 在 Google Maps 上找到評價和導航
- 預約二樓咖啡座位

## 特色功能

**鐵道追蹤器（Railway Tracker）**：網站上會顯示下一班火車還有幾分鐘到站——這對在十分老街的遊客來說超實用。

**即時留言板**：串接 Google Maps 評價，顯示 4.8 顆星的遊客真實回饋。

**精品伴手禮展示**：商品陳列設計有質感，符合「一期一會」的品牌精神。

## 設計風格

走日式精品風格，深色調搭配金色點綴，呼應「十分幸福」的品牌溫暖感。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Google Maps API', 'Tailwind CSS', 'Cloudflare Pages'],
    link: 'https://sfstation.pages.dev/',
    media: [],
    type: '網頁設計'
  },
  {
    id: 'numhive',
    title: '數巢 NumHive - 數字合併益智遊戲',
    description: '兩款原創數字益智遊戲：經典模式點擊合併數字、幾何拼圖拖曳形狀消除，挑戰你的策略與空間邏輯。',
    details: `## 為什麼想做這個？

我平常很愛玩那種打發時間的小遊戲，像是 2048、Threes! 之類的。但我發現很多遊戲都有惱人的廣告，不然就是玩到後面一定要課金。

所以就自己做了一個——沒有廣告、不用課金、純粹好玩。

## 遊戲模式

**數巢經典 CLASSIC**：點擊棋盤放置數字，三個相同數字相鄰即可合併升級。策略在於——你要想清楚下一步放哪裡，不然棋盤很快就滿了。

**幾何拼圖 PUZZLE**：拖曳不同形狀到棋盤上，運用空間邏輯進行消除。比經典模式更需要空間規劃能力。

## 技術亮點

遊戲邏輯全部用 TypeScript 實作，Canvas 渲染保證 60fps 流暢體驗。最高分記錄存在 LocalStorage，關掉瀏覽器再開分數還在。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['TypeScript', 'Canvas', 'Game', 'HTML5'],
    link: 'https://numhive.pages.dev/',
    media: [],
    type: '遊戲開發'
  },
  {
    id: 'woody1010',
    title: '1010 - 經典方塊益智遊戲',
    description: '經典 1010 益智遊戲的 Web 版——拖曳方塊放到棋盤，消除行列得分，沒有時間限制，純粹的策略挑戰。',
    details: `## 為什麼想做這個？

1010 是我手機上玩最久的遊戲之一。規則超簡單——把給你的方塊放到棋盤上，填滿一行或一列就會消除，沒有限時。

但我實在不喜歡那些版本彈出來的廣告。所以自己寫了一個乾淨的版本。

## 怎麼玩

遊戲會給你三個方塊形狀，你要把它們拖曳到 10×10 的棋盤上。完成一行或一列就會消除得分。棋盤滿了就結束。

最高分會記錄在瀏覽器裡，可以挑戰自己每次都破紀錄。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['TypeScript', 'Canvas', 'Game', 'HTML5'],
    link: 'https://woody1010.pages.dev/',
    media: [],
    type: '遊戲開發'
  },
  {
    id: 'line-crm',
    title: 'LINE CRM PRO - 多租戶客戶管理系統',
    description: '企業級 LINE 客戶關係管理系統，支援多租戶架構、精準標籤系統與數據視覺化，賦能對話式行銷。',
    details: `## 為什麼想做這個？

LINE 在台灣的滲透率超高，很多商家都用 LINE 在跟客戶溝通。但問題是——LINE 本身不是 CRM，你不能標籤客戶、不能分析對話數據、不能自動化行銷。

所以我做了一套 LINE CRM 系統，讓商家可以在 LINE 上面做到真正的客戶管理。

## 核心功能

**多租戶管理**：不同商家各自獨立，資料完全隔離。

**精準標籤系統**：根據客戶對話行為自動貼標籤，後續可以針對不同標籤族群做精準行銷。

**數據視覺化**：對話量、客戶活躍度、轉換率等關鍵指標一目瞭然。

## 技術架構

後端採用 Cloudflare Pages Functions + D1 資料庫，多租戶隔離透過 row-level security 實現。

前端用 React + TypeScript，數據圖表用 Recharts 呈現。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Cloudflare D1', 'LINE API', 'CRM', 'Dashboard'],
    link: 'https://linebot-5w2.pages.dev/',
    media: [],
    type: 'SaaS 平台'
  },
  {
    id: 'photo-ai',
    title: 'Gemini AI 影像魔術師',
    description: 'AI 驅動的線上影像編輯工具——提升畫質、移除路人、去背、壓縮、場景合成，用 Gemini 的視覺能力解放創意。',
    details: `## 為什麼想做這個？

修圖軟體不是太貴（Photoshop）就是太複雜（GIMP），我只是想要一個能快速：把照片畫質提升、把背景路人P掉、去背換背景的工具。

Google Gemini 的視覺能力出來之後，我就在想——能不能用 AI 的自然語言理解能力，讓修圖變成像聊天一樣簡單？

## 功能

**提升畫質 UPSCALE**：AI 放大圖片，細節不模糊。
**路人移除**：一鍵刪除照片中的路人甲。
**刪除背景**：精準去背，毛髮邊緣也處理得很好。
**壓縮文件**：AI 優化圖片大小，保留畫質。
**場景合成**：把人物放到不同的場景背景中。
**自由魔改**：直接用文字描述你想改的地方——「把天空變夕陽」、「提高對比度」。

## 技術

前端用 React + TypeScript，AI 引擎全部走 Google Gemini API，透過 multi-turn 對話實現複雜的圖片編輯流程。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Gemini API', 'AI', 'Image Processing'],
    link: 'https://photo-48m.pages.dev/',
    media: [],
    type: 'AI 應用'
  },
  {
    id: 'aicard',
    title: 'Ai名片蒐集冊 - AI 智慧名片管理',
    description: '用 AI 掃描與管理名片的數位工具——拍照即建檔、自動辨識資訊、分類整理。',
    details: `## 為什麼想做這個？

每次參加研討會或聚會，收了一堆名片回來後就不知道塞到哪去了。等真的要找的時候，一張一張翻超沒效率。

做一個 App 讓名片數位化——拍張照，AI 自動把姓名、公司、電話、Email 都辨識出來，分類整理好，要用搜尋的就行。

## 功能

**拍照辨識**：拍名片→AI 自動提取聯絡資訊
**聯絡人管理**：分類、搜尋、標籤
**我的名片**：自己的名片也可以建檔分享

## 技術

前端用 React + TypeScript，串接 Gemini API 做名片文字辨識與資訊提取。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Gemini API', 'PWA', 'OCR'],
    link: 'https://aicard-b4x.pages.dev/',
    media: [],
    type: 'AI 應用'
  },
  {
    id: 'woody-currency',
    title: 'Woody匯率 - 多幣別即時換算器',
    description: '整合 12 種主流貨幣的即時匯率計算機，支援匯率換算與計算機功能，一頁搞定匯率查詢。',
    details: `## 為什麼想做這個？

出國旅遊或網購的時候，常常要換算匯率——日幣多少台幣？美金多少？每次都要 Google「日幣匯率」很麻煩。

我想要的是一個打開就能用的匯率工具，結合計算機功能——輸入金額、選幣別、直接算出結果，不用跳轉頁面。

## 功能

**12 種貨幣支援**：台幣、日幣、美金、歐元、韓元、人民幣、港幣、泰銖、英鎊、新加坡幣、澳幣、越南盾。

**即時匯率**：串接公開匯率 API，數字即時更新。

**計算機一體**：匯率換算和計算機在同一個介面，不用切來切去。

## 技術

純前端 React 應用，匯率資料透過免費 API 取得，LocalStorage 快取減少請求次數。`,
    image: 'https://opengraph.githubassets.com/a91b553bc1c9c2a72a151e068cdea193c32272e10caee4e71b116cd26d8d9523/woodywoody40/KVideo',
    tags: ['React', 'TypeScript', 'Calculator', 'Exchange Rate API'],
    link: 'https://woody-calculator.pages.dev/',
    media: [],
    type: '工具開發'
  }
];

async function main() {
  let success = 0;
  let fail = 0;
  
  for (const project of projects) {
    console.log(`📤 [${success+fail+1}/${projects.length}] ${project.title}...`);
    
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
      console.log(`   ✅ ${data.id}`);
      success++;
    } else {
      const err = await resp.text();
      // Check if duplicate
      if (resp.status === 500 && err.includes('UNIQUE')) {
        console.log(`   ⏭️ 已存在（跳過）`);
        success++;
      } else {
        console.log(`   ❌ ${resp.status}: ${err.slice(0, 100)}`);
        fail++;
      }
    }
  }
  
  console.log(`\n🎉 完成！成功 ${success} 篇，失敗 ${fail} 篇`);
}

main().catch(console.error);
