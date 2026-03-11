"use client";

import { useEffect } from "react";

interface StepWrapperProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  onEnter?: () => void;
}

export function StepWrapper({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onEnter,
}: StepWrapperProps) {
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (!onEnter) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") onEnter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress bar sits right above the card */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-2 bg-black rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-base text-gray-500 mb-8 leading-relaxed">
              {description}
            </p>
          )}
          <div className="step-enter">{children}</div>
        </div>
      </div>
    </div>
  );
}
