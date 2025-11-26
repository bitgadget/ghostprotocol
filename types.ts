
export enum BundleTier {
  BASE = 'BASE',
  MEDIO = 'MEDIO',
  IMPRENDITORE = 'IMPRENDITORE',
  FANTASMA = 'FANTASMA'
}

export type Language = 'it' | 'en';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  image: string;
  specs: string[];
}

export interface Bundle {
  id: string;
  tier: BundleTier;
  name: string;
  tagline: string;
  price: number;
  features: string[];
  recommendedFor: string;
  items: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'product' | 'bundle';
}
