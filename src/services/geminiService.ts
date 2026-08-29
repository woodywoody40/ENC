import { apiClient } from './apiClient';

/**
 * 透過後端 Pages Functions 端點進行安全呼叫，
 * 避免在用戶端 Bundle 中暴露 GEMINI_API_KEY。
 */

export async function generateContentFromPrompt(
  prompt: string,
  type: 'project' | 'blog' = 'project',
) {
  try {
    const data = await apiClient.post('/gemini/generate', { prompt, type });
    return data || {};
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    throw error;
  }
}

export async function rewriteTechnicalContent(content: string) {
  try {
    const res = await apiClient.post<{ text: string }>('/gemini/rewrite', {
      content,
      mode: 'rewrite',
    });
    return res?.text || content;
  } catch (error) {
    console.error('Gemini Rewrite Error:', error);
    return content;
  }
}

export async function getAiResponse(message: string) {
  try {
    const res = await apiClient.post<{ text: string }>('/gemini/rewrite', {
      content: message,
      mode: 'chat',
    });
    return res?.text || '連線異常。';
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return '連線異常。';
  }
}
