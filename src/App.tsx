import Header from "./components/Header";
import ScriptSelector from "./components/ScriptSelector";
import CharacterDisplay from "./components/CharacterDisplay";
import AnswerGrid from "./components/AnswerGrid";
import ProgressBar from "./components/ProgressBar";
import CompletionScreen from "./components/CompletionScreen";
import { useQuizGame } from "./hooks/useQuizGame";

export default function App() {
  const {
    currentScript,
    currentCharacter,
    answers,
    selectedAnswer,
    currentLevel,
    rowLabel,
    levelProgress,
    isComplete,
    masteredCount,
    unlockedCount,
    totalCharacters,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
  } = useQuizGame();

  const hasProgress =
    currentLevel > 0 || masteredCount > 0 || isComplete;

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 sm:py-10 flex flex-col items-center">
      <Header
        showReset={hasProgress}
        onReset={() => resetScriptProgress(currentScript)}
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
              <CharacterDisplay character={currentCharacter} />
              <AnswerGrid
                answers={answers}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentCharacter.romaji}
                disabled={selectedAnswer !== null}
              />
            </>
          ) : (
            <p className="text-slate-400">Chargement…</p>
          )}
        </>
      )}
    </div>
  );
}
