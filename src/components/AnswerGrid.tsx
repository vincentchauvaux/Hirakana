import type { AnswerFeedback } from "../types";

interface AnswerGridProps {
  answers: string[];
  onAnswerSelect: (answer: string) => void;
  answerFeedback: AnswerFeedback;
  disabled: boolean;
  questionId: number;
  compact?: boolean;
  kanaChoices?: boolean;
}

export default function AnswerGrid({
  answers,
  onAnswerSelect,
  answerFeedback,
  disabled,
  questionId,
  compact = false,
  kanaChoices = false,
}: AnswerGridProps) {
  return (
    <div className={`grid grid-cols-2 w-full max-w-md ${compact ? "gap-2" : "gap-3"}`}>
      {answers.map((answer) => {
        const isFeedbackTarget = answerFeedback?.answer === answer;
        const isCorrect = isFeedbackTarget && answerFeedback.status === "correct";
        const isWrong = isFeedbackTarget && answerFeedback.status === "wrong";

        let className = `text-center rounded-xl font-medium outline-none border-2 bg-slate-800 transition-colors ${
          compact
            ? kanaChoices
              ? "py-2 text-2xl"
              : "py-2.5 text-sm"
            : kanaChoices
              ? "py-3 text-3xl"
              : "py-3.5"
        } `;

        if (isCorrect) {
          className += "border-emerald-500";
        } else if (isWrong) {
          className += "border-rose-500";
        } else {
          className +=
            "border-transparent [@media(hover:hover)]:hover:bg-slate-700 active:scale-[0.98] disabled:opacity-60";
        }

        return (
          <button
            key={`${questionId}-${answer}`}
            type="button"
            className={className}
            onClick={() => onAnswerSelect(answer)}
            disabled={disabled}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
}
