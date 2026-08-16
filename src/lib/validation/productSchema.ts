import * as yup from 'yup';

const transformNumber = (value: unknown, originalValue: unknown) => {
  if (originalValue === '' || originalValue === null || originalValue === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return value;
};

export const SKU_REGEX = /^SKU-[A-Z]{3}-[0-9]{4}$/;

export const variationSchema = yup.object().shape({
  id: yup.string().optional(),
  color: yup.string().required('Color is required'),
  size: yup.string().required('Size is required'),
  sku: yup
    .string()
    .required('SKU Code is required')
    .matches(SKU_REGEX, 'SKU must match format SKU-XXX-0000 (e.g. SKU-RED-1001)'),
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
  brand: yup
    .string()
    .required('Brand is required')
    .min(2, 'Brand must be at least 2 characters'),
  category: yup.string().required('Category is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
});

export const step2Schema = yup.object().shape({
  price: yup
    .number()
    .transform(transformNumber)
    .required('Base Price is required')
    .positive('Price must be greater than 0'),
  stock: yup
    .number()
    .transform(transformNumber)
    .required('Stock Quantity is required')
    .min(0, 'Stock must be 0 or greater')
    .integer('Stock must be an integer'),
  discountPercentage: yup
    .number()
    .transform(transformNumber)
    .nullable()
    .optional()
    .min(0, 'Discount must be between 0 and 99')
    .max(99, 'Discount must be between 0 and 99'),
  variations: yup
    .array()
    .of(variationSchema)
    .optional()
    .test('unique-sku', 'Duplicate SKU codes are not allowed', (variations) => {
      if (!variations || variations.length === 0) return true;
      const skus = variations
        .map((v) => v.sku?.trim().toUpperCase())
        .filter(Boolean);
      return skus.length === new Set(skus).size;
    }),
});

export const step3Schema = yup.object().shape({
  weight: yup
    .number()
    .transform(transformNumber)
    .required('Weight is required')
    .positive('Weight must be greater than 0'),
  dimensions: yup.object().shape({
    width: yup
      .number()
      .transform(transformNumber)
      .required('Width is required')
      .positive('Width must be greater than 0'),
    height: yup
      .number()
      .transform(transformNumber)
      .required('Height is required')
      .positive('Height must be greater than 0'),
    depth: yup
      .number()
      .transform(transformNumber)
      .required('Depth is required')
      .positive('Depth must be greater than 0'),
  }),
  requiresFragileHandling: yup.boolean().default(false),
  hazardousMaterialDisclaimer: yup.boolean().when('requiresFragileHandling', {
    is: true,
    then: (schema) =>
      schema.oneOf([true], 'You must accept the fragile material disclaimer'),
    otherwise: (schema) => schema.optional(),
  }),
  specialShippingNotes: yup.string().when('requiresFragileHandling', {
    is: true,
    then: (schema) =>
      schema
        .required('Special shipping notes are required when fragile handling is enabled')
        .min(10, 'Shipping notes must be at least 10 characters'),
    otherwise: (schema) => schema.optional(),
  }),
});

export const fullProductSchema = yup
  .object()
  .shape({})
  .concat(step1Schema)
  .concat(step2Schema)
  .concat(step3Schema);
