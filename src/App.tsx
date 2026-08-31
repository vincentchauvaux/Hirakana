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

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 sm:py-10 flex flex-col items-center">
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

          {currentCharacter ? (
            <>
              <CharacterDisplay
                key={`${currentScript}-${currentCharacter.char}`}
                character={currentCharacter}
              />
              {preferences.quizMode === "text" ? (
                <AnswerInput
                  key={`${currentScript}-${currentCharacter.char}`}
                  onSubmit={handleAnswerSelect}
                  answerFeedback={answerFeedback}
                  correctAnswer={currentCharacter.romaji}
                  disabled={answerFeedback !== null}
                />
              ) : (
                <AnswerGrid
                  key={`${currentScript}-${currentCharacter.char}`}
                  answers={answers}
                  onAnswerSelect={handleAnswerSelect}
                  answerFeedback={answerFeedback}
                  disabled={answerFeedback !== null}
                />
              )}
            </>
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
