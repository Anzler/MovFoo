// components/quiz/ResultsInner.tsx
import React from "react";

export type Movie = {
  id: string;
  title: string;
  synopsis: string;
  poster_url: string;
  rating: number;
  source: string;
};

type Props = {
  results: Movie[];
};

export default function ResultsInner({ results }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {results.map((movie) => (
        <div
          key={movie.id}
          className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">{movie.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{movie.synopsis}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>⭐ {movie.rating}</span>
              <span>{movie.source}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

