import type { KanaCharacter } from "../types";

interface CharacterDisplayProps {
  character: KanaCharacter;
  compact?: boolean;
}

export default function CharacterDisplay({
  character,
  compact = false,
}: CharacterDisplayProps) {
  return (
    <div
      className={`flex flex-col items-center w-full max-w-md ${compact ? "mb-3" : "mb-6"}`}
    >
      <p
        className={`text-slate-400 ${compact ? "text-xs mb-1.5" : "text-sm mb-3"}`}
      >
        Quelle est la lecture ?
      </p>
      <div
        className={`bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-950/40 border border-slate-700/50 ${
          compact ? "w-24 h-24" : "w-32 h-32"
        }`}
      >
        <span className={compact ? "text-5xl font-light" : "text-6xl font-light"}>
          {character.char}
        </span>
      </div>
    </div>
  );
}
