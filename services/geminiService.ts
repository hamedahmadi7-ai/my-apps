import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Edits an image using Gemini 2.5 Flash Image model.
 * 
 * @param imageBase64 Base64 string of the source image (without prefix)
 * @param mimeType MIME type of the source image
 * @param prompt Text description of the edit or transformation
 * @returns Promise resolving to the generated image base64 string
 */
export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts returned.");
    }

    // Find the image part
    const imagePart = parts.find(part => part.inlineData && part.inlineData.data);

    if (!imagePart || !imagePart.inlineData) {
      throw new Error("No image data found in the response.");
    }

    return imagePart.inlineData.data;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};