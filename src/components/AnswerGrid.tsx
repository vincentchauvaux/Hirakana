interface AnswerGridProps {
  answers: string[];
  onAnswerSelect: (answer: string) => void;
  selectedAnswer: string | null;
  correctAnswer: string;
  disabled: boolean;
}

export default function AnswerGrid({
  answers,
  onAnswerSelect,
  selectedAnswer,
  correctAnswer,
  disabled,
}: AnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      {answers.map((answer) => {
        const isSelected = selectedAnswer === answer;
        const isCorrect = isSelected && answer === correctAnswer;
        const isWrong = isSelected && answer !== correctAnswer;

        let className =
          "py-4 text-center rounded-xl transition-all font-medium ";

        if (isCorrect) {
          className += "bg-emerald-500 text-white scale-[1.02]";
        } else if (isWrong) {
          className += "bg-rose-500 text-white";
        } else {
          className +=
            "bg-slate-800 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-60";
        }

        return (
          <button
            key={answer}
            type="button"
            className={className}
            onClick={() => onAnswerSelect(answer)}
            disabled={disabled || selectedAnswer !== null}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
}
