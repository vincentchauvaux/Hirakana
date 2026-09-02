export type ScriptId = "hiragana" | "katakana";

export type QuizMode = "choice" | "text";

export type QuizDirection = "kana-to-romaji" | "romaji-to-kana";

export const QUIZ_DIRECTION_OPTIONS: { id: QuizDirection; label: string }[] = [
  { id: "kana-to-romaji", label: "Kana → romaji" },
  { id: "romaji-to-kana", label: "Romaji → kana" },
];

/** `level` = rangées déjà vues ; `all` = tout le syllabaire */
export type AnswerPool = "level" | "all";

export const ANSWER_POOL_OPTIONS: { id: AnswerPool; label: string }[] = [
  { id: "level", label: "Caractères du niveau" },
  { id: "all", label: "Tous les caractères" },
];

export type AnswerCount = 4 | 6 | 8 | 10;

export const ANSWER_COUNT_OPTIONS: AnswerCount[] = [4, 6, 8, 10];

/** 0 = pas de limite de répétition par niveau */
export type MaxAppearances = 0 | 1 | 2 | 3 | 5;

export const MAX_APPEARANCE_OPTIONS: MaxAppearances[] = [1, 2, 3, 5, 0];

export type RowId = "a" | "k" | "sh" | "ts" | "n" | "h" | "m" | "y" | "r" | "w";

export interface KanaCharacter {
  char: string;
  row: RowId;
  romaji: string;
}

export interface ScriptProgress {
  level: number;
  successes: Record<string, number>;
  failStreaks: Record<string, number>;
}

export interface GameProgress {
  hiragana: ScriptProgress;
  katakana: ScriptProgress;
}

export type MistakeStats = Record<ScriptId, Record<string, number>>;

export type AnswerFeedback = {
  answer: string;
  status: "correct" | "wrong";
} | null;

export interface MistakeEntry {
  char: string;
  romaji: string;
  count: number;
}

export const ROW_ORDER: RowId[] = [
  "a",
  "k",
  "sh",
  "ts",
  "n",
  "h",
  "m",
  "y",
  "r",
  "w",
];

export const ROW_LABELS: Record<RowId, string> = {
  a: "あ — voyelles",
  k: "か — K",
  sh: "さ — S/SH",
  ts: "た — T/TS",
  n: "な — N",
  h: "は — H/F",
  m: "ま — M",
  y: "や — Y",
  r: "ら — R",
  w: "わ — W / ん",
};

export const DEFAULT_PROGRESS: GameProgress = {
  hiragana: { level: 0, successes: {}, failStreaks: {} },
  katakana: { level: 0, successes: {}, failStreaks: {} },
};

export const DEFAULT_MISTAKES: MistakeStats = {
  hiragana: {},
  katakana: {},
};
