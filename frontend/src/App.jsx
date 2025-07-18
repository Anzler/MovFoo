// frontend/src/App.jsx

import { useState } from 'react';
import './App.css';

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

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.field]: value });

    // Next question or done
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('Final answers:', answers);
      // Future: call backend with answers
    }
  };

  return (
    <div className="app">
      <h1>🎬 What should I watch?</h1>
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
    </div>
  );
}

export default App;

