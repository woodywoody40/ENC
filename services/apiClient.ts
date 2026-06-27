// 取代 supabaseClient.ts
// 專案改用 Cloudflare D1 + Pages Functions 後端；前端透過 fetch 與同源 /api 通訊。
// GET 為公開公開讀取；寫入端點（POST/PUT/DELETE/upload）由 Cloudflare Access JWT 守護。

const BASE = '/api';

const handleRes = async <T>(res: Response): Promise<T | undefined> => {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = (await res.json()) as Record<string, unknown>;
      msg = (j.error as string) || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  return JSON.parse(text) as T;
};

export const apiClient = {
  get: <T = any>(path: string): Promise<T> =>
    fetch(`${BASE}${path}`, { credentials: 'include' }).then((res) => handleRes<T>(res)) as Promise<T>,

  post: <T = any>(path: string, body?: any): Promise<T> =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((res) => handleRes<T>(res)) as Promise<T>,

  put: <T = any>(path: string, body?: any): Promise<T> =>
    fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((res) => handleRes<T>(res)) as Promise<T>,

  del: <T = any>(path: string): Promise<T> =>
    fetch(`${BASE}${path}`, { method: 'DELETE', credentials: 'include' }).then((res) => handleRes<T>(res)) as Promise<T>,
};

// ===== 便利方法 =====
export const ProjectsAPI = {
  list: () => apiClient.get<any[]>('/projects'),
  get: (id: string) => apiClient.get<any>(`/projects/${id}`),
  create: (data: any) => apiClient.post<any>('/projects', data),
  update: (id: string, data: any) => apiClient.put<any>(`/projects/${id}`, data),
  remove: (id: string) => apiClient.del(`/projects/${id}`),
};

export const BlogAPI = {
  list: () => apiClient.get<any[]>('/blog'),
  get: (id: string) => apiClient.get<any>(`/blog/${id}`),
  create: (data: any) => apiClient.post<any>('/blog', data),
  update: (id: string, data: any) => apiClient.put<any>(`/blog/${id}`, data),
  remove: (id: string) => apiClient.del(`/blog/${id}`),
};

export const ConfigAPI = {
  all: () => apiClient.get<Record<string, string>>('/config'),
  set: (key: string, value: string) =>
    apiClient.put<{ key: string; value: string }>(`/config/${key}`, { value }),
};

export const AuthAPI = {
  me: () => apiClient.get<{ authenticated: boolean; email?: string }>('/auth/me'),
};

// 圖片上傳（multipart/form-data）
export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form, credentials: 'include' });
  if (!res.ok) {
    let msg = `上傳失敗: HTTP ${res.status}`;
    try { const j = (await res.json()) as Record<string, unknown>; msg = (j.error as string) || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  const j = (await res.json()) as { url: string };
  return j.url;
}