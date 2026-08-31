import { useCallback, useState } from "react";

import {
  ANSWER_COUNT_OPTIONS,
  MAX_APPEARANCE_OPTIONS,
  type AnswerCount,
  type MaxAppearances,
  type QuizMode,
} from "../types";

export interface Preferences {
  answerCount: AnswerCount;
  quizMode: QuizMode;
  maxAppearances: MaxAppearances;
}

const STORAGE_KEY = "hirakana-preferences";

export const DEFAULT_PREFERENCES: Preferences = {
  answerCount: 6,
  quizMode: "choice",
  maxAppearances: 2,
};

function isAnswerCount(value: unknown): value is AnswerCount {
  return ANSWER_COUNT_OPTIONS.includes(value as AnswerCount);
}

function isMaxAppearances(value: unknown): value is MaxAppearances {
  return MAX_APPEARANCE_OPTIONS.includes(value as MaxAppearances);
}

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      answerCount: isAnswerCount(parsed.answerCount)
        ? parsed.answerCount
        : DEFAULT_PREFERENCES.answerCount,
      quizMode: parsed.quizMode === "text" ? "text" : "choice",
      maxAppearances: isMaxAppearances(parsed.maxAppearances)
        ? parsed.maxAppearances
        : DEFAULT_PREFERENCES.maxAppearances,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(preferences: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...patch };
      savePreferences(next);
      return next;
    });
  }, []);

  return { preferences, updatePreferences };
}
