import type { Env } from './lib/types';

// 通用中介層：統一處理 JSON body 解析與錯誤包裝
export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const response = await context.next();
    return response;
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }
};