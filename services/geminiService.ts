
import { GoogleGenAI, Type } from "@google/genai";
import { BodyAnalysis, SizeRecommendation, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const extractBase64Data = (base64String: string | null): string => {
  if (!base64String) return "";
  const parts = base64String.split(",");
  return parts.length > 1 ? parts[1] : parts[0];
};

export const analyzeBody = async (bodyPhotoBase64: string): Promise<BodyAnalysis> => {
  const model = "gemini-3-flash-preview";
  const base64Data = extractBase64Data(bodyPhotoBase64);
  if (!base64Data) throw new Error("Invalid photo data.");

  const prompt = `
    Analyze this full body photo for a virtual try-on system.
    Return JSON:
    {
      "heightRange": "string",
      "bodyType": "string",
      "chestCm": number,
      "waistCm": number,
      "shoulderWidth": "string",
      "proportions": "string",
      "confidence": number
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          heightRange: { type: Type.STRING },
          bodyType: { type: Type.STRING },
          chestCm: { type: Type.NUMBER },
          waistCm: { type: Type.NUMBER },
          shoulderWidth: { type: Type.STRING },
          proportions: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ["heightRange", "bodyType", "chestCm", "waistCm", "shoulderWidth", "proportions", "confidence"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const generateTryOnResult = async (
  facePhoto: string,
  bodyPhoto: string,
  products: Product[],
  options: Record<string, { size: string; color: string }>
): Promise<string> => {
  const model = "gemini-2.5-flash-image";
  const faceData = extractBase64Data(facePhoto);
  const bodyData = extractBase64Data(bodyPhoto);

  const productInfo = products.map(p => {
    const opt = options[p.id];
    return `${p.name} in size ${opt.size} (${opt.color})`;
  }).join(", ");

  const prompt = `
    TASK: Generate a photorealistic studio catalog image.
    
    CRITICAL REQUIREMENTS:
    1. BACKGROUND: Pure, blank, solid white background (#FFFFFF). Absolutely NO shadows on the background, NO environment, NO floor lines.
    2. SUBJECT: Use the EXACT face and facial features from the face photo provided. Use the exact body shape and pose from the body photo.
    3. CLOTHING: The person MUST be wearing these specific items: ${productInfo}.
    4. SIZE REPRESENTATION: 
       - If a size is 'XL' or 'L', show the garment with a slightly relaxed, oversized drape.
       - If a size is 'S' or 'XS', show the garment with a sharp, fitted look.
    5. STYLE: High-end fashion editorial style. Sharp focus, professional studio lighting.
    6. RESULT: Just the person standing centered on a blank white void.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: faceData } },
        { inlineData: { mimeType: "image/jpeg", data: bodyData } }
      ]
    }
  });

  let imageUrl = '';
  const candidates = response.candidates;
  if (candidates?.[0]?.content?.parts) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) throw new Error("AI Generation failed. Please try again.");
  return imageUrl;
};

export const getRecommendations = (analysis: BodyAnalysis, products: Product[]): SizeRecommendation[] => {
  return products.map(product => {
    const specs = Object.entries(product.measurements);
    let bestSize = product.sizes[0];
    let minDiff = Infinity;
    specs.forEach(([size, m]) => {
      let diff = 0;
      if (m.chest) diff += Math.abs(m.chest - analysis.chestCm);
      if (m.waist) diff += Math.abs(m.waist - analysis.waistCm);
      if (diff < minDiff) { minDiff = diff; bestSize = size; }
    });
    return {
      productId: product.id,
      recommendedSize: bestSize,
      confidence: 0.95,
      reasoning: `Based on your ${analysis.bodyType} build, size ${bestSize} will provide a clean, architectural silhouette.`
    };
  });
};
