// ~/Projects/movfoo/app/quiz/config/movieQuizSteps.ts

import type { Question } from "@/components/quiz/types";

export const movieQuizSteps: Question[] = [
  {
    id: 'media_type',
    label: 'What type of content are you looking for?',
    type: 'single',
    apiField: 'media_type',
    options: [
      { value: 'movie', label: 'Movie 🎬' },
      { value: 'tv', label: 'TV Show 📺' }
    ]
  },
  {
    id: 'genre',
    label: 'Pick a genre',
    type: 'multi',
    apiField: 'with_genres',
    options: [
      { value: '28', label: 'Action' },
      { value: '35', label: 'Comedy' },
      { value: '18', label: 'Drama' },
      { value: '27', label: 'Horror' },
      { value: '10749', label: 'Romance' },
      { value: '878', label: 'Sci-Fi' }
    ]
  },
  {
    id: 'decade',
    label: 'Choose a release decade',
    type: 'single',
    apiField: 'primary_release_year',
    options: [
      { value: '2020', label: '2020s' },
      { value: '2010', label: '2010s' },
      { value: '2000', label: '2000s' },
      { value: '1990', label: '1990s' },
      { value: '1980', label: '1980s' }
    ]
  },
  {
    id: 'language',
    label: 'Original language?',
    type: 'single',
    apiField: 'with_original_language',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' }
    ]
  },
  {
    id: 'rating',
    label: 'Minimum rating?',
    type: 'range',
    apiField: 'vote_average.gte',
    rangeConfig: {
      min: 5,
      max: 9,
      step: 0.5
    }
  },
  {
    id: 'streaming',
    label: 'Available on...',
    type: 'multi',
    apiField: 'with_watch_providers',
    options: [
      { value: '8', label: 'Netflix' },
      { value: '9', label: 'Amazon Prime' },
      { value: '337', label: 'Disney+' },
      { value: '15', label: 'Hulu' }
    ]
  }
];

