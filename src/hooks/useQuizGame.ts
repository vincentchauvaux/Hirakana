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
  type MaxAppearances,
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
  filterByAppearanceLimit,
  generateAnswers,
  getCurrentRow,
  getRowCharacters,
  getUnlockedCharacters,
  isRomajiMatch,
  isRowFullyMastered,
  migrateScriptProgress,
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
    const parsed = JSON.parse(raw) as Partial<GameProgress>;
    const next: GameProgress = {
      hiragana: migrateScriptProgress(parsed.hiragana, SCRIPTS.hiragana),
      katakana: migrateScriptProgress(parsed.katakana, SCRIPTS.katakana),
    };
    saveProgress(next);
    return next;
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
  quizMode: QuizMode = "choice",
  maxAppearances: MaxAppearances = 2
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
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const levelKeyRef = useRef("");
  const appearanceCountsRef = useRef<Record<string, number>>({});

  const resetAppearanceTracking = useCallback((script: ScriptId, level: number) => {
    levelKeyRef.current = `${script}:${level}`;
    appearanceCountsRef.current = {};
  }, []);

  const syncAppearanceTracking = useCallback((script: ScriptId, level: number) => {
    const levelKey = `${script}:${level}`;
    if (levelKeyRef.current !== levelKey) {
      resetAppearanceTracking(script, level);
    }
  }, [resetAppearanceTracking]);

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
  const currentRowCharacters = useMemo(
    () => getRowCharacters(scriptData, currentRow),
    [scriptData, currentRow]
  );
  const rowMasteredCount = currentRowCharacters.filter((char) =>
    masteredRomaji.includes(char.romaji)
  ).length;
  const isComplete = currentLevel >= ROW_ORDER.length;
  const levelProgress = calcLevelProgress(
    rowMasteredCount,
    currentRowCharacters.length
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

  const loadNextQuestion = useCallback(
    (masteredRomajiList?: string[]) => {
      const scriptProgress = progressRef.current[currentScript];
      syncAppearanceTracking(currentScript, scriptProgress.level);

      const mastered =
        masteredRomajiList ?? scriptProgress.masteredRomaji;
      const rowCharacters = getRowCharacters(
        scriptData,
        getCurrentRow(scriptProgress.level)
      );
      const remaining = rowCharacters.filter(
        (c) => !mastered.includes(c.romaji)
      );
      const pool = remaining.length > 0 ? remaining : rowCharacters;
      const eligible =
        maxAppearances === 0
          ? pool
          : filterByAppearanceLimit(
              pool,
              appearanceCountsRef.current,
              maxAppearances
            );

      const next = pickWeightedCharacter(
        eligible,
        scriptMistakes,
        pendingExcludeRomaji.current
      );
      pendingExcludeRomaji.current = undefined;

      if (!next) return;

      appearanceCountsRef.current = {
        ...appearanceCountsRef.current,
        [next.romaji]: (appearanceCountsRef.current[next.romaji] ?? 0) + 1,
      };

      if (quizMode === "choice") {
        const allRomaji = getAllRomaji(unlockedCharacters);
        setAnswers(generateAnswers(next.romaji, allRomaji, answerCount));
      } else {
        setAnswers([]);
      }

      setCurrentCharacter(next);
      setQuestionId((id) => id + 1);
      setAnswerFeedback(null);
      setPhase("asking");
      blurActiveElement();
    },
    [
      answerCount,
      currentScript,
      maxAppearances,
      quizMode,
      scriptData,
      scriptMistakes,
      syncAppearanceTracking,
      unlockedCharacters,
    ]
  );

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
        resetAppearanceTracking(script, 0);
        startLoading();
      }
    },
    [clearFeedbackTimer, currentScript, resetAppearanceTracking, startLoading]
  );

  const resetAllProgress = useCallback(() => {
    clearFeedbackTimer();
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
    setMistakes(clearAllMistakes());
    pendingExcludeRomaji.current = undefined;
    resetAppearanceTracking("hiragana", 0);
    startLoading();
  }, [clearFeedbackTimer, resetAppearanceTracking, startLoading]);

  const handleScriptChange = useCallback(
    (script: ScriptId) => {
      clearFeedbackTimer();
      setCurrentScript(script);
      pendingExcludeRomaji.current = undefined;
      resetAppearanceTracking(script, progressRef.current[script].level);
      startLoading();
    },
    [clearFeedbackTimer, resetAppearanceTracking, startLoading]
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
          const romaji = currentCharacter.romaji;

          setProgress((prev) => {
            const level = prev[currentScript].level;
            const mastered = prev[currentScript].masteredRomaji;
            const rowCharacters = getRowCharacters(
              scriptData,
              getCurrentRow(level)
            );
            const alreadyMastered = mastered.includes(romaji);
            const nextMastered = alreadyMastered
              ? mastered
              : [...mastered, romaji];
            const levelComplete = isRowFullyMastered(
              rowCharacters,
              nextMastered
            );

            if (levelComplete) {
              const next = {
                ...prev,
                [currentScript]: {
                  level: level + 1,
                  masteredRomaji: nextMastered,
                },
              };
              saveProgress(next);
              queueMicrotask(() => {
                pendingExcludeRomaji.current = undefined;
                resetAppearanceTracking(currentScript, level + 1);
                startLoading();
              });
              return next;
            }

            const next = {
              ...prev,
              [currentScript]: {
                level,
                masteredRomaji: nextMastered,
              },
            };
            saveProgress(next);
            queueMicrotask(() => {
              pendingExcludeRomaji.current = romaji;
              loadNextQuestion(nextMastered);
            });
            return next;
          });
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
      currentScript,
      isComplete,
      phase,
      scriptData,
      startLoading,
      loadNextQuestion,
      resetAppearanceTracking,
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
    totalLevels: ROW_ORDER.length,
    levelProgress,
    isComplete,
    unlockedCount: unlockedCharacters.length,
    masteredCount: masteredRomaji.length,
    rowMasteredCount,
    rowCount: currentRowCharacters.length,
    totalCharacters: scriptData.length,
    topMistakes,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
    resetAllProgress,
  };
}
