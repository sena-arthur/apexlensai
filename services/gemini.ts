
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1] || base64Image,
    },
  };

  const textPart = {
    text: prompt
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    let resultUrl = '';
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultUrl) {
      throw new Error("O modelo não retornou uma imagem.");
    }

    return resultUrl;
  } catch (error) {
    console.error("Editing Error:", error);
    throw new Error("Falha ao editar imagem. " + (error as Error).message);
  }
};
