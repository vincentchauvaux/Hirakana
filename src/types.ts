export type ScriptId = "hiragana" | "katakana";

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
