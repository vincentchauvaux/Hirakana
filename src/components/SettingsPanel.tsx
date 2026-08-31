import { X } from "lucide-react";
import type { Preferences } from "../hooks/usePreferences";
import type { MistakeEntry, ScriptId } from "../types";

interface SettingsPanelProps {
  open: boolean;
  preferences: Preferences;
  currentScript: ScriptId;
  topMistakes: MistakeEntry[];
  onClose: () => void;
  onUpdatePreferences: (patch: Partial<Preferences>) => void;
  onResetScript: (script: ScriptId) => void;
  onResetAll: () => void;
}

export default function SettingsPanel({
  open,
  preferences,
  currentScript,
  topMistakes,
  onClose,
  onUpdatePreferences,
  onResetScript,
  onResetAll,
}: SettingsPanelProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 id="settings-title" className="text-lg font-semibold">
            Préférences
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          <section>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Quiz</h3>
            <label className="block text-xs text-slate-400 mb-2">
              Nombre de propositions
            </label>
            <div className="flex gap-2">
              {([4, 6] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onUpdatePreferences({ answerCount: count })}
                  className={`flex-1 py-2.5 rounded-lg transition-colors ${
                    preferences.answerCount === count
                      ? "bg-sky-500 text-white font-medium"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {count} choix
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Points difficiles
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Ces caractères reviennent plus souvent dans le quiz.
            </p>
            {topMistakes.length > 0 ? (
              <ul className="space-y-2">
                {topMistakes.map((entry) => (
                  <li
                    key={entry.romaji}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-700/50 text-sm"
                  >
                    <span>
                      <span className="text-lg mr-2">{entry.char}</span>
                      <span className="text-slate-300">{entry.romaji}</span>
                    </span>
                    <span className="text-rose-300 tabular-nums">
                      {entry.count} erreur{entry.count > 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                Aucune erreur enregistrée pour{" "}
                <span className="capitalize">{currentScript}</span>.
              </p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Progression
            </h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onResetScript(currentScript)}
                className="py-2.5 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left text-sm"
              >
                Réinitialiser{" "}
                <span className="capitalize">{currentScript}</span>
              </button>
              <button
                type="button"
                onClick={() => onResetScript("hiragana")}
                className="py-2.5 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left text-sm"
              >
                Réinitialiser hiragana
              </button>
              <button
                type="button"
                onClick={() => onResetScript("katakana")}
                className="py-2.5 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left text-sm"
              >
                Réinitialiser katakana
              </button>
              <button
                type="button"
                onClick={onResetAll}
                className="py-2.5 px-4 rounded-lg bg-rose-900/50 hover:bg-rose-900/70 text-rose-200 transition-colors text-left text-sm"
              >
                Tout réinitialiser
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
