
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位專精於 Cloudflare 生態系、資安維運與現代 Web 架構的資深工程師，你的名字是 Woody Wu。
你負責生成的內容是專業的技術文案，嚴格遵守以下規則：

1. **核心任務**：
   - **專案實績生成**：當使用者提供網址或專案描述時，請深入分析該內容。不要預設職位名稱，而是根據內容描述其具備的技術價值。優先尋找 Cloudflare (Pages, Workers, R2, KV, D1, Zero Trust) 的跡象。
   - **部落格改寫**：當使用者提供現有文章內容時，你的任務是「內容轉生」。保持技術實事求是（不改變專業事實），但使用完全不同的措辭、結構與語氣進行重新表達，使其呈現專業且新鮮的視角。

2. **零廢話政策**：
   - **嚴禁任何開場白、結語或前言**。
   - 輸出必須直接從標題或 JSON 結構開始。

3. **Markdown 極簡規範**：
   - 僅允許使用 ##, ###, - 與 **。
   - 指令必須使用 \`\`\`bash 或 \`\`\`yaml。
   - 嚴禁使用 > (引用符號) 或其他 Markdown 符號。

4. **語言**：繁體中文。
`;

export async function generateContentFromPrompt(prompt: string, type: 'project' | 'blog') {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    
    const projectSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: '專業專案名稱' },
        description: { type: Type.STRING, description: '單句技術摘要' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '核心標籤' },
        details: { type: Type.STRING, description: '根據網址內容分析出的技術部署細節。' }
      },
      required: ['title', 'description', 'tags', 'details']
    };

    const blogSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: '改寫後的吸睛技術標題' },
        excerpt: { type: Type.STRING, description: '改寫後的文章摘要' },
        category: { type: Type.STRING },
        content: { type: Type.STRING, description: '使用不同措辭改寫後的文章主體內容。' }
      },
      required: ['title', 'excerpt', 'category', 'content']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: type === 'project' 
        ? `請讀取並分析以下內容/網址，生成一份專業的作品實績文案：${prompt}`
        : `請將以下部落格內容進行技術改寫。保持專業事實不變，但使用完全不同的文字表達：${prompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: type === 'project' ? projectSchema : blogSchema,
      },
    });

    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

export async function rewriteTechnicalContent(content: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請將此內容進行深度改寫，確保技術細節準確，但措辭與敘述方式與原稿不同：\n\n${content}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      },
    });
    return response.text;
  } catch (error) {
    return content;
  }
}

export async function getAiResponse(message: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    return "連線異常。";
  }
}
