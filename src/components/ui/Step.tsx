import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  number: number;
  label: string;
  description?: string;
}

interface StepProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function Step({ steps, currentStep, onStepClick }: StepProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isClickable = onStepClick && step.number <= currentStep;

          return (
            <React.Fragment key={step.number}>
              {idx > 0 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-colors ${
                    step.number <= currentStep ? 'bg-[#E41522]' : 'bg-[#E2E4E8]'
                  }`}
                />
              )}

              <div
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none transition-all ${
                  isClickable ? 'hover:opacity-90' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-[#E41522] text-white'
                      : isActive
                      ? 'bg-[#E41522] text-white ring-4 ring-[#E41522]/20'
                      : 'bg-[#E2E4E8] text-[#637381]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-white" /> : step.number}
                </div>
                <div className="hidden md:block">
                  <p
                    className={`text-xs font-bold ${
                      isActive ? 'text-[#E41522]' : isCompleted ? 'text-[#0A192F]' : 'text-[#637381]'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
