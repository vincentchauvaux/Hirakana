import { useState } from "react";
import Header from "./components/Header";
import ScriptSelector from "./components/ScriptSelector";
import CharacterDisplay from "./components/CharacterDisplay";
import AnswerGrid from "./components/AnswerGrid";
import AnswerInput from "./components/AnswerInput";
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
    totalLevels,
    levelProgress,
    isComplete,
    masteredCount,
    rowMasteredCount,
    rowCount,
    totalCharacters,
    topMistakes,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
    resetAllProgress,
  } = useQuizGame(
    preferences.answerCount,
    preferences.quizMode,
    preferences.maxAppearances
  );

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
  const compactQuiz = preferences.answerCount >= 8;

  return (
    <div
      className={`min-h-screen bg-slate-900 text-white flex flex-col items-center overflow-x-hidden ${
        compactQuiz ? "px-3 py-3 sm:py-6" : "px-4 py-6 sm:py-10"
      }`}
    >
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
          <div className={compactQuiz ? "mb-3 w-full max-w-md" : "mb-6 w-full max-w-md"}>
            <ProgressBar
              progress={levelProgress}
              label={rowLabel ?? "Niveau"}
              detail={`${rowMasteredCount} / ${rowCount}`}
              subdetail={`Niveau ${currentLevel + 1} / ${totalLevels} · ${masteredCount} / ${totalCharacters} caractères`}
            />
          </div>

          {showQuestion ? (
            <div className="w-full max-w-md flex flex-col items-center">
              <CharacterDisplay
                character={currentCharacter}
                compact={compactQuiz}
              />
              {preferences.quizMode === "text" ? (
                <AnswerInput
                  onSubmit={handleAnswerSelect}
                  answerFeedback={answerFeedback}
                  correctAnswer={currentCharacter.romaji}
                  disabled={phase === "feedback"}
                />
              ) : (
                <AnswerGrid
                  answers={answers}
                  onAnswerSelect={handleAnswerSelect}
                  answerFeedback={answerFeedback}
                  disabled={phase === "feedback"}
                  questionId={questionId}
                  compact={compactQuiz}
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
