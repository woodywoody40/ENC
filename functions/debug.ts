import type { Env } from './api/lib/types';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return new Response(JSON.stringify({
    message: 'debug endpoint works',
    r2Binding: typeof env.MEDIA,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Test': 'hello-woody',
      'Cache-Control': 'no-store',
    },
  });
};
