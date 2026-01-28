
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Stealth Ribbed Henley',
    brand: 'ViaVo Core',
    category: 'tops',
    price: 58,
    description: 'A deep black, long-sleeve henley crafted from ultra-soft ribbed cotton. Featuring a three-button placket and a silhouette-defining fit.',
    imageUrl: 'https://images.unsplash.com/photo-1626497748470-281923f935f5?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Onyx Black', hex: '#0a0a0a' }],
    gender: 'men',
    measurements: {
      'S': { chest: 92, length: 68 },
      'M': { chest: 100, length: 70 },
      'L': { chest: 108, length: 72 },
      'XL': { chest: 116, length: 74 }
    }
  },
  {
    id: 'p2',
    name: 'Varsity Heritage V-Neck',
    brand: 'Ivy Collective',
    category: 'tops',
    price: 145,
    description: 'Classic ivory cable-knit sweater with distinctive green-striped V-neck trim. A timeless piece that bridges the gap between athletic heritage and modern luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&q=80&w=800',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Cream / Forest', hex: '#fdfcf0' }],
    gender: 'unisex',
    measurements: {
      'XS': { chest: 88, length: 64 },
      'S': { chest: 96, length: 66 },
      'M': { chest: 104, length: 68 },
      'L': { chest: 112, length: 70 }
    }
  },
  {
    id: 'p3',
    name: 'Architectural Wide-Leg Trouser',
    brand: 'ViaVo Studio',
    category: 'bottoms',
    price: 180,
    description: 'High-waisted black trousers with double-front pleats and a dramatic wide-leg drape. Designed to create a commanding, professional silhouette.',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [{ name: 'Matte Black', hex: '#111111' }],
    gender: 'unisex',
    measurements: {
      '28': { waist: 71, length: 104 },
      '30': { waist: 76, length: 105 },
      '32': { waist: 81, length: 106 },
      '34': { waist: 86, length: 107 },
      '36': { waist: 91, length: 108 }
    }
  },
  {
    id: 'p4',
    name: 'Cashmere Knit Polo',
    brand: 'ViaVo Premium',
    category: 'tops',
    price: 120,
    description: 'A refined grey knit polo featuring a soft, heathered texture and a structured collar. The ultimate "elevated basic" for professional versatility.',
    imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Heather Grey', hex: '#a1a1aa' }],
    gender: 'men',
    measurements: {
      'S': { chest: 96, length: 68 },
      'M': { chest: 104, length: 70 },
      'L': { chest: 112, length: 72 },
      'XL': { chest: 120, length: 74 }
    }
  }
];
