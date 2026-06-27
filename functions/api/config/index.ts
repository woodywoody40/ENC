import { json, type Env, type ConfigRow } from '../lib/types';
import { requireAuth } from '../lib/auth';

// GET /api/config -> 回傳 { key: value } 物件
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.DB.prepare('SELECT * FROM site_configs').all<ConfigRow>();
  const map: Record<string, string> = {};
  for (const row of result.results || []) {
    map[row.key] = row.value ?? '';
  }
  return json(map);
};