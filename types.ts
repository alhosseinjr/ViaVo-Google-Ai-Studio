
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'tops' | 'bottoms' | 'outerwear';
  price: number;
  description: string;
  imageUrl: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  gender: 'men' | 'women' | 'unisex';
  measurements: Record<string, ProductMeasurements>;
}

export interface ProductMeasurements {
  chest?: number;
  waist?: number;
  length?: number;
  shoulders?: number;
}

export interface FitMetric {
  label: string;
  value: number; // 0-100
  status: 'optimal' | 'tight' | 'loose';
}

export interface BodyAnalysis {
  heightRange: string;
  bodyType: string;
  chestCm: number;
  waistCm: number;
  shoulderWidth: string;
  proportions: string;
  confidence: number;
  fitMetrics: FitMetric[];
}

export interface SizeRecommendation {
  productId: string;
  recommendedSize: string;
  confidence: number;
  reasoning: string;
  alternativeSize?: string;
}

export interface TryOnSession {
  facePhoto: string | null;
  bodyPhoto: string | null;
  selectedProducts: Product[];
  selectedOptions: Record<string, { size: string; color: string }>;
  resultImage: string | null;
  analysis: BodyAnalysis | null;
  recommendations: SizeRecommendation[];
}

export enum AppStep {
  LANDING = 'landing',
  UPLOAD = 'upload',
  PRODUCTS = 'products',
  RESULTS = 'results'
}
