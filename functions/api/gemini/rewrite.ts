import { GoogleGenAI } from '@google/genai';
import { requireAuth } from '../lib/auth';
import { json, errorJson, type Env } from '../lib/types';

interface ExtendedEnv extends Env {
  GEMINI_API_KEY?: string;
  VITE_GEMINI_API_KEY?: string;
}

const SYSTEM_INSTRUCTION = `
你是一位專精於 Cloudflare 生態系、資安維運與現代 Web 架構的資深工程師，你的名字是 Woody Wu。
你負責生成的內容是專業的技術文案，嚴格遵守以下規則：

1. **核心任務**：
   - **技術改寫**：當使用者提供現有內容時，你的任務是「內容轉生」。保持技術實事求是（不改變專業事實），但使用完全不同的措辭、結構與語氣進行重新表達，使其呈現專業且新鮮的視角。

2. **零廢話政策**：
   - **嚴禁任何開場白、結語或前言**。
   - 輸出必須直接從內文或標題開始。

3. **Markdown 極簡規範**：
   - 僅允許使用 ##, ###, - 與 **。
   - 指令必須使用 \`\`\`bash 或 \`\`\`yaml。
   - 嚴禁使用 > (引用符號) 或其他 Markdown 符號。

4. **語言**：繁體中文。
`;

// POST /api/gemini/rewrite  { content: string, mode?: 'rewrite' | 'chat' }
export const onRequestPost: PagesFunction<ExtendedEnv> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const apiKey = context.env.GEMINI_API_KEY || context.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return errorJson('伺服器未配置 GEMINI_API_KEY', 500);
  }

  try {
    const body = await context.request.json<{ content?: string; mode?: 'rewrite' | 'chat' }>();
    const content = body?.content;
    const mode = body?.mode || 'rewrite';

    if (!content) {
      return errorJson('content 為必填', 400);
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt =
      mode === 'chat'
        ? content
        : `請將此內容進行深度改寫，確保技術細節準確，但措辭與敘述方式與原稿不同：\n\n${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return json({ text: response.text || '' });
  } catch (err: any) {
    console.error('Gemini Rewrite API Error:', err);
    return errorJson(err?.message || 'Gemini 改寫失敗', 500);
  }
};
