import * as yup from 'yup';

const transformNumber = (value: unknown, originalValue: unknown) => {
  if (originalValue === '' || originalValue === null || originalValue === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return value;
};

export const variationSchema = yup.object().shape({
  id: yup.string().optional(),
  color: yup.string().required('Color is required'),
  size: yup.string().required('Size is required'),
  sku: yup
    .string()
    .required('SKU Code is required')
    .min(2, 'SKU must be at least 2 characters')
    .max(50, 'SKU cannot exceed 50 characters'),
  extraPrice: yup
    .number()
    .transform((val: unknown, orig: unknown) => (orig === '' || Number.isNaN(val) ? 0 : Number(val)))
    .min(0, 'Extra price must be 0 or greater')
    .required('Extra price is required'),
});

export const step1Schema = yup.object().shape({
  title: yup
    .string()
    .required('Product Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  brand: yup.string().required('Brand is required'),
  category: yup.string().required('Category is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
});

export const step2Schema = yup.object().shape({
  price: yup
    .number()
    .transform(transformNumber)
    .required('Base price is required')
    .moreThan(0, 'Base price must be greater than 0'),
  stock: yup
    .number()
    .transform(transformNumber)
    .required('Stock quantity is required')
    .min(0, 'Stock must be 0 or greater')
    .integer('Stock must be a whole number'),
  discountPercentage: yup
    .number()
    .transform(transformNumber)
    .optional()
    .nullable()
    .min(0, 'Discount cannot be negative')
    .max(99, 'Discount cannot exceed 99%'),
  variations: yup
    .array()
    .of(variationSchema)
    .test(
      'unique-sku',
      'SKU codes must be unique across variations',
      function (variations) {
        if (!variations || variations.length === 0) return true;
        const skus = variations
          .map((v) => v?.sku?.trim().toUpperCase())
          .filter((sku): sku is string => Boolean(sku));
        const uniqueSkus = new Set(skus);
        if (uniqueSkus.size !== skus.length) {
          const seen = new Set<string>();
          const duplicates = new Set<string>();
          skus.forEach((sku) => {
            if (seen.has(sku)) duplicates.add(sku);
            seen.add(sku);
          });
          return this.createError({
            message: `Duplicate SKU code found: ${Array.from(duplicates).join(', ')}`,
            path: 'variations',
          });
        }
        return true;
      }
    )
    .default([]),
});

export const step3Schema = yup.object().shape({
  weight: yup
    .number()
    .transform(transformNumber)
    .required('Weight is required')
    .moreThan(0, 'Weight must be greater than 0 kg'),
  dimensions: yup.object().shape({
    width: yup
      .number()
      .transform(transformNumber)
      .required('Width is required')
      .moreThan(0, 'Width must be greater than 0'),
    height: yup
      .number()
      .transform(transformNumber)
      .required('Height is required')
      .moreThan(0, 'Height must be greater than 0'),
    depth: yup
      .number()
      .transform(transformNumber)
      .required('Depth is required')
      .moreThan(0, 'Depth must be greater than 0'),
  }),
  requiresFragileHandling: yup.boolean().default(false),
  hazardousMaterialDisclaimer: yup.boolean().when('requiresFragileHandling', {
    is: true,
    then: (schema) =>
      schema
        .oneOf([true], 'You must acknowledge the hazardous material disclaimer for fragile items')
        .required(),
    otherwise: (schema) => schema.optional(),
  }),
  specialShippingNotes: yup.string().when('requiresFragileHandling', {
    is: true,
    then: (schema) =>
      schema
        .required('Special shipping notes are required for fragile items')
        .min(10, 'Special shipping notes must be at least 10 characters'),
    otherwise: (schema) => schema.optional(),
  }),
});

export const fullProductSchema = yup.object().shape({
  ...step1Schema.fields,
  ...step2Schema.fields,
  ...step3Schema.fields,
});
