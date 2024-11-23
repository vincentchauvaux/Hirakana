import React from "react";

const AnswerGrid = ({
  answers,
  onAnswerSelect,
  selectedAnswer,
  correctAnswer,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {answers.map((answer, index) => {
        const isSelected = selectedAnswer === answer;
        const isCorrect = isSelected && answer === correctAnswer;
        const backgroundColor = isSelected
          ? isCorrect
            ? "bg-green-500 hover:bg-green-500"
            : "bg-red-500 hover:bg-red-500"
          : "bg-slate-800";

        return (
          <button
            key={index}
            className={`py-4 text-center rounded-lg hover:bg-slate-700 transition-colors ${backgroundColor}`}
            onClick={() => onAnswerSelect(answer)}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
};

export default AnswerGrid;
