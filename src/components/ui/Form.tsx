'use client';

import React, { createContext, useContext, useId } from 'react';
import {
  useFormContext,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
} from 'react-hook-form';

interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  methods: UseFormReturn<TFieldValues>;
  onSubmit?: (data: TFieldValues) => void;
  children: React.ReactNode;
}

export function Form<TFieldValues extends FieldValues>({
  methods,
  onSubmit,
  children,
  className = '',
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}
        className={className}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  };
};

export function FormItem({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={`space-y-1.5 w-full ${className}`.trim()} {...props}>
        {children}
      </div>
    </FormItemContext.Provider>
  );
}

export function FormLabel({
  className = '',
  required = false,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  const { error, formItemId } = useFormField();

  return (
    <label
      htmlFor={formItemId}
      className={`block text-xs font-bold ${
        error ? 'text-[#EF144A]' : 'text-[#212121]'
      } ${className}`.trim()}
      {...props}
    >
      {children} {required && <span className="text-[#EF144A]">*</span>}
    </label>
  );
}

export function FormControl({ children }: { children: React.ReactNode }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <div
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
    >
      {children}
    </div>
  );
}

export function FormDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField();

  return (
    <p id={formDescriptionId} className={`text-xs text-[#6C727C] ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function FormMessage({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) return null;

  return (
    <p id={formMessageId} className={`text-xs font-semibold text-[#EF144A] animate-fadeIn ${className}`.trim()} {...props}>
      {body}
    </p>
  );
}
