import { useState } from 'react';
import './App.css';
import { useQuestions } from './hooks/useQuestions';
import Results from './components/Results';

function App() {
  const { questions = [], loading, error } = useQuestions();
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];
  const allAnswered = currentQuestionIndex >= questions.length;

  const handleAnswer = (value) => {
    if (!currentQuestion || isAnswered) return;

    setIsAnswered(true);
    setSelected(value);

    const field = currentQuestion.field;
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => {
        const next = prev + 1;
        return next < questions.length ? next : prev;
      });
      setSelected(null);
      setIsAnswered(false);
    }, 300);
  };

  const progressPercent =
    questions.length > 0
      ? Math.min((currentQuestionIndex / questions.length) * 100, 100)
      : 0;

  return (
    <div className="app">
      <h1>🎬 What should I watch?</h1>

      {loading && <p>Loading quiz...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && questions.length > 0 && !allAnswered && currentQuestion && (
        <div className="quiz-box">
          {/* ✅ Progress bar */}
          <div className="progress-container" aria-label="Quiz Progress">
            <div
              className="progress-bar"
              style={{ width: `${progressPercent}%` }}
            ></div>
            <p className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          <h2>{currentQuestion.question_text}</h2>
          {currentQuestion.choices.map((choice) => (
            <div key={choice.value} className="choice">
              <label>
                <input
                  type="radio"
                  name={currentQuestion.field}
                  value={choice.value}
                  checked={selected === choice.value}
                  onChange={() => handleAnswer(choice.value)}
                />
                {choice.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {!loading && questions.length > 0 && allAnswered && (
        <Results answers={answers} />
      )}
    </div>
  );
}

export default App;

