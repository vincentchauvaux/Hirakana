import { useState } from "react";
import Header from "./components/Header";
import ScriptSelector from "./components/ScriptSelector";
import CharacterDisplay from "./components/CharacterDisplay";
import AnswerGrid from "./components/AnswerGrid";
import AnswerInput from "./components/AnswerInput";
import FeedbackResult from "./components/FeedbackResult";
import ProgressBar from "./components/ProgressBar";
import CompletionScreen from "./components/CompletionScreen";
import SettingsPanel from "./components/SettingsPanel";
import { useQuizGame } from "./hooks/useQuizGame";
import { usePreferences } from "./hooks/usePreferences";

export default function App() {
  const { preferences, updatePreferences } = usePreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    currentScript,
    currentCharacter,
    questionId,
    phase,
    answers,
    answerFeedback,
    currentLevel,
    rowLabel,
    levelProgress,
    isComplete,
    masteredCount,
    unlockedCount,
    totalCharacters,
    topMistakes,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
    resetAllProgress,
  } = useQuizGame(preferences.answerCount, preferences.quizMode);

  const hasProgress =
    currentLevel > 0 || masteredCount > 0 || isComplete;

  const handleResetScript = (script: typeof currentScript) => {
    resetScriptProgress(script);
    if (script === currentScript) setSettingsOpen(false);
  };

  const handleResetAll = () => {
    resetAllProgress();
    setSettingsOpen(false);
  };

  const showQuestion =
    currentCharacter && (phase === "asking" || phase === "feedback");

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 sm:py-10 flex flex-col items-center overflow-x-hidden">
      <Header
        showReset={hasProgress}
        onReset={() => resetScriptProgress(currentScript)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <ScriptSelector
        currentScript={currentScript}
        onScriptChange={handleScriptChange}
      />

      {isComplete ? (
        <CompletionScreen
          script={currentScript}
          totalCharacters={totalCharacters}
          onReset={() => resetScriptProgress(currentScript)}
          onSwitchScript={() =>
            handleScriptChange(
              currentScript === "hiragana" ? "katakana" : "hiragana"
            )
          }
        />
      ) : (
        <>
          <ProgressBar
            progress={levelProgress}
            label={rowLabel ?? "Niveau"}
            detail={`${masteredCount} / ${unlockedCount}`}
          />

          {showQuestion ? (
            <div
              key={questionId}
              className="w-full max-w-md flex flex-col items-center"
            >
              <CharacterDisplay character={currentCharacter} />
              {phase === "feedback" && answerFeedback ? (
                <FeedbackResult
                  feedback={answerFeedback}
                  correctAnswer={currentCharacter.romaji}
                />
              ) : preferences.quizMode === "text" ? (
                <AnswerInput
                  onSubmit={handleAnswerSelect}
                  answerFeedback={null}
                  correctAnswer={currentCharacter.romaji}
                  disabled={false}
                />
              ) : (
                <AnswerGrid
                  answers={answers}
                  onAnswerSelect={handleAnswerSelect}
                  disabled={false}
                  questionId={questionId}
                />
              )}
            </div>
          ) : (
            <p className="text-slate-400">Chargement…</p>
          )}
        </>
      )}

      <SettingsPanel
        open={settingsOpen}
        preferences={preferences}
        currentScript={currentScript}
        topMistakes={topMistakes}
        onClose={() => setSettingsOpen(false)}
        onUpdatePreferences={updatePreferences}
        onResetScript={handleResetScript}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
