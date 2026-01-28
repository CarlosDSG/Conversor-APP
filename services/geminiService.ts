
import { GoogleGenAI } from "@google/genai";

export const getLatestRates = async (): Promise<{ tasaDia: number; tasaBcv: number; sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Busca las tasas de cambio actuales en Venezuela: Tasa oficial BCV y Tasa paralela (promedio). Devuelve solo los números en formato JSON con las llaves 'tasaBcv' y 'tasaDia'.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      tasaBcv: Number(data.tasaBcv) || 0,
      tasaDia: Number(data.tasaDia) || 0,
      sources: sources
    };
  } catch (error) {
    console.error("Error fetching rates from Gemini:", error);
    throw error;
  }
};
