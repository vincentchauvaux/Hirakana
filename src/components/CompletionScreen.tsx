import { Trophy } from "lucide-react";
import type { ScriptId } from "../types";

interface CompletionScreenProps {
  script: ScriptId;
  totalCharacters: number;
  onReset: () => void;
  onSwitchScript: () => void;
}

export default function CompletionScreen({
  script,
  totalCharacters,
  onReset,
  onSwitchScript,
}: CompletionScreenProps) {
  const otherScript = script === "hiragana" ? "katakana" : "hiragana";

  return (
    <div className="w-full max-w-md text-center bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mb-4">
        <Trophy className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Bravo !</h2>
      <p className="text-slate-300 mb-1">
        Vous maîtrisez les {totalCharacters} caractères{" "}
        <span className="capitalize">{script}</span>.
      </p>
      <p className="text-sm text-slate-400 mb-6">
        Passez à l'autre écriture ou recommencez pour vous entraîner.
      </p>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onSwitchScript}
          className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 transition-colors font-medium"
        >
          Continuer en {otherScript}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          Recommencer {script}
        </button>
      </div>
    </div>
  );
}
