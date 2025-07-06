"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Question = {
  key: string;
  prompt: string;
  options: string[];
};

type ResultItem = {
  title: string;
  synopsis?: string;
  poster_url?: string;
  rating?: number;
  name?: string; // for recipes
  prep_time?: string;
  description?: string;
};

type Props = {
  quizType: "movie" | "food" | "pairing";
  questions: Question[];
  autoAdvanceToNextSlug?: string;
};

export default function QuizEngine({ quizType, questions, autoAdvanceToNextSlug }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const current = questions[step];

  const handleAnswer = async (value: string) => {
    const nextAnswers = { ...answers, [current.key]: value };
    setAnswers(nextAnswers);
    setLoading(true);

    try {
      const res = await axios.post(`/v1/quiz/${quizType}/submit`, {
        sessionId,
        questionKey: current.key,
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
                <img src={item.poster_url} alt={item.title || item.name} className="w-full h-auto rounded" />
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

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">{current.prompt}</h2>
      <div className="grid gap-4">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={loading}
            className="w-full py-3 px-4 border rounded-lg bg-white hover:bg-gray-50 text-left"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 mt-6">
        Question {step + 1} of {questions.length}
      </div>
    </div>
  );
}

