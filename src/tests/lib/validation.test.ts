import { describe, it, expect } from 'vitest';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  fullProductSchema,
  variationSchema,
} from '@/lib/validation/productSchema';

describe('Unit Test: Yup Validation Schemas (IFG Product Portal)', () => {
  describe('Step 1 Schema: Basic Product Info', () => {
    it('should validate valid step 1 data', async () => {
      const validData = {
        title: 'Sony Wireless Headphones',
        brand: 'Sony',
        category: 'electronics',
        description: 'High-quality noise cancelling wireless over-ear headphones.',
      };
      await expect(step1Schema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject title shorter than 3 characters', async () => {
      const invalidData = {
        title: 'AB',
        brand: 'Sony',
        category: 'electronics',
        description: 'High-quality noise cancelling wireless over-ear headphones.',
      };
      await expect(step1Schema.validate(invalidData)).rejects.toThrow(
        'Title must be at least 3 characters'
      );
    });

    it('should reject description shorter than 20 characters', async () => {
      const invalidData = {
        title: 'Sony Wireless Headphones',
        brand: 'Sony',
        category: 'electronics',
        description: 'Too short',
      };
      await expect(step1Schema.validate(invalidData)).rejects.toThrow(
        'Description must be at least 20 characters'
      );
    });
  });

  describe('Step 2 Schema: Pricing, Stock & SKU Variations', () => {
    it('should validate valid step 2 data with unique variations', async () => {
      const validData = {
        price: 199.99,
        stock: 50,
        discountPercentage: 10,
        variations: [
          { color: 'Black', size: 'M', sku: 'SKU-BLK-1001', extraPrice: 0 },
          { color: 'White', size: 'L', sku: 'SKU-WHT-1002', extraPrice: 5 },
        ],
      };
      await expect(step2Schema.validate(validData)).resolves.toBeDefined();
    });

    it('should reject price less than or equal to 0', async () => {
      const invalidPrice = {
        price: 0,
        stock: 10,
        variations: [],
      };
      await expect(step2Schema.validate(invalidPrice)).rejects.toThrow(
        'Price must be greater than 0'
      );
    });

    it('should reject stock less than 0', async () => {
      const invalidStock = {
        price: 100,
        stock: -5,
        variations: [],
      };
      await expect(step2Schema.validate(invalidStock)).rejects.toThrow(
        'Stock must be 0 or greater'
      );
    });

    it('should reject invalid SKU format not matching SKU-[A-Z]{3}-[0-9]{4}', async () => {
      const invalidSku = {
        color: 'Red',
        size: 'L',
        sku: 'INVALID-SKU-FORMAT',
        extraPrice: 0,
      };
      await expect(variationSchema.validate(invalidSku)).rejects.toThrow(
        'SKU must match format SKU-XXX-0000'
      );
    });

    it('should reject duplicate SKU codes within the variations array', async () => {
      const duplicateSkus = {
        price: 100,
        stock: 10,
        variations: [
          { color: 'Red', size: 'M', sku: 'SKU-RED-1001', extraPrice: 0 },
          { color: 'Blue', size: 'L', sku: 'SKU-RED-1001', extraPrice: 5 },
        ],
      };
      await expect(step2Schema.validate(duplicateSkus)).rejects.toThrow(
        'Duplicate SKU codes are not allowed'
      );
    });
  });

  describe('Step 3 Schema: Shipping & Fragile Handling', () => {
    it('should validate non-fragile item without special notes', async () => {
      const validData = {
        weight: 1.5,
        dimensions: { width: 10, height: 20, depth: 5 },
        requiresFragileHandling: false,
      };
      await expect(step3Schema.validate(validData)).resolves.toBeDefined();
    });

    it('should require disclaimer and notes when fragile handling is enabled', async () => {
      const missingDisclaimer = {
        weight: 1.5,
        dimensions: { width: 10, height: 20, depth: 5 },
        requiresFragileHandling: true,
        hazardousMaterialDisclaimer: false,
        specialShippingNotes: 'Handle with extreme care, fragile glass item.',
      };
      await expect(step3Schema.validate(missingDisclaimer)).rejects.toThrow(
        'You must accept the fragile material disclaimer'
      );
    });

    it('should validate fragile item when disclaimer and notes are provided', async () => {
      const validFragileData = {
        weight: 1.5,
        dimensions: { width: 10, height: 20, depth: 5 },
        requiresFragileHandling: true,
        hazardousMaterialDisclaimer: true,
        specialShippingNotes: 'Handle with extreme care, fragile glass item.',
      };
      await expect(step3Schema.validate(validFragileData)).resolves.toBeDefined();
    });
  });

  describe('Full Combined Schema Validation', () => {
    it('should validate full valid product form submission', async () => {
      const fullData = {
        title: 'Sony Wireless Headphones Pro',
        brand: 'Sony',
        category: 'electronics',
        description: 'High-quality noise cancelling wireless over-ear headphones.',
        price: 299.99,
        stock: 25,
        discountPercentage: 15,
        variations: [
          { color: 'Black', size: 'Standard', sku: 'SKU-BLK-2001', extraPrice: 0 },
        ],
        weight: 0.8,
        dimensions: { width: 15, height: 20, depth: 8 },
        requiresFragileHandling: true,
        hazardousMaterialDisclaimer: true,
        specialShippingNotes: 'Fragile acoustic drivers inside, handle with care.',
      };
      await expect(fullProductSchema.validate(fullData)).resolves.toBeDefined();
    });
  });
});
