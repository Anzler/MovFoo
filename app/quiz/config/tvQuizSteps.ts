// ~/Projects/movfoo/app/quiz/config/tvQuizSteps.ts

export const tvQuizSteps = [
  {
    id: 'media_type',
    label: 'What are you looking for?',
    type: 'single',
    apiField: 'media_type',
    options: [
      { value: 'tv', label: 'TV Series 📺' }
    ],
    required: true
  },
  {
    id: 'genre',
    label: 'Choose your genre',
    type: 'multi',
    apiField: 'with_genres',
    options: [
      { value: '18', label: 'Drama' },
      { value: '35', label: 'Comedy' },
      { value: '10765', label: 'Sci-Fi & Fantasy' },
      { value: '16', label: 'Animation' },
      { value: '80', label: 'Crime' }
    ]
  },
  {
    id: 'episodes',
    label: 'Number of episodes?',
    type: 'range',
    apiField: 'number_of_episodes',
    rangeConfig: {
      min: 1,
      max: 200,
      step: 10
    }
  },
  {
    id: 'language',
    label: 'Language?',
    type: 'single',
    apiField: 'with_original_language',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'ja', label: 'Japanese' }
    ]
  },
  {
    id: 'status',
    label: 'Still airing or concluded?',
    type: 'single',
    apiField: 'status',
    options: [
      { value: 'Returning Series', label: 'Still airing' },
      { value: 'Ended', label: 'Concluded' }
    ]
  }
];

