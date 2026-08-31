import { SCRIPTS } from "../data/characters";
import {
  DEFAULT_MISTAKES,
  type MistakeEntry,
  type MistakeStats,
  type ScriptId,
} from "../types";

const STORAGE_KEY = "hirakana-mistakes";

export function loadMistakes(): MistakeStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MISTAKES;
    const parsed = JSON.parse(raw) as Partial<MistakeStats>;
    return {
      hiragana: parsed.hiragana ?? {},
      katakana: parsed.katakana ?? {},
    };
  } catch {
    return DEFAULT_MISTAKES;
  }
}

export function saveMistakes(stats: MistakeStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordMistake(
  stats: MistakeStats,
  script: ScriptId,
  romaji: string
): MistakeStats {
  const next = {
    ...stats,
    [script]: {
      ...stats[script],
      [romaji]: (stats[script][romaji] ?? 0) + 1,
    },
  };
  saveMistakes(next);
  return next;
}

export function clearMistakesForScript(
  stats: MistakeStats,
  script: ScriptId
): MistakeStats {
  const next = { ...stats, [script]: {} };
  saveMistakes(next);
  return next;
}

export function clearAllMistakes(): MistakeStats {
  saveMistakes(DEFAULT_MISTAKES);
  return DEFAULT_MISTAKES;
}

export function getMistakeWeight(mistakeCount: number): number {
  return 1 + mistakeCount * 2;
}

export function getTopMistakes(
  stats: MistakeStats,
  script: ScriptId,
  limit = 5
): MistakeEntry[] {
  const scriptData = SCRIPTS[script];
  const romajiToChar = new Map(scriptData.map((c) => [c.romaji, c.char]));

  return Object.entries(stats[script])
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([romaji, count]) => ({
      char: romajiToChar.get(romaji) ?? "?",
      romaji,
      count,
    }));
}
