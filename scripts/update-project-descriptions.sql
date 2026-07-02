-- ============================================================
--  作品集描述優化 — 統一文案風格、修正口語化/廣告腔問題
--  執行方式:
--    wrangler d1 execute woody-portfolio --remote --file=scripts/update-project-descriptions.sql
-- ============================================================

-- 1. 1010 經典方塊益智遊戲
UPDATE projects SET description = '沒有廣告、沒有倒數——在 10×10 棋盤上排列方塊、消除行列，享受純粹的邏輯解謎樂趣。'
WHERE id = 'woody1010';

-- 2. LINE CRM PRO 多租戶客戶管理系統
UPDATE projects SET description = '多租戶架構的 LINE 客戶管理系統——自動標籤、對話分析、數據儀表板，把日常客服對話變成可追蹤的客戶資產。'
WHERE id = 'line-crm';

-- 3. Gemini AI 影像魔術師
UPDATE projects SET description = '用自然語言指揮 AI 修圖——去背、放大、路人移除、風格轉換，不用學 Photoshop，一句話就搞定。'
WHERE id = 'photo-ai';

-- 4. Ai名片蒐集冊
UPDATE projects SET description = '拍照即建檔的 AI 名片管理工具——自動辨識姓名、公司、職稱與聯絡方式，建立可搜尋的數位通訊錄。'
WHERE id = 'aicard';

-- 5. Woody匯率 多幣別即時換算器
UPDATE projects SET description = '12 種常用貨幣即時匯率換算，內建一體化計算機——出國旅遊、跨境網購前的隨手工具。'
WHERE id = 'woody-currency';

-- 6. WoodyPDF 極致簡約的線上 PDF 工具
UPDATE projects SET description = '全端處理的隱私優先 PDF 工具箱——合併、分割、壓縮、加密全在瀏覽器內完成，檔案不離開你的電腦。'
WHERE id = 'woodypdf';

-- 7. 此食此刻 超商即期品地圖
UPDATE projects SET description = '地圖顯示附近 7-11 與全家即期品庫存——省錢又減少食物浪費，內建輪盤幫你決定今天吃什麼。'
WHERE id = 'save-food';

-- 8. 圓山貴格會 教會官方網站
UPDATE projects SET description = '圓山貴格會官方網站——整合主日影音、教會消息與線上敬拜，以溫暖的大地色系呼應貴格會靜默聆聽的傳統。'
WHERE id = 'yuanshanchurch';

-- 9. 十分幸福站 SF Station 精品伴手禮官網
UPDATE projects SET description = '十分老街精品伴手禮品牌官網——融合鐵道文化與即時火車時刻追蹤，讓遊客不再錯過回程班次。'
WHERE id = 'sfstation';

-- 10. 數巢 NumHive 數字合併益智遊戲
UPDATE projects SET description = '兩款原創數字益智遊戲——經典模式以合併數字考驗策略、幾何模式以拖曳拼圖挑戰空間邏輯，無廣告、無課金。'
WHERE id = 'numhive';

-- 11. EchoDiary AI 智慧語音日記
UPDATE projects SET description = '用語音寫日記的 PWA 應用——AI 自動整理錄音內容、追蹤情緒曲線、分析行為模式。資料完全本地儲存，不上傳任何雲端。'
WHERE id = 'echodiary';

-- 12. 股見 台灣股市即時洞察平台
UPDATE projects SET description = '台股即時數據與 AI 新聞分析整合平台——自訂關注清單、一鍵摘要財經新聞、自動判斷市場情緒，從資訊洪流中篩出訊號。'
WHERE id = 'stocksee';

-- 13. 151 台虛擬伺服器核心運維叢集
UPDATE projects SET description = '全縣教育體系的運維核心——151 台 Ubuntu 24.04 VM、VMware vSphere 叢集、cloud-init 自動化部署，從 Radius 認證到 VDS 網路隔離的完整基礎架構。'
WHERE id = '1';

-- 驗證更新結果
SELECT id, description FROM projects ORDER BY created_at DESC;
