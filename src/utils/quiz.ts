import type {
  KanaCharacter,
  MaxAppearances,
  QuizDirection,
  RowId,
  ScriptProgress,
} from "../types";
import { ROW_ORDER } from "../types";
import { getMistakeWeight } from "./mistakes";

/** Max fois qu'un même caractère peut être proposé par niveau (hors répétition après erreur). */
export const MAX_APPEARANCES_PER_LEVEL = 2;

export function filterByAppearanceLimit(
  characters: KanaCharacter[],
  appearanceCounts: Record<string, number>,
  max = MAX_APPEARANCES_PER_LEVEL
): KanaCharacter[] {
  if (characters.length === 0) return characters;

  const withinLimit = characters.filter(
    (c) => (appearanceCounts[c.romaji] ?? 0) < max
  );
  if (withinLimit.length > 0) return withinLimit;

  const minCount = Math.min(
    ...characters.map((c) => appearanceCounts[c.romaji] ?? 0)
  );
  return characters.filter(
    (c) => (appearanceCounts[c.romaji] ?? 0) === minCount
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateAnswers(
  correctAnswer: string,
  allAnswers: string[],
  count = 6
): string[] {
  const answers = new Set<string>([correctAnswer]);
  const targetCount = Math.min(count, allAnswers.length);

  while (answers.size < targetCount) {
    const randomAnswer =
      allAnswers[Math.floor(Math.random() * allAnswers.length)];
    if (randomAnswer !== correctAnswer) {
      answers.add(randomAnswer);
    }
  }

  return shuffleArray([...answers]);
}

export function generateChoiceAnswers(
  character: KanaCharacter,
  source: KanaCharacter[],
  count: number,
  direction: QuizDirection
): string[] {
  const values =
    direction === "romaji-to-kana"
      ? source.map((item) => item.char)
      : source.map((item) => item.romaji);
  const correct =
    direction === "romaji-to-kana" ? character.char : character.romaji;
  return generateAnswers(correct, values, count);
}

/** ∞ (0) compte comme 1 réussite requise, sans plafond plus haut. */
export function requiredSuccesses(maxAppearances: MaxAppearances): number {
  return maxAppearances === 0 ? 1 : maxAppearances;
}

export function getCharSuccesses(
  successes: Record<string, number>,
  romaji: string
): number {
  return Math.max(0, successes[romaji] ?? 0);
}

export function earnedSuccesses(
  characters: KanaCharacter[],
  successes: Record<string, number>,
  required: number
): number {
  return characters.reduce(
    (sum, char) =>
      sum + Math.min(required, getCharSuccesses(successes, char.romaji)),
    0
  );
}

export function remainingCharacters(
  characters: KanaCharacter[],
  successes: Record<string, number>,
  required: number
): KanaCharacter[] {
  return characters.filter(
    (char) => getCharSuccesses(successes, char.romaji) < required
  );
}

export function isUnlockedSetComplete(
  characters: KanaCharacter[],
  successes: Record<string, number>,
  required: number
): boolean {
  return (
    characters.length > 0 &&
    remainingCharacters(characters, successes, required).length === 0
  );
}

export function registerCorrect(
  successes: Record<string, number>,
  failStreaks: Record<string, number>,
  romaji: string,
  required: number
): { successes: Record<string, number>; failStreaks: Record<string, number> } {
  const current = getCharSuccesses(successes, romaji);
  return {
    successes: { ...successes, [romaji]: Math.min(required, current + 1) },
    failStreaks: { ...failStreaks, [romaji]: 0 },
  };
}

/** Première erreur : le compteur ne bouge pas. Deuxième d’affilée : -1 réussite, plafonné à 0. */
export function registerWrong(
  successes: Record<string, number>,
  failStreaks: Record<string, number>,
  romaji: string
): { successes: Record<string, number>; failStreaks: Record<string, number> } {
  const streak = (failStreaks[romaji] ?? 0) + 1;
  if (streak < 2) {
    return {
      successes,
      failStreaks: { ...failStreaks, [romaji]: streak },
    };
  }
  const current = getCharSuccesses(successes, romaji);
  return {
    successes: { ...successes, [romaji]: Math.max(0, current - 1) },
    failStreaks: { ...failStreaks, [romaji]: 0 },
  };
}

function asCountRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const next: Record<string, number> = {};
  for (const [key, count] of Object.entries(value as Record<string, unknown>)) {
    if (typeof count === "number" && Number.isFinite(count) && count > 0) {
      next[key] = count;
    }
  }
  return next;
}

export function getUnlockedCharacters(
  scriptData: KanaCharacter[],
  level: number
): KanaCharacter[] {
  return scriptData.filter(
    (char) => ROW_ORDER.indexOf(char.row) <= level
  );
}

export function getRowCharacters(
  scriptData: KanaCharacter[],
  row: RowId | null
): KanaCharacter[] {
  if (!row) return [];
  return scriptData.filter((char) => char.row === row);
}

export function isRowFullyMastered(
  rowCharacters: KanaCharacter[],
  masteredRomaji: string[]
): boolean {
  return (
    rowCharacters.length > 0 &&
    rowCharacters.every((char) => masteredRomaji.includes(char.romaji))
  );
}

export function getCurrentRow(level: number): RowId | null {
  return ROW_ORDER[level] ?? null;
}

/** Reprend une sauvegarde ancienne (`masteredRomaji`) sans sauter les révisions. */
export function migrateScriptProgress(
  saved: (Partial<ScriptProgress> & { masteredRomaji?: string[] }) | undefined,
  scriptData: KanaCharacter[]
): ScriptProgress {
  let level = typeof saved?.level === "number" ? saved.level : 0;
  if (level < 0) level = 0;
  if (level > ROW_ORDER.length) level = ROW_ORDER.length;

  if (level >= ROW_ORDER.length) {
    return { level: ROW_ORDER.length, successes: {}, failStreaks: {} };
  }

  let successes = asCountRecord(saved?.successes);
  const failStreaks = asCountRecord(saved?.failStreaks);

  if (
    Object.keys(successes).length === 0 &&
    Array.isArray(saved?.masteredRomaji)
  ) {
    const currentRow = ROW_ORDER[level];
    for (const romaji of saved.masteredRomaji) {
      if (typeof romaji !== "string") continue;
      const char = scriptData.find((item) => item.romaji === romaji);
      if (char && char.row === currentRow) {
        successes = { ...successes, [romaji]: 99 };
      }
    }
  }

  return { level, successes, failStreaks };
}

export function pickRandomCharacter(
  characters: KanaCharacter[],
  excludeRomaji?: string
): KanaCharacter | null {
  return pickWeightedCharacter(characters, {}, excludeRomaji);
}

export function pickWeightedCharacter(
  characters: KanaCharacter[],
  mistakeCounts: Record<string, number>,
  excludeRomaji?: string
): KanaCharacter | null {
  if (characters.length === 0) return null;

  const pool =
    excludeRomaji && characters.length > 1
      ? characters.filter((c) => c.romaji !== excludeRomaji)
      : characters;

  const source = pool.length > 0 ? pool : characters;

  const totalWeight = source.reduce(
    (sum, char) => sum + getMistakeWeight(mistakeCounts[char.romaji] ?? 0),
    0
  );

  let roll = Math.random() * totalWeight;
  for (const char of source) {
    roll -= getMistakeWeight(mistakeCounts[char.romaji] ?? 0);
    if (roll <= 0) return char;
  }

  return source[source.length - 1];
}

export function calcLevelProgress(
  masteredCount: number,
  totalInLevel: number
): number {
  if (totalInLevel === 0) return 0;
  return Math.round((masteredCount / totalInLevel) * 100);
}

export function normalizeRomaji(input: string): string {
  return input.trim().toLowerCase();
}

export function isRomajiMatch(input: string, expected: string): boolean {
  return normalizeRomaji(input) === normalizeRomaji(expected);
}

export function isQuizAnswerCorrect(
  input: string,
  character: KanaCharacter,
  direction: QuizDirection
): boolean {
  if (direction === "romaji-to-kana") {
    return input.trim() === character.char;
  }
  return isRomajiMatch(input, character.romaji);
}
