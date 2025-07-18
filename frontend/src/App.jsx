import { useState } from 'react';
import './App.css';
import { useQuestions } from './hooks/useQuestions';
import Results from './components/Results';
import Nineties from './components/Nineties';

function App() {
  const search = new URLSearchParams(window.location.search);
  const decadeParam = search.get('decade');
  if (decadeParam === '1990') {
    return (
      <div className="app">
        <Nineties />
      </div>
    );
  }
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
        return next > questions.length ? questions.length : next;
      });
