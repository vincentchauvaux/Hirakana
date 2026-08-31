interface AnswerGridProps {
  answers: string[];
  onAnswerSelect: (answer: string) => void;
  disabled: boolean;
  questionId: number;
}

export default function AnswerGrid({
  answers,
  onAnswerSelect,
  disabled,
  questionId,
}: AnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      {answers.map((answer) => (
        <button
          key={`${questionId}-${answer}`}
          type="button"
          className="py-4 text-center rounded-xl font-medium outline-none bg-slate-800 [@media(hover:hover)]:hover:bg-slate-700 active:scale-[0.98] disabled:opacity-60 transition-colors"
          onClick={() => onAnswerSelect(answer)}
          disabled={disabled}
        >
          {answer}
        </button>
      ))}
    </div>
  );
}
