import { describe, it, expect } from 'vitest';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  fullProductSchema,
  variationSchema,
} from '@/lib/validation/productSchema';

describe('Unit Test: productSchema Validation', () => {
  describe('Step 1 Schema: Basic Product Info', () => {
    it('should pass with valid basic product info', async () => {
      const validData = {
        title: 'Premium Wireless Headphones',
        brand: 'Sony',
        category: 'electronics',
        description: 'High quality active noise canceling wireless headphones with long battery life.',
      };
      await expect(step1Schema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject titles shorter than 3 characters or longer than 100 characters', async () => {
      const shortTitle = {
        title: 'AB',
        brand: 'Sony',
        category: 'electronics',
        description: 'High quality active noise canceling wireless headphones.',
      };
      await expect(step1Schema.validate(shortTitle)).rejects.toThrow(
        'Title must be at least 3 characters'
      );
    });

    it('should reject descriptions shorter than 20 characters', async () => {
      const shortDesc = {
        title: 'Premium Wireless Headphones',
        brand: 'Sony',
        category: 'electronics',
        description: 'Too short desc',
      };
      await expect(step1Schema.validate(shortDesc)).rejects.toThrow(
        'Description must be at least 20 characters'
      );
    });
  });

  describe('Step 2 Schema: Pricing, Stock & Dynamic SKU Variations', () => {
    it('should pass with valid price, stock, and variations', async () => {
      const validData = {
        price: 199.99,
        stock: 50,
        discountPercentage: 15,
        variations: [
          { color: 'Black', size: 'M', sku: 'SKU-BLK-1001', extraPrice: 0 },
          { color: 'Silver', size: 'M', sku: 'SKU-SLV-1002', extraPrice: 10 },
        ],
      };
      const result = await step2Schema.validate(validData);
      expect(result.price).toBe(199.99);
      expect(result.variations.length).toBe(2);
    });

    it('should transform empty extraPrice string into 0', async () => {
      const variationWithEmptyPrice = {
        color: 'Black',
        size: 'M',
        sku: 'SKU-BLK-1001',
        extraPrice: '' as unknown,
      };
      const result = await variationSchema.validate(variationWithEmptyPrice);
      expect(result.extraPrice).toBe(0);
    });

    it('should reject non-positive base price', async () => {
      const invalidPrice = {
        price: 0,
        stock: 10,
        variations: [],
      };
      await expect(step2Schema.validate(invalidPrice)).rejects.toThrow(
        'Base price must be greater than 0'
      );
    });

    it('should reject negative stock quantity', async () => {
      const invalidStock = {
        price: 100,
        stock: -5,
        variations: [],
      };
      await expect(step2Schema.validate(invalidStock)).rejects.toThrow(
        'Stock must be 0 or greater'
      );
    });

    it('should reject SKU shorter than 2 characters', async () => {
      const invalidSku = {
        color: 'Red',
        size: 'L',
        sku: 'A',
        extraPrice: 0,
      };
      await expect(variationSchema.validate(invalidSku)).rejects.toThrow(
        'SKU must be at least 2 characters'
      );
    });

    it('should reject duplicate SKU codes within the variations array', async () => {
      const duplicateSkus = {
        price: 100,
        stock: 10,
        variations: [
          { color: 'Red', size: 'M', sku: 'SKU-RED-1001', extraPrice: 0 },
          { color: 'Crimson', size: 'L', sku: 'SKU-RED-1001', extraPrice: 5 },
        ],
      };
      await expect(step2Schema.validate(duplicateSkus)).rejects.toThrow(
        'Duplicate SKU code found: SKU-RED-1001'
      );
    });
  });

  describe('Step 3 Schema: Shipping & Conditional Fragile Handling Logic', () => {
    it('should pass for non-fragile item without conditional fields', async () => {
      const validNonFragile = {
        weight: 1.5,
        dimensions: { width: 10, height: 15, depth: 5 },
        requiresFragileHandling: false,
      };
      await expect(step3Schema.validate(validNonFragile)).resolves.toBeTruthy();
    });

    it('should require hazardous disclaimer and shipping notes when fragile handling is checked', async () => {
      const missingFragileDetails = {
        weight: 1.5,
        dimensions: { width: 10, height: 15, depth: 5 },
        requiresFragileHandling: true,
        hazardousMaterialDisclaimer: false,
        specialShippingNotes: '',
      };
      await expect(step3Schema.validate(missingFragileDetails)).rejects.toThrow();
    });

    it('should pass when fragile handling is checked and all mandatory fragile fields are valid', async () => {
      const validFragile = {
        weight: 1.5,
        dimensions: { width: 10, height: 15, depth: 5 },
        requiresFragileHandling: true,
        hazardousMaterialDisclaimer: true,
        specialShippingNotes: 'Handle with extreme care, double bubble wrap required.',
      };
      await expect(step3Schema.validate(validFragile)).resolves.toBeTruthy();
    });
  });

  describe('Full Product Schema', () => {
    it('should validate complete onboarding form object', async () => {
      const fullData = {
        title: 'Pro Camera Lens',
        brand: 'Canon',
        category: 'photography',
        description: 'Professional grade 50mm f/1.2 prime lens for mirrorless cameras.',
        price: 1299.0,
        stock: 12,
        discountPercentage: 5,
        variations: [
          { color: 'Black', size: '50mm', sku: 'SKU-CAN-5001', extraPrice: 0 },
        ],
        weight: 0.8,
        dimensions: { width: 9, height: 12, depth: 9 },
        requiresFragileHandling: true,
        hazardousMaterialDisclaimer: true,
        specialShippingNotes: 'Glass optics inside. Do not drop or stack heavy boxes on top.',
      };
      await expect(fullProductSchema.validate(fullData)).resolves.toBeTruthy();
    });
  });
});
