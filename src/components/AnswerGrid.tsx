import type { AnswerFeedback } from "../types";

interface AnswerGridProps {
  answers: string[];
  onAnswerSelect: (answer: string) => void;
  answerFeedback: AnswerFeedback;
  disabled: boolean;
  questionId: number;
}

export default function AnswerGrid({
  answers,
  onAnswerSelect,
  answerFeedback,
  disabled,
  questionId,
}: AnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      {answers.map((answer) => {
        const isFeedbackTarget = answerFeedback?.answer === answer;
        const isCorrect = isFeedbackTarget && answerFeedback.status === "correct";
        const isWrong = isFeedbackTarget && answerFeedback.status === "wrong";

        let className =
          "py-4 text-center rounded-xl font-medium outline-none border-2 bg-slate-800 transition-colors ";

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
            disabled={disabled || answerFeedback !== null}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
}
