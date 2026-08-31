import type { AnswerFeedback } from "../types";

interface FeedbackResultProps {
  feedback: AnswerFeedback;
  correctAnswer: string;
}

export default function FeedbackResult({
  feedback,
  correctAnswer,
}: FeedbackResultProps) {
  if (!feedback) return null;

  const isCorrect = feedback.status === "correct";

  return (
    <div
      className={`w-full max-w-md py-6 px-4 rounded-xl text-center font-medium ${
        isCorrect
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
      }`}
      role="status"
      aria-live="polite"
    >
      {isCorrect ? (
        <p>Correct ! — {feedback.answer}</p>
      ) : (
        <p>
          Incorrect — vous avez répondu <strong>{feedback.answer}</strong>
          <br />
          <span className="text-sm opacity-90">
            Réponse attendue : {correctAnswer}
          </span>
        </p>
      )}
    </div>
  );
}
