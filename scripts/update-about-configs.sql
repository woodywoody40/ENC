-- Update About page configs
-- Run: npx wrangler d1 execute woody-portfolio --remote --file=scripts/update-about-configs.sql

-- Hero section
UPDATE site_configs SET value = '系統維運 · 資安監控 · 基隆在地' WHERE key = 'about_hero_subtitle';
UPDATE site_configs SET value = '關於' WHERE key = 'about_hero_title_left';
UPDATE site_configs SET value = 'Woody' WHERE key = 'about_hero_title_right';

-- Bio section: rewritten with richer narrative
UPDATE site_configs SET value = '讓基礎設施沉默地運轉，\n就是最好的工程。' WHERE key = 'about_bio_heading';

UPDATE site_configs SET value = '我是吳東謙，現就讀國立臺灣海洋大學資訊工程碩士專班，同時任職於基隆市教育網路中心。學術與實戰並行的雙軌節奏，讓我能將論文裡的理論帶進機房驗證，也把第一線的維運經驗反芻為研究深度。

在教網中心，我負責 TANet 學術網路的資安監控與流量分析，確保全市中小學的網路服務穩定運行。從零建置的自動化 VM 備份系統與異地備援架構，結合 HPE Storage 與 QNAP NAS 的整合調度，為超過 150 台虛擬主機提供了可驗證的資料韌性——不是「應該沒問題」，而是「出事十分鐘內可以拉回來」。

除了技術實務，公關產業的實習背景給了我另一種視野。跨部門溝通、需求轉譯、利害關係人協調——這些看似「軟」的技能，在基礎設施維運中往往是成敗的關鍵。技術人員常說「這很簡單啊」，但能把複雜的架構講到讓校長聽懂、讓廠商照做，那才是真正的功力。' WHERE key = 'about_content';

-- Skill cards: rewrite from keyword-stuffed to narrative
UPDATE site_configs SET value = '儲存與備份' WHERE key = 'about_skill1_title';
UPDATE site_configs SET value = '設計並維運異地備援架構，制定自動化 VM 備份策略。管理 HPE MSA 混合儲存陣列與 QNAP NAS 叢集，確保關鍵資料在任何災害情境下都能快速還原。' WHERE key = 'about_skill1_desc';

UPDATE site_configs SET value = '資安監控' WHERE key = 'about_skill2_title';
UPDATE site_configs SET value = '執行系統弱點掃描與漏洞修補，監控 TANet 骨幹異常流量。持有 CEH 國際資安認證，熟悉 Fortinet 防火牆 HA 部署與安全政策制定。' WHERE key = 'about_skill2_desc';

UPDATE site_configs SET value = '虛擬化與雲端' WHERE key = 'about_skill3_title';
UPDATE site_configs SET value = '維運 VMware vSphere 8.0 叢集，管理超過 150 台 Ubuntu 24.04 VM。制定標準化部署流程，從 cloud-init 初始化到 Ansible 配置管理，讓每一台機器都可被複製、可被驗證、可被安心重啟。' WHERE key = 'about_skill3_desc';

-- Verification
SELECT key, value FROM site_configs WHERE key LIKE 'about_%' ORDER BY key;
