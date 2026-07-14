import type { KanaCharacter, RowId } from "../types";
import { ROW_ORDER } from "../types";

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

  while (answers.size < count) {
    const randomAnswer =
      allAnswers[Math.floor(Math.random() * allAnswers.length)];
    if (randomAnswer !== correctAnswer) {
      answers.add(randomAnswer);
    }
  }

  return shuffleArray([...answers]);
}

export function getUnlockedCharacters(
  scriptData: KanaCharacter[],
  level: number
): KanaCharacter[] {
  return scriptData.filter(
    (char) => ROW_ORDER.indexOf(char.row) <= level
  );
}

export function getCurrentRow(level: number): RowId | null {
  return ROW_ORDER[level] ?? null;
}

export function pickRandomCharacter(
  characters: KanaCharacter[],
  excludeRomaji?: string
): KanaCharacter | null {
  if (characters.length === 0) return null;

  const pool =
    excludeRomaji && characters.length > 1
      ? characters.filter((c) => c.romaji !== excludeRomaji)
      : characters;

  const source = pool.length > 0 ? pool : characters;
  return source[Math.floor(Math.random() * source.length)];
}

export function calcLevelProgress(
  masteredCount: number,
  totalInLevel: number
): number {
  if (totalInLevel === 0) return 0;
  return Math.round((masteredCount / totalInLevel) * 100);
}
