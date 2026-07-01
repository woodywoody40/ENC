<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10FT_brxD4yyVi7cvp6YtqKs0DyIR2fmI

## Architecture

雲端架構已由 Supabase 全面遷移至 Cloudflare 全家桶：

- **Frontend**: React + Vite SPA（HashRouter）
- **Backend**: Cloudflare Pages Functions（`functions/api/*`）
- **Database**: Cloudflare D1（SQLite），三張表：`projects` / `blog_posts` / `site_configs`
- **Storage**: Cloudflare R2（`MEDIA` binding），透過 `/media/<key>` 公開提供
- **Auth**: Cloudflare Access。後端以 `jose` 驗證 `Cf-Access-Jwt-Assertion` JWT。
  讀取 API 公開；寫入 API（POST/PUT/DELETE/upload）需通過 Access。

```
Browser ──> /api/*  ─>  Pages Function ─> D1 / R2
                │
                └─> /admin (Cloudflare Access policy)
```

## Run Locally

**Prerequisites:** Node.js, Cloudflare 帳號（已安裝 `wrangler` 並完成 `wrangler login`）

1. 安裝依賴：
   `npm install`
2. 設定 `VITE_GEMINI_API_KEY` 在 `.env.local` 以使用 AI 助理（前端使用）
3. 建立 D1 資料庫與 R2 bucket 並更新 `wrangler.jsonc` 的 `database_id`：
   ```bash
   wrangler d1 create woody-portfolio
   wrangler r2 bucket create woody-media
   ```
4. 初始化資料庫（含預設種子資料）：
   ```bash
   npm run db:init          # 本地
   npm run db:init:remote   # 遠端（部署後執行）
   ```
5. 同時執行 Vite 與 Pages Functions（含 D1/R2 本地模擬）：
   `npm run pages:dev`
6. 開啟 `http://localhost:8788`

> 若只需前端開發，仍可使用 `npm run dev`；但所有 `/api/*` 請求需有 Pages Functions 才能運作。

## Cloudflare Access 設定

1. 在 Cloudflare Zero Trust 後台建立 Application
2. Path 設為 `/admin*`（即只保護管理介面）
3. 取得 **Application AUD** 並填入 `wrangler.jsonc` 的 `CF_ACCESS_AUD`
4. 填入 `CF_ACCESS_TEAM`（例：`acme.cloudflareaccess.com`）
5. 建 Access Policy（限制 email 或 email domain）
6. 完成 Access Application 後，前往 `/admin` 會自動轉至 SSO 登入頁

> 後端如何驗證 `/api/*` 的寫入請求？
> Access 登入成功後 Cloudflare 會在該 domain 寫入 `CF_AU` cookie（內容即 JWT）。
> 此 cookie 會隨所有同源 fetch 請求自動攜帶；後端 `functions/api/lib/auth.ts`
> 會從 `Cf-Access-Jwt-Assertion` header 或 `CF_AU` cookie 兩處擇一驗簽，
> 故只需保護 `/admin*` 即可，公開讀取 API 不受影響。

## Deploy to Cloudflare Pages

1. `npm run build`
2. `wrangler pages deploy dist --project-name=woody-portfolio`
3. 部署後再執行 `npm run db:init:remote` 啟用資料表與種子資料
4. 在 Pages 專案設定中確認 `wrangler.jsonc` 的 bindings 已生效
5. 在 Cloudflare Zero Trust 中將 Pages domain 加入 Access 應用，並保護 `/admin*` 與 `/api/projects*`（write methods）等敏感路由