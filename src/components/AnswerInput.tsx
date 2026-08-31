import { useEffect, useState, type FormEvent } from "react";
import type { AnswerFeedback } from "../types";

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  answerFeedback: AnswerFeedback;
  correctAnswer: string;
  disabled: boolean;
}

export default function AnswerInput({
  onSubmit,
  answerFeedback,
  correctAnswer,
  disabled,
}: AnswerInputProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!answerFeedback) {
      setValue("");
    }
  }, [answerFeedback, correctAnswer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || answerFeedback) return;
    onSubmit(trimmed);
  };

  let inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-800 border-2 text-center text-lg font-medium outline-none transition-colors ";

  if (answerFeedback?.status === "correct") {
    inputClass += "border-emerald-500 text-white";
  } else if (answerFeedback?.status === "wrong") {
    inputClass += "border-rose-500 text-white";
  } else {
    inputClass += "border-slate-700 focus:border-sky-500";
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tapez la lecture (romaji)"
        className={inputClass}
        disabled={disabled || answerFeedback !== null}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Réponse en romaji"
      />
      {answerFeedback?.status === "wrong" && (
        <p className="text-sm text-center text-rose-300">
          Réponse attendue : <strong>{correctAnswer}</strong>
        </p>
      )}
      <button
        type="submit"
        disabled={!value.trim() || disabled || answerFeedback !== null}
        className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:hover:bg-sky-500 transition-colors font-medium"
      >
        Valider
      </button>
    </form>
  );
}
