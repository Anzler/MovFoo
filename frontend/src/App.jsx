// frontend/src/App.jsx

import { useState } from 'react';
import './App.css';
import Results from './components/Results';

const mockQuestions = [
  {
    id: 1,
    field: 'release_date',
    question_text: 'What decade is your movie from?',
    input_type: 'radio',
    choices: [
      { label: '1980s', value: '1980' },
      { label: '1990s', value: '1990' },
      { label: '2000s', value: '2000' },
      { label: 'Any', value: 'any' }
    ]
  },
  {
    id: 2,
    field: 'theme',
    question_text: 'What primary theme does your movie have?',
    input_type: 'radio',
    choices: [
      { label: 'Adventure', value: 'Adventure' },
      { label: 'Drama', value: 'Drama' },
      { label: 'Comedy', value: 'Comedy' },
      { label: 'Any', value: 'any' }
    ]
  }
];

function App() {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const allQuestionsAnswered = currentQuestionIndex >= mockQuestions.length;

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion.field]: value };
    setAnswers(newAnswers);

    // Move to next question
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="app">
      <h1>🎬 What should I watch?</h1>

      {!allQuestionsAnswered && (
        <div className="quiz-box">
          <h2>{currentQuestion.question_text}</h2>
          {currentQuestion.choices.map((choice) => (
            <div key={choice.value} className="choice">
              <label>
                <input
                  type="radio"
                  name={currentQuestion.field}
                  value={choice.value}
                  onChange={() => handleAnswer(choice.value)}
                />
                {choice.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Show results when quiz is finished */}
      {allQuestionsAnswered && <Results answers={answers} />}
    </div>
  );
}

export default App;

