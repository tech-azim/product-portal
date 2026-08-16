'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  PackagePlus,
} from 'lucide-react';
import Header from '@/components/common/Header';
import ToastContainer from '@/components/common/ToastContainer';
import DraftPrompt from '@/components/wizard/DraftPrompt';
import Step1BasicInfo from '@/components/wizard/Step1BasicInfo';
import Step2PricingVariations from '@/components/wizard/Step2PricingVariations';
import Step3ShippingFragile from '@/components/wizard/Step3ShippingFragile';
import Step4Review from '@/components/wizard/Step4Review';
import Step from '@/components/ui/Step';
import Button from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  updateDraft,
  clearDraft,
  addToast,
} from '@/lib/redux/slices/productSlice';
import {
  useAddProductMutation,
} from '@/lib/redux/api/productsApi';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  fullProductSchema,
} from '@/lib/validation/productSchema';
import { ProductFormData } from '@/lib/types/product';

const defaultFormValues: ProductFormData = {
  title: '',
  brand: '',
  category: '',
  description: '',
  price: undefined as unknown as number,
  stock: undefined as unknown as number,
  discountPercentage: undefined,
  variations: [],
  weight: undefined as unknown as number,
  dimensions: {
    width: undefined as unknown as number,
    height: undefined as unknown as number,
    depth: undefined as unknown as number,
  },
  requiresFragileHandling: false,
  hazardousMaterialDisclaimer: false,
  specialShippingNotes: '',
};

const getMutableDraftValues = (draft: Record<string, unknown> | undefined): ProductFormData => {
  if (!draft || Object.keys(draft).length === 0) return defaultFormValues;
  try {
    return JSON.parse(JSON.stringify({ ...defaultFormValues, ...draft }));
  } catch {
    return defaultFormValues;
  }
};

export default function NewProductWizardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { draftData, draftStep } = useAppSelector((state) => state.product);

  const [addProduct, { isLoading: isSubmitting }] = useAddProductMutation();

  const methods = useForm<ProductFormData>({
    resolver: yupResolver(step1Schema) as unknown as Resolver<ProductFormData>,
    mode: 'onTouched',
    defaultValues: getMutableDraftValues(draftData as Record<string, unknown>),
  });

  const { getValues, reset, setError, clearErrors, handleSubmit } = methods;

  useEffect(() => {
    if (draftData && Object.keys(draftData).length > 0) {
      reset(getMutableDraftValues(draftData as Record<string, unknown>));
    }
  }, [draftData, reset]);

  const getStepSchema = (step: number) => {
    switch (step) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return fullProductSchema;
      default:
        return step1Schema;
    }
  };

  const saveToReduxDraft = (values: ProductFormData, stepTarget?: number) => {
    const cloned = JSON.parse(JSON.stringify(values));
    dispatch(updateDraft({ stepData: cloned, step: stepTarget ?? draftStep }));
  };

  const handleNextStep = async () => {
    clearErrors();
    const currentValues = getValues();
    const currentSchema = getStepSchema(draftStep);

    try {
      await currentSchema.validate(currentValues, { abortEarly: false });
      const nextStep = Math.min(draftStep + 1, 4);
      saveToReduxDraft(currentValues, nextStep);
    } catch (err: unknown) {
      const yupErr = err as { inner?: Array<{ path?: string; message: string }> };
      if (yupErr.inner && Array.isArray(yupErr.inner)) {
        yupErr.inner.forEach((validationError) => {
          if (validationError.path) {
            setError(validationError.path as keyof ProductFormData, {
              type: 'manual',
              message: validationError.message,
            });
          }
        });
      }
    }
  };

  const handlePrevStep = () => {
    const currentValues = getValues();
    const prevStep = Math.max(draftStep - 1, 1);
    saveToReduxDraft(currentValues, prevStep);
  };

  const handleGoToStep = (step: number) => {
    const currentValues = getValues();
    saveToReduxDraft(currentValues, step);
  };

  const handleFinalSubmit = async (data: ProductFormData) => {
    // Strictly execute REST API call ONLY when triggered on Step 4
    if (draftStep !== 4) {
      return;
    }

    try {
      await fullProductSchema.validate(data, { abortEarly: false });
      const payload = {
        title: data.title,
        brand: data.brand,
        category: data.category,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        discountPercentage: data.discountPercentage ? Number(data.discountPercentage) : 0,
        weight: Number(data.weight),
        dimensions: {
          width: Number(data.dimensions.width),
          height: Number(data.dimensions.height),
          depth: Number(data.dimensions.depth),
        },
        thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
        images: ['https://cdn.dummyjson.com/product-images/1/1.jpg'],
        variations: data.variations,
        requiresFragileHandling: data.requiresFragileHandling,
        hazardousMaterialDisclaimer: data.hazardousMaterialDisclaimer,
        specialShippingNotes: data.specialShippingNotes,
      };

      await addProduct(payload).unwrap();
      dispatch(clearDraft());
      dispatch(addToast({ message: 'Product created successfully!', type: 'success' }));
      router.push('/products');
    } catch (err: unknown) {
      const yupErr = err as { inner?: Array<{ path?: string; message: string }>; data?: { message?: string } };
      if (yupErr.inner && Array.isArray(yupErr.inner)) {
        yupErr.inner.forEach((validationError) => {
          if (validationError.path) {
            setError(validationError.path as keyof ProductFormData, {
              type: 'manual',
              message: validationError.message,
            });
          }
        });
      } else {
        dispatch(
          addToast({
            message: yupErr?.data?.message || 'Failed to submit product onboarding form.',
            type: 'error',
          })
        );
      }
    }
  };

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Pricing & SKUs' },
    { number: 3, label: 'Shipping & Logistics' },
    { number: 4, label: 'Review & Submit' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg text-navy-900 flex flex-col font-sans">
      <Header />
      <ToastContainer />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Link & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/products"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center space-x-3">
              <PackagePlus className="w-7 h-7 text-brand-500" />
              <span>Add New Product</span>
            </h1>
          </div>
        </div>

        {/* Draft Resume Banner */}
        <DraftPrompt />

        {/* Wizard Stepper Component */}
        <Step
          steps={steps}
          currentStep={draftStep}
          onStepClick={handleGoToStep}
        />

        {/* Wizard Form Component */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <Form
            methods={methods}
            onSubmit={() => {
              // No-op for automatic form submit; explicit onClick handler triggers handleFinalSubmit on Step 4
            }}
            className="space-y-8"
          >
            {/* Dynamic Step Content */}
            {draftStep === 1 && <Step1BasicInfo />}
            {draftStep === 2 && <Step2PricingVariations />}
            {draftStep === 3 && <Step3ShippingFragile />}
            {draftStep === 4 && <Step4Review onGoToStep={handleGoToStep} />}

            {/* Navigation Controls */}
            <div className="pt-6 border-t border-surface-border flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevStep}
                disabled={draftStep === 1 || isSubmitting}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              {draftStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="success"
                  isLoading={isSubmitting}
                  onClick={handleSubmit(handleFinalSubmit)}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Submit Product
                </Button>
              )}
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
