// ~/Projects/movfoo/components/quiz/QuizEngine.tsx
'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Question as FullQuestion } from "@/components/quiz/types";

type LegacyQuestion = {
  key: string;
  prompt: string;
  options: string[];
};

type QuestionWrapper = FullQuestion | LegacyQuestion;

type ResultItem = {
  title: string;
  synopsis?: string;
  poster_url?: string;
  rating?: number;
  name?: string;
  prep_time?: string;
  description?: string;
};

type Props = {
  quizType: "movie" | "food" | "pairing" | "tv";
  questions: QuestionWrapper[];
  autoAdvanceToNextSlug?: string;
};

export default function QuizEngine({ quizType, questions, autoAdvanceToNextSlug }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Normalizer: turn either FullQuestion or LegacyQuestion into FullQuestion
  const normalize = (q: QuestionWrapper): FullQuestion => {
    if ("type" in q && "id" in q) {
      // already full shape
      return q as FullQuestion;
    }
    // legacy shape → full single-choice question
    const legacy = q as LegacyQuestion;
    return {
      id: legacy.key,
      label: legacy.prompt,
      apiField: legacy.key,
      type: "single",
      options: legacy.options.map((opt) => ({
        value: opt,
        label: opt,
      })),
    };
  };

  const raw = questions[step];
  const question = normalize(raw);
  const storageKey = `quiz_answers_${quizType}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setAnswers(JSON.parse(stored));
  }, [storageKey]);

  const saveAnswer = async (value: any) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    localStorage.setItem(storageKey, JSON.stringify(next));

    setLoading(true);
    try {
      const res = await axios.post(`/v1/quiz/${quizType}/submit`, {
        sessionId,
        questionKey: question.id,
        answerValue: value,
      });
      setSessionId(res.data.sessionId);

      if (autoAdvanceToNextSlug) {
        router.push(autoAdvanceToNextSlug);
        return;
      }
      if (step + 1 < questions.length) {
        setStep((s) => s + 1);
      } else {
        setResults(res.data.results);
      }
    } catch (err) {
      console.error("Quiz submit failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Your {quizType} recommendations:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((item, i) => (
            <div key={i} className="p-4 border rounded-lg shadow">
              {item.poster_url && (
                <img
                  src={item.poster_url}
                  alt={item.title || item.name}
                  className="w-full h-auto rounded"
                />
              )}
              <h3 className="text-lg font-semibold mt-2">
                {item.title || item.name}
              </h3>
              {(item.synopsis || item.description) && (
                <p className="text-sm text-gray-600">
                  {item.synopsis || item.description}
                </p>
              )}
              {item.rating && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⭐ Rating: {item.rating}/10
                </p>
              )}
              {item.prep_time && (
                <p className="text-xs text-teal-600 mt-1">
                  ⏱️ Prep Time: {item.prep_time}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderField = () => {
    if (question.type === "single" && question.options) {
      return (
        <div className="grid gap-4">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => saveAnswer(opt.value)}
              disabled={loading}
              className="w-full py-3 px-4 border rounded-lg bg-white hover:bg-gray-50 text-left"
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    if (question.type === "multi" && question.options) {
      const selected: string[] = answers[question.id] || [];
      const toggle = (value: string) => {
        const next = selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value];
        saveAnswer(next);
      };

      return (
        <div className="grid gap-4">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`w-full py-3 px-4 border rounded-lg text-left ${
                selected.includes(opt.value) ? "bg-blue-100" : "bg-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    if (question.type === "range" && question.rangeConfig) {
      const value = answers[question.id] ?? question.rangeConfig.min;
      return (
        <div className="text-center">
          <input
            type="range"
            min={question.rangeConfig.min}
            max={question.rangeConfig.max}
            step={question.rangeConfig.step}
            value={value}
            onChange={(e) => saveAnswer(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-2">Selected: {value}</div>
        </div>
      );
    }

    return <p className="text-red-500">Unsupported question type</p>;
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">{question.label}</h2>
      {renderField()}
      <div className="text-sm text-gray-500 mt-6">
        Question {step + 1} of {questions.length}
      </div>
    </div>
  );
}

