import { useCallback, useState } from "react";

import { ANSWER_COUNT_OPTIONS, type AnswerCount, type QuizMode } from "../types";

export interface Preferences {
  answerCount: AnswerCount;
  quizMode: QuizMode;
}

const STORAGE_KEY = "hirakana-preferences";

export const DEFAULT_PREFERENCES: Preferences = {
  answerCount: 6,
  quizMode: "choice",
};

function isAnswerCount(value: unknown): value is AnswerCount {
  return ANSWER_COUNT_OPTIONS.includes(value as AnswerCount);
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
