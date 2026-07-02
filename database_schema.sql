-- ============================================================
--  Woody Infrastructure Portfolio - Cloudflare D1 Schema + Seed
--  Usage:
--    wrangler d1 create woody-portfolio
--    wrangler d1 execute woody-portfolio --remote --file=database_schema.sql
--    wrangler d1 execute woody-portfolio --local  --file=database_schema.sql
-- ============================================================

-- -----------------------------------------------------------
-- projects : 作品實績
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  details     TEXT,
  image       TEXT,
  tags        TEXT,         -- JSON array (encoded)
  link        TEXT,
  media       TEXT,         -- JSON array (encoded)
  type        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects (created_at DESC);

-- -----------------------------------------------------------
-- blog_posts : 技術文章
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id        TEXT PRIMARY KEY,
  title     TEXT NOT NULL,
  excerpt   TEXT,
  content   TEXT,
  date      TEXT,
  category  TEXT,
  image     TEXT
);
CREATE INDEX IF NOT EXISTS idx_blog_date ON blog_posts (date DESC);

-- -----------------------------------------------------------
-- site_configs : 網站全域設定 (key/value)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_configs (
  key    TEXT PRIMARY KEY,
  value  TEXT
);

-- ===========================================================
--  Seed Data
-- ===========================================================

INSERT OR IGNORE INTO projects (id, title, description, details, image, tags, link, media, type, created_at) VALUES
('1',
 '151 台虛擬伺服器核心運維叢集',
 '基於 VMware vSphere 架構，管理全縣教育體系之核心 Linux 叢集。',
 '## 核心部署

此專案為教網中心的核心心臟。在 Ubuntu 24.04 環境下，透過標準化模板與自動化腳本，管理超過 150 台虛擬主機。

### 關鍵挑戰

- **Radius 併發峰值**：透過 vDS 分散式交換器處理認證流量
- **VDS 網路隔離**：實作多租戶網路切片
- **自動化佈署**：cloud-init + Ansible 全流程
',
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
 '["Ubuntu 24.04","vSphere","Automation"]',
 '#', '[]', '1', datetime('now'));

-- -----------------------------------------------------------
-- blog_posts seed
-- -----------------------------------------------------------
INSERT OR IGNORE INTO blog_posts (id, title, excerpt, content, date, category, image) VALUES
('u24-netplan-master',
 'Ubuntu 24.04 網路配置聖經：Netplan 狀態管理與除錯',
 'Ubuntu 24.04 引入了全新的 netplan status 指令，讓網管不再需要盲目修改 YAML。本文分享 150+ VM 環境下的配置實戰。',
 '## netplan status 全新體驗

Ubuntu 24.04 將舊版 `netplan try` 升級為完整的 status 子指令，提供拓樸與健康度一覽。

### 實戰除錯流程

- 透過 `netplan status --all` 檢視所有介面
- 透過 `networkctl status` 檢查 systemd-networkd 狀態
- YAML 修改後務必先 `netplan try` 確認再 commit

```bash
sudo netplan status --all
sudo netplan try --timeout 30
sudo netplan apply
```
',
 '2025-03-10',
 '系統運維',
 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200');

-- -----------------------------------------------------------
-- site_configs seed
-- -----------------------------------------------------------
INSERT OR IGNORE INTO site_configs (key, value) VALUES
('hero_title',        'Woody Wu\nInfrastructure'),
('hero_intro',        '深耕教育體系網際網路，構築絕對穩定的數位動脈。'),
('stat_vm',           '151+ Nodes'),
('stat_uptime',       '99.9%'),
('stat_defense',      'Forti HA'),
('resume_name',       '吳東謙'),
('resume_title',      '系統維運工程師'),
('resume_email',      'example@mail.com'),
('resume_location',   '基隆, Taiwan'),
('resume_summary',   '現任基隆市教育網路中心系統維運工程師，負責 TANet 學術網路資安監控及全市教育網路服務維運。主導建置自動化 VM 備份系統與異地備援架構，管理 150+ 虛擬主機之儲存與資料保護。持有 CEH 與 MTCNA 國際認證。公關實習背景培養了跨部門協作與技術需求溝通能力，能有效橋接技術與業務兩端。'),
('resume_skills',    'VMware 虛擬化:Expert,儲存與備援架構:Expert,TANet 資安監控:Expert,系統弱掃與修補:Advanced,Google Workspace:Advanced,CEH & MTCNA:Certified'),
('about_hero_title_left',  '關於'),
('about_hero_title_right', '東謙'),
('about_hero_subtitle',    '系統維運 · 資安監控 · 基隆在地'),
('about_bio_heading',      '從基隆出發，\n守護教育數位基礎。'),
('about_content',          '我是吳東謙，現就讀國立臺灣海洋大學資訊工程碩士專班，同時任職於基隆市教育網路中心。學術與實戰並行的雙軌節奏，讓我能將理論帶進機房，也把第一線維運經驗反芻為研究深度。\n\n在教網中心，我負責 TANet 學術網路的資安監控與流量分析，確保全市教育網路服務穩定運行。從零建置的自動化 VM 備份系統與異地備援架構，結合 HPE Storage 與 QNAP NAS 的整合調度，為超過 150 台虛擬主機提供了可驗證的資料韌性。\n\n除技術實務外，公關產業的實習背景給了我另一種視野——跨部門溝通、需求轉譯、利害關係人協調，讓我在技術團隊中不只是執行者，更是連結者。'),
('about_skill1_title',  '儲存 & 備份'),
('about_skill1_desc',   '規劃異地備援架構，設計自動化 VM 備份策略，管理 HPE Storage 與 QNAP NAS 儲存集群。'),
('about_skill2_title',  '資安 & 弱掃'),
('about_skill2_desc',   '執行系統弱點掃描與漏洞修補，監控 TANet 異常流量，持有 CEH 國際資安認證。'),
('about_skill3_title',  'VM & 雲端管理'),
('about_skill3_desc',   '維運 VMware vSphere 集群（150+ VM），制定標準化部署流程，管理 Google Workspace 網域。');

-- Additional resume seed (experience, education, certs)
INSERT OR IGNORE INTO site_configs (key, value) VALUES
('resume_experience', '### 系統維運工程師 | 基隆市教育網路中心\n2022 - Present\n- 監控 TANet 學術網路異常流量，執行資安事件通報與應處，保障全市教育網路穩定運行\n- 主導設計並建置自動化 VM 備份機制，整合 HPE Storage 與 QNAP NAS，實現異地備援\n- 管理超過 150 台 VMware 虛擬主機，制定標準化部署流程與系統弱掃修補 SOP\n- 兼任 Google Workspace 後台管理，處理全校網域帳號與權限控管\n\n### 公關實習生\n2021 - 2022\n- 負責客戶溝通與專案協調，歷練跨部門需求整合與利害關係人管理\n- 獨立撰寫新聞稿與媒體簡報，累積商業文案與品牌敘事能力'),
('resume_education', '### 國立臺灣海洋大學\n2024 - Present\n資工系碩士專班'),
('resume_certs', '### EC-Council\nCEH (Certified Ethical Hacker)\n\n### MikroTik\nMTCNA 網路工程師認證\n\n### Google\nIT Support Professional Certificate');