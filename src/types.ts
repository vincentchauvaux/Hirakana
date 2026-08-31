export type ScriptId = "hiragana" | "katakana";

export type QuizMode = "choice" | "text";

export type AnswerCount = 4 | 6 | 8 | 10;

export const ANSWER_COUNT_OPTIONS: AnswerCount[] = [4, 6, 8, 10];

/** 0 = pas de limite de répétition par niveau */
export type MaxAppearances = 0 | 1 | 2 | 3 | 5;

export const MAX_APPEARANCE_OPTIONS: MaxAppearances[] = [1, 2, 3, 5, 0];

export type RowId = "a" | "k" | "sh" | "ts" | "n";

export interface KanaCharacter {
  char: string;
  row: RowId;
  romaji: string;
}

export interface ScriptProgress {
  level: number;
  masteredRomaji: string[];
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

export const ROW_ORDER: RowId[] = ["a", "k", "sh", "ts", "n"];

export const ROW_LABELS: Record<RowId, string> = {
  a: "あ — voyelles",
  k: "か — K",
  sh: "さ — S/SH",
  ts: "た — T/TS",
  n: "な — N",
};

export const DEFAULT_PROGRESS: GameProgress = {
  hiragana: { level: 0, masteredRomaji: [] },
  katakana: { level: 0, masteredRomaji: [] },
};

export const DEFAULT_MISTAKES: MistakeStats = {
  hiragana: {},
  katakana: {},
};
