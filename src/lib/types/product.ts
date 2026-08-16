export interface ProductVariation {
  id?: string;
  color: string;
  size: string;
  sku: string;
  extraPrice: number;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating?: number;
  stock: number;
  tags?: string[];
  brand: string;
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    barcode?: string;
    qrCode?: string;
  };
  images: string[];
  thumbnail: string;
  variations?: ProductVariation[];
  requiresFragileHandling?: boolean;
  hazardousMaterialDisclaimer?: boolean;
  specialShippingNotes?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductFormData {
  // Step 1
  title: string;
  brand: string;
  category: string;
  description: string;

  // Step 2
  price: number;
  stock: number;
  discountPercentage?: number;
  variations: ProductVariation[];

  // Step 3
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  requiresFragileHandling: boolean;
  hazardousMaterialDisclaimer?: boolean;
  specialShippingNotes?: string;
}

export type ViewMode = 'table' | 'grid';
export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
