
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
  if (!base64Data) throw new Error("Invalid silhouette capture data.");

  const prompt = `
    Analyze this silhouette for professional virtual fitting.
    Calculate:
    1. Body type identification (e.g., Athletic, Slim, Rectangle, Inverted Triangle, etc.).
    2. Estimated Chest/Bust and Waist circumferences in CM.
    3. Anatomical fit metrics (0-100) for torso and shoulders based on the silhouette's volume.
    
    Output strictly in JSON format.
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

  const text = response.text;
  if (!text) throw new Error("Neural analyzer returned empty response.");
  return JSON.parse(text);
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
    return `${p.name} (Selection: ${opt.size}, ${opt.color})`;
  }).join(", ");

  const prompt = `
    PHOTOREALISTIC NEURAL SYNTHESIS:
    Render a high-end fashion portrait of the subject wearing: ${productInfo}.
    
    INSTRUCTIONS:
    - Retain exact facial features and identity from the profile portrait.
    - Map garments perfectly to the pose and physique from the silhouette.
    - Ensure realistic fabric drape, lighting shadows, and studio-grade quality.
    - Background: Solid Studio White (#FFFFFF).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: faceData } },
        { inlineData: { mimeType: "image/jpeg", data: bodyData } }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  let imageUrl = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) throw new Error("Synthesis failed to generate final frame.");
  return imageUrl;
};

export const getRecommendations = (analysis: BodyAnalysis, products: Product[]): SizeRecommendation[] => {
  return products.map(product => {
    const sizes = Object.entries(product.measurements);
    let bestSize = product.sizes[0];
    let minDiff = Infinity;
    sizes.forEach(([size, m]) => {
      let diff = 0;
      if (m.chest) diff += Math.abs(m.chest - analysis.chestCm) * 1.5;
      if (m.waist) diff += Math.abs(m.waist - analysis.waistCm);
      if (diff < minDiff) { minDiff = diff; bestSize = size; }
    });
    return {
      productId: product.id,
      recommendedSize: bestSize,
      confidence: analysis.confidence,
      reasoning: `Matched to your ${analysis.chestCm}cm chest profile and ${analysis.bodyType} silhouette.`
    };
  });
};
