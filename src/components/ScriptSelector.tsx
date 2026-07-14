import type { ScriptId } from "../types";

interface ScriptSelectorProps {
  currentScript: ScriptId;
  onScriptChange: (script: ScriptId) => void;
}

export default function ScriptSelector({
  currentScript,
  onScriptChange,
}: ScriptSelectorProps) {
  return (
    <div
      className="flex mb-6 bg-slate-800 rounded-xl overflow-hidden w-full max-w-md p-1"
      role="tablist"
      aria-label="Choisir l'écriture"
    >
      {(["hiragana", "katakana"] as const).map((script) => (
        <button
          key={script}
          type="button"
          role="tab"
          aria-selected={currentScript === script}
          className={`flex-1 py-2.5 text-center rounded-lg transition-colors capitalize ${
            currentScript === script
              ? "bg-slate-700 text-white font-medium"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => onScriptChange(script)}
        >
          {script}
        </button>
      ))}
    </div>
  );
}
