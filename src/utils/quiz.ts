import type { KanaCharacter, QuizDirection, RowId, ScriptProgress } from "../types";
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

/** Reprend une sauvegarde (ex. fin des 5 anciennes rangées) pour enchaîner sur le gojūon. */
export function migrateScriptProgress(
  saved: Partial<ScriptProgress> | undefined,
  scriptData: KanaCharacter[]
): ScriptProgress {
  let level = typeof saved?.level === "number" ? saved.level : 0;
  let masteredRomaji = Array.isArray(saved?.masteredRomaji)
    ? saved.masteredRomaji.filter((item) => typeof item === "string")
    : [];

  if (level < 0) level = 0;
  if (level > ROW_ORDER.length) level = ROW_ORDER.length;

  if (level >= ROW_ORDER.length) {
    return { level: ROW_ORDER.length, masteredRomaji };
  }

  if (level > 0 && masteredRomaji.length === 0) {
    masteredRomaji = scriptData
      .filter((char) => {
        const index = ROW_ORDER.indexOf(char.row);
        return index >= 0 && index < level;
      })
      .map((char) => char.romaji);
  }

  while (level < ROW_ORDER.length) {
    const rowCharacters = getRowCharacters(scriptData, ROW_ORDER[level]);
    if (!isRowFullyMastered(rowCharacters, masteredRomaji)) break;
    level += 1;
  }

  return { level, masteredRomaji };
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
