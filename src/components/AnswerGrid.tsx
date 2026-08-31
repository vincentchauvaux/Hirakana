import type { AnswerFeedback } from "../types";

interface AnswerGridProps {
  answers: string[];
  onAnswerSelect: (answer: string) => void;
  answerFeedback: AnswerFeedback;
  disabled: boolean;
}

export default function AnswerGrid({
  answers,
  onAnswerSelect,
  answerFeedback,
  disabled,
}: AnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      {answers.map((answer) => {
        const isFeedbackTarget = answerFeedback?.answer === answer;
        const isCorrect = isFeedbackTarget && answerFeedback.status === "correct";
        const isWrong = isFeedbackTarget && answerFeedback.status === "wrong";

        let className =
          "py-4 text-center rounded-xl transition-colors font-medium outline-none ";

        if (isCorrect) {
          className += "bg-emerald-500 text-white scale-[1.02]";
        } else if (isWrong) {
          className += "bg-rose-500 text-white";
        } else {
          className +=
            "bg-slate-800 [@media(hover:hover)]:hover:bg-slate-700 active:scale-[0.98] disabled:opacity-60";
        }

        return (
          <button
            key={answer}
            type="button"
            className={className}
            onClick={() => onAnswerSelect(answer)}
            disabled={disabled || answerFeedback !== null}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
}
