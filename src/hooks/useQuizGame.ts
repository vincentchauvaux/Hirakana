import { useCallback, useEffect, useMemo, useState } from "react";
import { SCRIPTS, getAllRomaji } from "../data/characters";
import {
  DEFAULT_PROGRESS,
  ROW_LABELS,
  ROW_ORDER,
  type AnswerFeedback,
  type GameProgress,
  type KanaCharacter,
  type MistakeStats,
  type QuizMode,
  type ScriptId,
} from "../types";
import {
  clearAllMistakes,
  clearMistakesForScript,
  getTopMistakes,
  loadMistakes,
  recordMistake,
} from "../utils/mistakes";
import {
  calcLevelProgress,
  generateAnswers,
  getCurrentRow,
  getUnlockedCharacters,
  isRomajiMatch,
  pickWeightedCharacter,
} from "../utils/quiz";

const STORAGE_KEY = "hirakana-progress";

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: GameProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function blurActiveElement() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export function useQuizGame(
  answerCount: 4 | 6 = 6,
  quizMode: QuizMode = "choice"
) {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [mistakes, setMistakes] = useState<MistakeStats>(loadMistakes);
  const [currentScript, setCurrentScript] = useState<ScriptId>("hiragana");
  const [currentCharacter, setCurrentCharacter] = useState<KanaCharacter | null>(
    null
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback>(null);
  const [isLocked, setIsLocked] = useState(false);

  const scriptData = SCRIPTS[currentScript];
  const scriptProgress = progress[currentScript];
  const currentLevel = scriptProgress.level;
  const masteredRomaji = scriptProgress.masteredRomaji;
  const scriptMistakes = mistakes[currentScript];

  const unlockedCharacters = useMemo(
    () => getUnlockedCharacters(scriptData, currentLevel),
    [scriptData, currentLevel]
  );

  const currentRow = getCurrentRow(currentLevel);
  const isComplete = currentLevel >= ROW_ORDER.length;
  const levelProgress = calcLevelProgress(
    masteredRomaji.length,
    unlockedCharacters.length
  );
  const topMistakes = useMemo(
    () => getTopMistakes(mistakes, currentScript),
    [mistakes, currentScript]
  );

  const clearFeedback = useCallback(() => {
    setAnswerFeedback(null);
    blurActiveElement();
  }, []);

  const resetScriptProgress = useCallback(
    (script: ScriptId) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          [script]: { level: 0, masteredRomaji: [] },
        };
        saveProgress(next);
        return next;
      });
      setMistakes((prev) => clearMistakesForScript(prev, script));
      if (script === currentScript) {
        setCurrentCharacter(null);
        clearFeedback();
        setIsLocked(false);
      }
    },
    [clearFeedback, currentScript]
  );

  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
    setMistakes(clearAllMistakes());
    setCurrentCharacter(null);
    clearFeedback();
    setIsLocked(false);
  }, [clearFeedback]);

  const handleScriptChange = useCallback(
    (script: ScriptId) => {
      setCurrentScript(script);
      setCurrentCharacter(null);
      clearFeedback();
      setIsLocked(false);
    },
    [clearFeedback]
  );

  const advanceCharacter = useCallback(
    (excludeRomaji?: string) => {
      const next = pickWeightedCharacter(
        unlockedCharacters,
        scriptMistakes,
        excludeRomaji
      );
      setCurrentCharacter(next);
      clearFeedback();
      setIsLocked(false);
    },
    [clearFeedback, scriptMistakes, unlockedCharacters]
  );

  useEffect(() => {
    if (isComplete) {
      setCurrentCharacter(null);
      setAnswers([]);
      return;
    }

    if (!currentCharacter && unlockedCharacters.length > 0) {
      advanceCharacter();
    }
  }, [advanceCharacter, currentCharacter, isComplete, unlockedCharacters]);

  useEffect(() => {
    if (!currentCharacter || quizMode !== "choice") {
      setAnswers([]);
      return;
    }

    clearFeedback();
    const allRomaji = getAllRomaji(scriptData);
    setAnswers(generateAnswers(currentCharacter.romaji, allRomaji, answerCount));
  }, [answerCount, clearFeedback, currentCharacter, quizMode, scriptData]);

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (isLocked || !currentCharacter || isComplete) return;

      const isCorrect = isRomajiMatch(answer, currentCharacter.romaji);
      setAnswerFeedback({
        answer,
        status: isCorrect ? "correct" : "wrong",
      });
      setIsLocked(true);

      if (isCorrect) {
        const alreadyMastered = masteredRomaji.includes(currentCharacter.romaji);
        const nextMastered = alreadyMastered
          ? masteredRomaji
          : [...masteredRomaji, currentCharacter.romaji];

        const levelComplete =
          nextMastered.length === unlockedCharacters.length;

        setTimeout(() => {
          clearFeedback();

          if (levelComplete) {
            const nextLevel = currentLevel + 1;
            setProgress((prev) => {
              const next = {
                ...prev,
                [currentScript]: {
                  level: nextLevel,
                  masteredRomaji: [],
                },
              };
              saveProgress(next);
              return next;
            });
            setCurrentCharacter(null);
            setIsLocked(false);
          } else {
            setProgress((prev) => {
              const next = {
                ...prev,
                [currentScript]: {
                  level: currentLevel,
                  masteredRomaji: nextMastered,
                },
              };
              saveProgress(next);
              return next;
            });
            advanceCharacter(currentCharacter.romaji);
          }
        }, 400);
      } else {
        setMistakes((prev) =>
          recordMistake(prev, currentScript, currentCharacter.romaji)
        );

        setTimeout(() => {
          clearFeedback();
          setIsLocked(false);
        }, 800);
      }
    },
    [
      advanceCharacter,
      clearFeedback,
      currentCharacter,
      currentLevel,
      currentScript,
      isComplete,
      isLocked,
      masteredRomaji,
      unlockedCharacters.length,
    ]
  );

  return {
    currentScript,
    currentCharacter,
    answers,
    answerFeedback,
    currentLevel,
    currentRow,
    rowLabel: currentRow ? ROW_LABELS[currentRow] : null,
    levelProgress,
    isComplete,
    unlockedCount: unlockedCharacters.length,
    masteredCount: masteredRomaji.length,
    totalCharacters: scriptData.length,
    topMistakes,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
    resetAllProgress,
  };
}
