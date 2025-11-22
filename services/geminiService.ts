import { GoogleGenAI } from "@google/genai";
import { Group } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generic model selection based on guidelines
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const generateGroupAnalysis = async (groups: Group[]): Promise<string> => {
  try {
    const groupData = groups.map(g => 
      `Group ${g.name}: ${g.teams.map(t => t.name).join(', ')}`
    ).join('\n');

    const prompt = `
      Futbol yorumcusu olarak aşağıdaki turnuva gruplarını analiz et. 
      Hangi grup "Ölüm Grubu"? Kim favori? Kısa, heyecanlı ve eğlenceli bir yorum yaz.
      
      ${groupData}
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "Analiz oluşturulamadı.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Yapay zeka şu anda meşgul, analiz yapılamadı.";
  }
};

// Helper to convert URL to base64
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image fetch failed (likely CORS restrictions):", error);
    throw new Error("Görsel güvenlik kısıtlamaları (CORS) nedeniyle düzenlenemiyor. Lütfen cihazınızdan bir görsel yükleyin veya farklı bir görsel deneyin.");
  }
}

export const editTeamLogo = async (imageInput: string, prompt: string): Promise<string | null> => {
  try {
    let base64Image = imageInput;

    // If input is a URL (http/https), convert to base64 first
    if (imageInput.startsWith('http')) {
      base64Image = await urlToBase64(imageInput);
    }

    // Ensure the base64 string is clean (remove data:image/...;base64, prefix)
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          {
            text: `Edit this logo based on the following instruction: "${prompt}". Maintain the core identity and shape of the logo but apply the requested style, filter, or modification. Return a high-quality PNG image.`,
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data
            }
          }
        ]
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

export const generateTeamLogo = async (teamName: string): Promise<string | null> => {
  try {
    const prompt = `Create a realistic, high-quality football club logo for a team named "${teamName}". The design should be professional, suitable for a sports team badge, isolated on a white background.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Logo Generation Error:", error);
    throw error;
  }
};

export const simulateMatch = async (teamA: string, teamB: string): Promise<{ scoreA: number, scoreB: number, commentary: string }> => {
    try {
        const prompt = `
        Simulate a football match between ${teamA} and ${teamB}.
        Return a JSON object with:
        - scoreA (integer)
        - scoreB (integer)
        - commentary (string, in Turkish, short and exciting summary of the match)
        `;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        
        return JSON.parse(text);
    } catch (error) {
        console.error("Match Simulation Error", error);
        // Fallback
        return {
            scoreA: Math.floor(Math.random() * 5),
            scoreB: Math.floor(Math.random() * 5),
            commentary: "Bağlantı hatası nedeniyle maç sonucu rastgele belirlendi."
        };
    }
}