import { useState } from 'react';
import './App.css';
import { useQuestions } from './hooks/useQuestions';
import Results from './components/Results';

function App() {
  const { questions = [], loading, error } = useQuestions();
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const currentQuestion = questions?.[currentQuestionIndex];
  const allAnswered = currentQuestionIndex >= questions.length;

  const handleAnswer = (value) => {
    if (!currentQuestion) return;

    const field = currentQuestion.field;
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
    setSelected(null); // reset selection for next question

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 300); // UX delay
  };

  return (
    <div className="app">
      <h1>🎬 What should I watch?</h1>

      {loading && <p>Loading quiz...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && questions.length > 0 && !allAnswered && currentQuestion && (
        <div className="quiz-box">
          <h2>{currentQuestion.question_text}</h2>
          {currentQuestion.choices.map((choice) => (
            <div key={choice.value} className="choice">
              <label>
                <input
                  type="radio" // 🔧 Force proper input behavior
                  name={currentQuestion.field}
                  value={choice.value}
                  checked={selected === choice.value}
                  onChange={() => {
                    setSelected(choice.value);
                    handleAnswer(choice.value);
                  }}
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

