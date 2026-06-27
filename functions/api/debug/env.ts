import { json, type Env } from '../lib/types';

// GET /api/debug/env -> 檢查環境變數是否注入成功（僅開發用，部署後應刪除）
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return json({
    CF_ACCESS_TEAM: env.CF_ACCESS_TEAM || '(not set)',
    CF_ACCESS_AUD: env.CF_ACCESS_AUD ? env.CF_ACCESS_AUD.slice(0, 8) + '...' : '(not set)',
    DB_binding: !!env.DB,
    MEDIA_binding: !!env.MEDIA,
  });
};