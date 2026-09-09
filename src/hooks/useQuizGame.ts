import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SCRIPTS } from "../data/characters";
import {
  DEFAULT_PROGRESS,
  ROW_LABELS,
  ROW_ORDER,
  type AnswerCount,
  type AnswerFeedback,
  type AnswerPool,
  type GameProgress,
  type KanaCharacter,
  type MistakeStats,
  type QuizDirection,
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
  earnedSuccesses,
  generateChoiceAnswers,
  getCurrentRow,
  getUnlockedCharacters,
  isQuizAnswerCorrect,
  isUnlockedSetComplete,
  migrateScriptProgress,
  pickWeightedCharacter,
  registerCorrect,
  registerWrong,
  remainingCharacters,
  requiredSuccesses,
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
  maxAppearances: MaxAppearances = 2,
  answerPool: AnswerPool = "level",
  quizDirection: QuizDirection = "kana-to-romaji"
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
  const successes = scriptProgress.successes ?? {};
  const scriptMistakes = mistakes[currentScript];
  const required = requiredSuccesses(maxAppearances);

  const unlockedCharacters = useMemo(
    () => getUnlockedCharacters(scriptData, currentLevel),
    [scriptData, currentLevel]
  );

  const currentRow = getCurrentRow(currentLevel);
  const earnedCount = earnedSuccesses(
    unlockedCharacters,
    successes,
    required
  );
  const requiredTotal = unlockedCharacters.length * required;
  const masteredCount = unlockedCharacters.filter(
    (char) => (successes[char.romaji] ?? 0) >= required
  ).length;
  const isComplete = currentLevel >= ROW_ORDER.length;
  const levelProgress = calcLevelProgress(earnedCount, requiredTotal);
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
    (successesOverride?: Record<string, number>) => {
      const scriptProgress = progressRef.current[currentScript];
      syncAppearanceTracking(currentScript, scriptProgress.level);

      const successesNow = successesOverride ?? scriptProgress.successes ?? {};
      const unlocked = getUnlockedCharacters(
        scriptData,
        scriptProgress.level
      );
      const remaining = remainingCharacters(
        unlocked,
        successesNow,
        required
      );

      if (remaining.length === 0) {
        if (unlocked.length === 0) return;
        const nextLevel = scriptProgress.level + 1;
        const next = {
          ...progressRef.current,
          [currentScript]: {
            level: nextLevel,
            successes: {},
            failStreaks: {},
          },
        };
        saveProgress(next);
        progressRef.current = next;
        setProgress(next);
        pendingExcludeRomaji.current = undefined;
        resetAppearanceTracking(currentScript, nextLevel);
        startLoading();
        return;
      }

      const next = pickWeightedCharacter(
        remaining,
        scriptMistakes,
        pendingExcludeRomaji.current
      );
      pendingExcludeRomaji.current = undefined;

      if (!next) return;

      if (quizMode === "choice") {
        const source =
          answerPool === "all" ? scriptData : unlocked;
        setAnswers(
          generateChoiceAnswers(next, source, answerCount, quizDirection)
        );
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
      answerPool,
      currentScript,
      quizDirection,
      quizMode,
      required,
      resetAppearanceTracking,
      scriptData,
      scriptMistakes,
      startLoading,
      syncAppearanceTracking,
    ]
  );

  const currentCharacterRef = useRef(currentCharacter);
  currentCharacterRef.current = currentCharacter;

  const quizSettingsRef = useRef({
    answerCount,
    answerPool,
    quizDirection,
    quizMode,
    scriptData,
  });
  quizSettingsRef.current = {
    answerCount,
    answerPool,
    quizDirection,
    quizMode,
    scriptData,
  };

  const resyncOpenQuestion = useCallback(() => {
    const character = currentCharacterRef.current;
    if (!character) return;

    clearFeedbackTimer();
    const settings = quizSettingsRef.current;
    if (settings.quizMode === "choice") {
      const source =
        settings.answerPool === "all"
          ? settings.scriptData
          : getUnlockedCharacters(
              settings.scriptData,
              progressRef.current[currentScript].level
            );
      setAnswers(
        generateChoiceAnswers(
          character,
          source,
          settings.answerCount,
          settings.quizDirection
        )
      );
    } else {
      setAnswers([]);
    }
    setAnswerFeedback(null);
    setQuestionId((id) => id + 1);
    setPhase("asking");
    blurActiveElement();
  }, [clearFeedbackTimer, currentScript]);

  useEffect(() => {
    resyncOpenQuestion();
  }, [answerCount, answerPool, quizDirection, quizMode, resyncOpenQuestion]);

  const resetScriptProgress = useCallback(
    (script: ScriptId) => {
      clearFeedbackTimer();
      setProgress((prev) => {
        const next = {
          ...prev,
          [script]: { level: 0, successes: {}, failStreaks: {} },
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

      const isCorrect = isQuizAnswerCorrect(
        answer,
        currentCharacter,
        quizSettingsRef.current.quizDirection
      );
      setAnswerFeedback({
        answer,
        status: isCorrect ? "correct" : "wrong",
      });
      setPhase("feedback");

      clearFeedbackTimer();
      feedbackTimer.current = setTimeout(() => {
        const romaji = currentCharacter.romaji;

        if (isCorrect) {
          setProgress((prev) => {
            const scriptState = prev[currentScript];
            const updated = registerCorrect(
              scriptState.successes ?? {},
              scriptState.failStreaks ?? {},
              romaji,
              required
            );
            const unlocked = getUnlockedCharacters(
              scriptData,
              scriptState.level
            );
            const levelComplete = isUnlockedSetComplete(
              unlocked,
              updated.successes,
              required
            );

            if (levelComplete) {
              const next = {
                ...prev,
                [currentScript]: {
                  level: scriptState.level + 1,
                  successes: {},
                  failStreaks: {},
                },
              };
              saveProgress(next);
              queueMicrotask(() => {
                pendingExcludeRomaji.current = undefined;
                resetAppearanceTracking(
                  currentScript,
                  scriptState.level + 1
                );
                startLoading();
              });
              return next;
            }

            const next = {
              ...prev,
              [currentScript]: {
                level: scriptState.level,
                successes: updated.successes,
                failStreaks: updated.failStreaks,
              },
            };
            saveProgress(next);
            queueMicrotask(() => {
              pendingExcludeRomaji.current = romaji;
              loadNextQuestion(updated.successes);
            });
            return next;
          });
        } else {
          setMistakes((prev) =>
            recordMistake(prev, currentScript, romaji)
          );
          setProgress((prev) => {
            const scriptState = prev[currentScript];
            const updated = registerWrong(
              scriptState.successes ?? {},
              scriptState.failStreaks ?? {},
              romaji
            );
            const next = {
              ...prev,
              [currentScript]: {
                level: scriptState.level,
                successes: updated.successes,
                failStreaks: updated.failStreaks,
              },
            };
            saveProgress(next);
            return next;
          });

          const settings = quizSettingsRef.current;
          if (settings.quizMode === "choice") {
            const source =
              settings.answerPool === "all"
                ? settings.scriptData
                : getUnlockedCharacters(
                    settings.scriptData,
                    progressRef.current[currentScript].level
                  );
            setAnswers(
              generateChoiceAnswers(
                currentCharacter,
                source,
                settings.answerCount,
                settings.quizDirection
              )
            );
            setQuestionId((id) => id + 1);
          }
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
      required,
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
    masteredCount,
    earnedCount,
    requiredTotal,
    totalCharacters: scriptData.length,
    topMistakes,
    handleScriptChange,
    handleAnswerSelect,
    resetScriptProgress,
    resetAllProgress,
  };
}
