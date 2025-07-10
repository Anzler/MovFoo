// ~/Projects/movfoo/components/quiz/QuizStepper.tsx
'use client';

import { useState } from 'react';

type Option = { value: string; label: string };

type StepConfig = {
  id: string;
  label: string;
  type: 'single' | 'multi' | 'range';
  apiField: string;
  options?: Option[];
  rangeConfig?: { min: number; max: number; step: number };
  required?: boolean;
};

type Props = {
  steps: StepConfig[];
  onComplete: (answers: Record<string, any>) => void;
  title?: string;
};

export default function QuizStepper({ steps, onComplete, title = 'Quiz' }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleAnswer = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [step.id]: value,
    }));
  };

  const handleNext = () => {
    if (!step.required || answers[step.id]) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const handleSurprise = () => {
    // Optional: implement logic to pick random values
    onComplete(answers);
  };

  const renderField = () => {
    if (step.type === 'single' && step.options) {
      return (
        <div className="space-y-2">
          {step.options.map((opt) => (
            <label key={opt.value} className="block">
              <input
                type="radio"
                name={step.id}
                value={opt.value}
                checked={answers[step.id] === opt.value}
                onChange={() => handleAnswer(opt.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
      );
    }

    if (step.type === 'multi' && step.options) {
      const selected: string[] = answers[step.id] || [];
      const toggle = (value: string) => {
        if (selected.includes(value)) {
          handleAnswer(selected.filter((v) => v !== value));
        } else {
          handleAnswer([...selected, value]);
        }
      };
      return (
        <div className="space-y-2">
          {step.options.map((opt) => (
            <label key={opt.value} className="block">
              <input
                type="checkbox"
                value={opt.value}
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
      );
    }

    if (step.type === 'range' && step.rangeConfig) {
      const value = answers[step.id] ?? step.rangeConfig.min;
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={step.rangeConfig.min}
            max={step.rangeConfig.max}
            step={step.rangeConfig.step}
            value={value}
            onChange={(e) => handleAnswer(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600">
            Selected: {value}
          </div>
        </div>
      );
    }

    return <p className="text-red-500">Unsupported question type</p>;
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
      <h2 className="text-lg font-semibold mb-2">{step.label}</h2>

      {renderField()}

      <div className="flex justify-between items-center mt-6">
        {!isFirst && (
          <button onClick={handleBack} className="text-sm text-gray-500 hover:underline">
            ← Back
          </button>
        )}

        <div className="space-x-4">
          <button
            onClick={handleSurprise}
            className="text-sm bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded"
          >
            🎲 Surprise Me
          </button>
          {isLast ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

