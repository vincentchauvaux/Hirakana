import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SCRIPTS, getAllRomaji } from "../data/characters";
import {
  DEFAULT_PROGRESS,
  ROW_LABELS,
  ROW_ORDER,
  type AnswerCount,
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
type QuizPhase = "loading" | "asking" | "feedback";

const CORRECT_DELAY_MS = 250;
const WRONG_DELAY_MS = 450;

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
  answerCount: AnswerCount = 6,
  quizMode: QuizMode = "choice"
) {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [mistakes, setMistakes] = useState<MistakeStats>(loadMistakes);
  const [currentScript, setCurrentScript] = useState<ScriptId>("hiragana");
  const [phase, setPhase] = useState<QuizPhase>("loading");
  const [currentCharacter, setCurrentCharacter] = useState<KanaCharacter | null>(
    null
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback>(null);
  const [questionId, setQuestionId] = useState(0);
  const pendingExcludeRomaji = useRef<string | undefined>(undefined);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>();

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

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
      feedbackTimer.current = undefined;
    }
  }, []);

  const startLoading = useCallback(() => {
    clearFeedbackTimer();
    setPhase("loading");
    setCurrentCharacter(null);
    setAnswers([]);
    setAnswerFeedback(null);
    blurActiveElement();
  }, [clearFeedbackTimer]);

  const loadNextQuestion = useCallback(() => {
    const next = pickWeightedCharacter(
      unlockedCharacters,
      scriptMistakes,
      pendingExcludeRomaji.current
    );
    pendingExcludeRomaji.current = undefined;

    if (!next) return;

    if (quizMode === "choice") {
      const allRomaji = getAllRomaji(scriptData);
      setAnswers(generateAnswers(next.romaji, allRomaji, answerCount));
    } else {
      setAnswers([]);
    }

    setCurrentCharacter(next);
    setQuestionId((id) => id + 1);
    setAnswerFeedback(null);
    setPhase("asking");
    blurActiveElement();
  }, [answerCount, quizMode, scriptData, scriptMistakes, unlockedCharacters]);

  const resetScriptProgress = useCallback(
    (script: ScriptId) => {
      clearFeedbackTimer();
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
        pendingExcludeRomaji.current = undefined;
        startLoading();
      }
    },
    [clearFeedbackTimer, currentScript, startLoading]
  );

  const resetAllProgress = useCallback(() => {
    clearFeedbackTimer();
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
    setMistakes(clearAllMistakes());
    pendingExcludeRomaji.current = undefined;
    startLoading();
  }, [clearFeedbackTimer, startLoading]);

  const handleScriptChange = useCallback(
    (script: ScriptId) => {
      clearFeedbackTimer();
      setCurrentScript(script);
      pendingExcludeRomaji.current = undefined;
      startLoading();
    },
    [clearFeedbackTimer, startLoading]
  );

  useEffect(() => {
    if (isComplete) {
      clearFeedbackTimer();
      setCurrentCharacter(null);
      setAnswers([]);
      return;
    }

    if (phase === "loading" && unlockedCharacters.length > 0) {
      loadNextQuestion();
    }
  }, [
    clearFeedbackTimer,
    isComplete,
    loadNextQuestion,
    phase,
    unlockedCharacters.length,
  ]);

  useEffect(() => () => clearFeedbackTimer(), [clearFeedbackTimer]);

  useEffect(() => {
    if (questionId > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [questionId]);

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (phase !== "asking" || !currentCharacter || isComplete) return;

      const isCorrect = isRomajiMatch(answer, currentCharacter.romaji);
      setAnswerFeedback({
        answer,
        status: isCorrect ? "correct" : "wrong",
      });
      setPhase("feedback");

      clearFeedbackTimer();
      feedbackTimer.current = setTimeout(() => {
        if (isCorrect) {
          const alreadyMastered = masteredRomaji.includes(
            currentCharacter.romaji
          );
          const nextMastered = alreadyMastered
            ? masteredRomaji
            : [...masteredRomaji, currentCharacter.romaji];

          const levelComplete =
            nextMastered.length === unlockedCharacters.length;

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
            pendingExcludeRomaji.current = currentCharacter.romaji;
          }

          startLoading();
        } else {
          setMistakes((prev) =>
            recordMistake(prev, currentScript, currentCharacter.romaji)
          );
          setPhase("asking");
          setAnswerFeedback(null);
          blurActiveElement();
        }
      }, isCorrect ? CORRECT_DELAY_MS : WRONG_DELAY_MS);
    },
    [
      clearFeedbackTimer,
      currentCharacter,
      currentLevel,
      currentScript,
      isComplete,
      masteredRomaji,
      phase,
      startLoading,
      unlockedCharacters.length,
    ]
  );

  return {
    currentScript,
    currentCharacter,
    questionId,
    phase,
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
