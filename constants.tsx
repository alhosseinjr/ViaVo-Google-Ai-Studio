
import { Product } from './types';

// Using direct download/view links for Google Drive images
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Long-Sleeve Ribbed Henley',
    brand: 'Y.STUDIOS',
    category: 'tops',
    price: 650,
    description: 'A premium slim-fit henley in deep matte black. Features a textured rib-knit and a sophisticated three-button neckline.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1AvziUO4gRt6I417YsyCmwKugJ0ddzpig',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Matte Black', hex: '#000000' }],
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
    name: 'Varsity Cable-Knit Sweater',
    brand: 'Y.STUDIOS',
    category: 'tops',
    price: 1150,
    description: 'Classic ivory cable-knit sweater with a deep V-neck and emerald green varsity stripes. Crafted for a relaxed, timeless silhouette.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1zvrF7wML06yLz3hLQrPMbdIM572qZRjN',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Cream / Green', hex: '#fdfcf0' }],
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
    name: 'Wide-Leg Pleated Trouser',
    brand: 'Y.STUDIOS',
    category: 'bottoms',
    price: 850,
    description: 'Sophisticated wide-leg trousers in jet black with crisp double pleats. Designed to create a dramatic yet tailored high-fashion look.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1FuV0hGxJQlmNZifr9xv3vwuD_mh0xydx',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [{ name: 'Jet Black', hex: '#000000' }],
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
    name: 'Textured Knit Polo',
    brand: 'Y.STUDIOS',
    category: 'tops',
    price: 850,
    description: 'Refined heather grey polo sweater with a three-button collar. A versatile staple that combines the comfort of a sweater with the structure of a polo.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1F2hBadEUCPy8BU1Ip5qxLGVzP7Htqz-x',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Heather Grey', hex: '#9ca3af' }],
    gender: 'men',
    measurements: {
      'S': { chest: 96, length: 68 },
      'M': { chest: 104, length: 70 },
      'L': { chest: 112, length: 72 },
      'XL': { chest: 120, length: 74 }
    }
  }
];
