import { useCallback, useState } from "react";

export interface Preferences {
  answerCount: 4 | 6;
}

const STORAGE_KEY = "hirakana-preferences";

export const DEFAULT_PREFERENCES: Preferences = {
  answerCount: 6,
};

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      answerCount: parsed.answerCount === 4 ? 4 : 6,
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
