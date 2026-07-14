import type { KanaCharacter } from "../types";

interface CharacterDisplayProps {
  character: KanaCharacter;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
  return (
    <div className="flex flex-col items-center mb-8 w-full max-w-md">
      <p className="text-sm text-slate-400 mb-3">Quelle est la lecture ?</p>
      <div className="w-36 h-36 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-950/40 border border-slate-700/50">
        <span className="text-7xl font-light">{character.char}</span>
      </div>
    </div>
  );
}
