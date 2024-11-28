export const hiragana = [
  // あ row
  { char: "あ", row: "a", romaji: "a" },
  { char: "い", row: "a", romaji: "i" },
  { char: "う", row: "a", romaji: "u" },
  { char: "え", row: "a", romaji: "e" },
  { char: "お", row: "a", romaji: "o" },
  // か row
  { char: "か", row: "k", romaji: "ka" },
  { char: "き", row: "k", romaji: "ki" },
  { char: "く", row: "k", romaji: "ku" },
  { char: "け", row: "k", romaji: "ke" },
  { char: "こ", row: "k", romaji: "ko" },
  // さ row
  { char: "さ", row: "s", romaji: "sa" },
  { char: "し", row: "s", romaji: "shi" },
  { char: "す", row: "s", romaji: "su" },
  { char: "せ", row: "s", romaji: "se" },
  { char: "そ", row: "s", romaji: "so" },
  // た row
  { char: "た", row: "t", romaji: "ta" },
  { char: "ち", row: "t", romaji: "chi" },
  { char: "つ", row: "t", romaji: "tsu" },
  { char: "て", row: "t", romaji: "te" },
  { char: "と", row: "t", romaji: "to" },
  // な row
  { char: "な", row: "n", romaji: "na" },
  { char: "に", row: "n", romaji: "ni" },
  { char: "ぬ", row: "n", romaji: "nu" },
  { char: "ね", row: "n", romaji: "ne" },
  { char: "の", row: "n", romaji: "no" },
];

export const katakana = [
  // ア row
  { char: "ア", row: "a", romaji: "a" },
  { char: "イ", row: "a", romaji: "i" },
  { char: "ウ", row: "a", romaji: "u" },
  { char: "エ", row: "a", romaji: "e" },
  { char: "オ", row: "a", romaji: "o" },
  // カ row
  { char: "カ", row: "k", romaji: "ka" },
  { char: "キ", row: "k", romaji: "ki" },
  { char: "ク", row: "k", romaji: "ku" },
  { char: "ケ", row: "k", romaji: "ke" },
  { char: "コ", row: "k", romaji: "ko" },
  // サ row
  { char: "サ", row: "s", romaji: "sa" },
  { char: "シ", row: "s", romaji: "shi" },
  { char: "ス", row: "s", romaji: "su" },
  { char: "セ", row: "s", romaji: "se" },
  { char: "ソ", row: "s", romaji: "so" },
  // タ row
  { char: "タ", row: "t", romaji: "ta" },
  { char: "チ", row: "t", romaji: "chi" },
  { char: "ツ", row: "t", romaji: "tsu" },
  { char: "テ", row: "t", romaji: "te" },
  { char: "ト", row: "t", romaji: "to" },
  // ナ row
  { char: "ナ", row: "n", romaji: "na" },
  { char: "ニ", row: "n", romaji: "ni" },
  { char: "ヌ", row: "n", romaji: "nu" },
  { char: "ネ", row: "n", romaji: "ne" },
  { char: "ノ", row: "n", romaji: "no" },
];

export const getAllRomaji = (scriptData) => {
  return scriptData.map((item) => item.romaji);
};
