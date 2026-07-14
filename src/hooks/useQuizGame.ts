import { useCallback, useEffect, useMemo, useState } from "react";
import { SCRIPTS, getAllRomaji } from "../data/characters";
import {
  DEFAULT_PROGRESS,
  ROW_LABELS,
  ROW_ORDER,
  type GameProgress,
  type KanaCharacter,
  type ScriptId,
} from "../types";
import {
  calcLevelProgress,
  generateAnswers,
  getCurrentRow,
  getUnlockedCharacters,
  pickRandomCharacter,
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

export function useQuizGame(answerCount: 4 | 6 = 6) {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [currentScript, setCurrentScript] = useState<ScriptId>("hiragana");
  const [currentCharacter, setCurrentCharacter] = useState<KanaCharacter | null>(
    null
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const scriptData = SCRIPTS[currentScript];
  const scriptProgress = progress[currentScript];
  const currentLevel = scriptProgress.level;
  const masteredRomaji = scriptProgress.masteredRomaji;

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

  const resetScriptProgress = useCallback((script: ScriptId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [script]: { level: 0, masteredRomaji: [] },
      };
      saveProgress(next);
      return next;
    });
    if (script === currentScript) {
      setCurrentCharacter(null);
      setSelectedAnswer(null);
      setIsLocked(false);
    }
  }, [currentScript]);

  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
    setCurrentCharacter(null);
    setSelectedAnswer(null);
    setIsLocked(false);
  }, []);

  const handleScriptChange = useCallback((script: ScriptId) => {
    setCurrentScript(script);
    setCurrentCharacter(null);
    setSelectedAnswer(null);
    setIsLocked(false);
  }, []);

  const advanceCharacter = useCallback(
    (excludeRomaji?: string) => {
      const next = pickRandomCharacter(unlockedCharacters, excludeRomaji);
      setCurrentCharacter(next);
      setSelectedAnswer(null);
      setIsLocked(false);
    },
    [unlockedCharacters]
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
    if (!currentCharacter) {
      setAnswers([]);
      return;
    }

    const allRomaji = getAllRomaji(scriptData);
    setAnswers(generateAnswers(currentCharacter.romaji, allRomaji, answerCount));
    setSelectedAnswer(null);
  }, [answerCount, currentCharacter, scriptData]);

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (isLocked || !currentCharacter || isComplete) return;

      setSelectedAnswer(answer);
      setIsLocked(true);

      const isCorrect = answer === currentCharacter.romaji;

      if (isCorrect) {
        const alreadyMastered = masteredRomaji.includes(currentCharacter.romaji);
        const nextMastered = alreadyMastered
          ? masteredRomaji
          : [...masteredRomaji, currentCharacter.romaji];

        const levelComplete =
          nextMastered.length === unlockedCharacters.length;

        setTimeout(() => {
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
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsLocked(false);
        }, 800);
      }
    },
    [
      advanceCharacter,
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
    selectedAnswer,
    currentLevel,
    currentRow,
    rowLabel: currentRow ? ROW_LABELS[currentRow] : null,
    levelProgress,
    isComplete,
    unlockedCount: unlockedCharacters.length,
    masteredCount: masteredRomaji.length,
    totalCharacters: scriptData.length,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
    resetAllProgress,
  };
}
