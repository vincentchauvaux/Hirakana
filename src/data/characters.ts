import type { KanaCharacter } from "../types";

export const hiragana: KanaCharacter[] = [
  { char: "あ", row: "a", romaji: "a" },
  { char: "い", row: "a", romaji: "i" },
  { char: "う", row: "a", romaji: "u" },
  { char: "え", row: "a", romaji: "e" },
  { char: "お", row: "a", romaji: "o" },
  { char: "か", row: "k", romaji: "ka" },
  { char: "き", row: "k", romaji: "ki" },
  { char: "く", row: "k", romaji: "ku" },
  { char: "け", row: "k", romaji: "ke" },
  { char: "こ", row: "k", romaji: "ko" },
  { char: "さ", row: "sh", romaji: "sa" },
  { char: "し", row: "sh", romaji: "shi" },
  { char: "す", row: "sh", romaji: "su" },
  { char: "せ", row: "sh", romaji: "se" },
  { char: "そ", row: "sh", romaji: "so" },
  { char: "た", row: "ts", romaji: "ta" },
  { char: "ち", row: "ts", romaji: "chi" },
  { char: "つ", row: "ts", romaji: "tsu" },
  { char: "て", row: "ts", romaji: "te" },
  { char: "と", row: "ts", romaji: "to" },
  { char: "な", row: "n", romaji: "na" },
  { char: "に", row: "n", romaji: "ni" },
  { char: "ぬ", row: "n", romaji: "nu" },
  { char: "ね", row: "n", romaji: "ne" },
  { char: "の", row: "n", romaji: "no" },
];

export const katakana: KanaCharacter[] = [
  { char: "ア", row: "a", romaji: "a" },
  { char: "イ", row: "a", romaji: "i" },
  { char: "ウ", row: "a", romaji: "u" },
  { char: "エ", row: "a", romaji: "e" },
  { char: "オ", row: "a", romaji: "o" },
  { char: "カ", row: "k", romaji: "ka" },
  { char: "キ", row: "k", romaji: "ki" },
  { char: "ク", row: "k", romaji: "ku" },
  { char: "ケ", row: "k", romaji: "ke" },
  { char: "コ", row: "k", romaji: "ko" },
  { char: "サ", row: "sh", romaji: "sa" },
  { char: "シ", row: "sh", romaji: "shi" },
  { char: "ス", row: "sh", romaji: "su" },
  { char: "セ", row: "sh", romaji: "se" },
  { char: "ソ", row: "sh", romaji: "so" },
  { char: "タ", row: "ts", romaji: "ta" },
  { char: "チ", row: "ts", romaji: "chi" },
  { char: "ツ", row: "ts", romaji: "tsu" },
  { char: "テ", row: "ts", romaji: "te" },
  { char: "ト", row: "ts", romaji: "to" },
  { char: "ナ", row: "n", romaji: "na" },
  { char: "ニ", row: "n", romaji: "ni" },
  { char: "ヌ", row: "n", romaji: "nu" },
  { char: "ネ", row: "n", romaji: "ne" },
  { char: "ノ", row: "n", romaji: "no" },
];

export const SCRIPTS = {
  hiragana,
  katakana,
} as const;

export function getAllRomaji(scriptData: KanaCharacter[]): string[] {
  return scriptData.map((item) => item.romaji);
}
