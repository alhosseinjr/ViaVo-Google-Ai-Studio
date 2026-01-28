
import { GoogleGenAI, Type } from "@google/genai";
import { BodyAnalysis, SizeRecommendation, Product, FitMetric } from "../types";

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
    Analyze this full body photo for a professional virtual try-on system.
    Return JSON with anatomical measurements and fit metrics.
    Fit metrics should reflect how standard clothing sits on this specific body type.
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
          confidence: { type: Type.NUMBER },
          fitMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ['optimal', 'tight', 'loose'] }
              },
              required: ["label", "value", "status"]
            }
          }
        },
        required: ["heightRange", "bodyType", "chestCm", "waistCm", "shoulderWidth", "proportions", "confidence", "fitMetrics"]
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
    TASK: Generate a high-resolution photorealistic studio catalog image.
    
    CRITICAL REQUIREMENTS:
    1. BACKGROUND: Pure, solid white background (#FFFFFF).
    2. SUBJECT: Exact face from the face photo. Exact body shape and pose from the body photo.
    3. CLOTHING: Person wearing: ${productInfo}.
    4. PHYSICS: Ensure fabric folds and shadows match the pose accurately.
    5. STYLE: Luxury fashion editorial.
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

  if (!imageUrl) throw new Error("AI Synthesis failed.");
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
      reasoning: `Matched to your ${analysis.chestCm}cm chest measurement and ${analysis.bodyType} build.`
    };
  });
};
