export const tvQuizSteps = [
  {
    id: "with_genres",
    type: "multi-select",
    question: "Which TV genres do you enjoy?",
    options: [
      { value: "18", label: "Drama" },
      { value: "35", label: "Comedy" },
      { value: "10765", label: "Sci-Fi & Fantasy" },
      { value: "80", label: "Crime" },
      { value: "99", label: "Documentary" },
    ],
  },
  {
    id: "primary_release_year",
    type: "slider",
    question: "What's your preferred starting decade?",
    min: 1980,
    max: new Date().getFullYear(),
    step: 1,
  },
  {
    id: "with_original_language",
    type: "single-select",
    question: "Choose your preferred language",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "ko", label: "Korean" },
      { value: "ja", label: "Japanese" },
    ],
  },
  {
    id: "vote_average.gte",
    type: "slider",
    question: "Minimum rating?",
    min: 0,
    max: 10,
    step: 0.5,
  },
  {
    id: "with_watch_providers",
    type: "multi-select",
    question: "Available on which streaming services?",
    options: [
      { value: "8", label: "Netflix" },
      { value: "119", label: "Amazon Prime" },
      { value: "337", label: "Disney+" },
      { value: "384", label: "Hulu" },
    ],
  },
  {
    id: "audience",
    type: "single-select",
    question: "Who's watching?",
    options: [
      { value: "all", label: "Everyone" },
      { value: "kids", label: "Kids" },
      { value: "adults", label: "Adults" },
    ],
  },
];

