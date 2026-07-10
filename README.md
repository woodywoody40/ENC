# Woody 維運實踐

個人技術站：網管 / 資安 / 基礎架構維運筆記、作品集與履歷。

**Production:** https://xn--hrrs16bo6z.com/

## Architecture

| Layer | Stack |
|-------|--------|
| Frontend | React 19 + Vite SPA（`BrowserRouter`） |
| Backend | Cloudflare Pages Functions（`functions/api/*`） |
| Database | Cloudflare D1（`projects` / `blog_posts` / `site_configs`） |
| Storage | Cloudflare R2（`MEDIA`），公開路徑 `/media/<key>` |
| Auth | Cloudflare Access + `jose` 驗 JWT（寫入 API） |
| SEO | Edge HTML meta 注入、動態 `/sitemap.xml`、`/rss.xml` |

```
Browser ──> /api/*  ─>  Pages Function ─> D1 / R2
                │
                └─> /admin (Cloudflare Access policy)
```

公開 **GET** 讀取；**POST/PUT/DELETE/upload** 需通過 Access。

## Run Locally

**Prerequisites:** Node.js、`wrangler login`

1. `npm install`
2. （可選）`.env.local` 設定 `VITE_GEMINI_API_KEY`（若使用前端 AI 功能）
3. 建立 D1 / R2 並更新 `wrangler.jsonc` 的 `database_id`：
   ```bash
   wrangler d1 create woody-portfolio
   wrangler r2 bucket create woody-media
   ```
4. 初始化 schema：
   ```bash
   npm run db:init          # 本地
   npm run db:init:remote   # 遠端
   ```
5. 同時跑 Vite + Pages Functions：
   ```bash
   npm run pages:dev
   ```
6. 開啟 http://localhost:8788

僅前端 UI 可用 `npm run dev`（`/api/*` 需 Pages Functions 才會通）。

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite 開發伺服器 |
| `npm run build` | `tsc` + 生產建置 → `dist/` |
| `npm run preview` | 預覽建置結果 |
| `npm run pages:dev` | Wrangler Pages + Vite（含 D1/R2） |
| `npm run db:init` | 本地 D1 schema |
| `npm run db:init:remote` | 遠端 D1 schema |

## SEO / Feeds

- Sitemap: `/sitemap.xml`（靜態頁 + 文章 + `/portfolio/:id`）
- RSS: `/rss.xml`
- robots: 允許全站，Disallow `/admin`、`/api/`
- 文章 slug 與 UUID 皆支援 edge meta / JSON-LD

## Cloudflare Access

1. Zero Trust 建立 Application，Path：`/admin*`
2. 將 **AUD**、**Team** 填入 `wrangler.jsonc` 的 `CF_ACCESS_AUD` / `CF_ACCESS_TEAM`
3. Policy 限制 email / domain
4. 寫入 API 會讀 `Cf-Access-Jwt-Assertion` 或 `CF_AU` cookie

## Deploy

```bash
npm run build
wrangler pages deploy dist --project-name=woody-portfolio
# 首次或 schema 變更後：
npm run db:init:remote
```

確認 Pages 專案 bindings（D1 / R2）與 Access 規則生效。

## Project layout

```
pages/           # 路由頁面
components/      # Navbar、Admin 編輯器等
functions/api/   # REST API
functions/       # sitemap.xml.ts、rss.xml.ts、edge SEO middleware
lib/seo.tsx      # Helmet + JSON-LD
services/        # apiClient、gemini
public/          # 靜態資產、SW、favicon
```
