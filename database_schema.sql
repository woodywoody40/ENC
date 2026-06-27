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
('resume_name',       'Woody Wu'),
('resume_title',      '資深基礎架構與資安工程師'),
('resume_email',      'example@mail.com'),
('resume_location',   'Taiwan'),
('resume_summary',   '於教育體系維運核心基礎設施，專注於 Linux 系統加固、高效能儲存架構與資安通報應處。'),
('resume_skills',    'Linux System:Expert,Network Security:Expert,Cloud Storage:Advanced'),
('about_hero_title_left',  '關於'),
('about_hero_title_right', 'Woody'),
('about_hero_subtitle',    'The Infrastructure Guardian'),
('about_bio_heading',      '在數位動脈中，\n維護絕對的穩定性。'),
('about_content',          '從底層的 HPE 儲存調優到核心防火牆策略，每一行指令都是為了追求極致穩定。'),
('about_skill1_title',  'OS & Virtualization'),
('about_skill1_desc',   'Ubuntu 24.04 LTS 專家, vSphere 8.0 管理, 151+ VM 叢集調度。'),
('about_skill2_title',  'Security Edge'),
('about_skill2_desc',   'Fortinet HA 部署, VDOM 隔離實踐, TANet 維運。'),
('about_skill3_title',  'Storage Logic'),
('about_skill3_desc',   'HPE MSA 2050 混合儲存, QNAP NAS 備援, iSCSI Multipath。');