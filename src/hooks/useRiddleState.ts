import { useState, useEffect } from "react";

const STORAGE_KEY = "riddle_answers";

export const useRiddleState = () => {
  const [answers, setAnswers] = useState<Record<number, string[]>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const setRiddleAnswer = (riddleId: number, index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [riddleId]: prev[riddleId]
        ? prev[riddleId].map((v, i) => (i === index ? value : v))
        : index === 0 ? [value] : ["", value],
    }));
  };

  const initializeRiddle = (riddleId: number, type: string) => {
    if (!answers[riddleId]) {
      setAnswers((prev) => ({
        ...prev,
        [riddleId]: type === "dual_input" ? ["", ""] : [""],
      }));
    }
  };

  const clearAnswers = () => {
    setAnswers({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return { answers, setRiddleAnswer, initializeRiddle, clearAnswers };
};
