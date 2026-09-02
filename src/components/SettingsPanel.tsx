import { ArrowLeft, X } from "lucide-react";
import type { Preferences } from "../hooks/usePreferences";
import { ANSWER_COUNT_OPTIONS, ANSWER_POOL_OPTIONS, MAX_APPEARANCE_OPTIONS, QUIZ_DIRECTION_OPTIONS, type MistakeEntry, type ScriptId } from "../types";

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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 sm:bg-black/60 sm:p-4">
      <div
        className="flex flex-col flex-1 sm:flex-none sm:max-h-[90vh] w-full sm:max-w-md sm:mx-auto sm:mt-auto sm:mb-auto bg-slate-800 sm:border sm:border-slate-700 sm:rounded-2xl shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
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

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <section>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Quiz</h3>
            <label className="block text-xs text-slate-400 mb-2">Mode</label>
            <div className="flex gap-2 mb-4">
              {(
                [
                  { id: "choice", label: "Choix multiples" },
                  { id: "text", label: "Saisie libre" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onUpdatePreferences({ quizMode: id })}
                  className={`flex-1 py-2.5 rounded-lg transition-colors text-sm ${
                    preferences.quizMode === id
                      ? "bg-sky-500 text-white font-medium"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="block text-xs text-slate-400 mb-2">
              Sens de l&apos;exercice
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Lire le kana, ou retrouver le kana à partir du romaji.
            </p>
            <div className="flex gap-2 mb-4">
              {QUIZ_DIRECTION_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onUpdatePreferences({ quizDirection: id })}
                  className={`flex-1 py-2.5 rounded-lg transition-colors text-sm ${
                    preferences.quizDirection === id
                      ? "bg-sky-500 text-white font-medium"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {preferences.quizMode === "choice" && (
              <>
                <label className="block text-xs text-slate-400 mb-2">
                  Nombre de propositions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ANSWER_COUNT_OPTIONS.map((count) => (
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
                <label className="block text-xs text-slate-400 mb-2 mt-4">
                  Source des propositions
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Mauvaises réponses tirées des rangées déjà vues, ou de tout
                  le syllabaire (plus difficile).
                </p>
                <div className="flex flex-col gap-2">
                  {ANSWER_POOL_OPTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onUpdatePreferences({ answerPool: id })}
                      className={`py-2.5 px-3 rounded-lg transition-colors text-sm ${
                        preferences.answerPool === id
                          ? "bg-sky-500 text-white font-medium"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
            <label className="block text-xs text-slate-400 mb-2 mt-4">
              Répétitions max par niveau
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Nombre de fois qu&apos;un même caractère peut être proposé avant
              de passer aux autres.
            </p>
            <div className="grid grid-cols-5 gap-2">
              {MAX_APPEARANCE_OPTIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onUpdatePreferences({ maxAppearances: count })}
                  className={`py-2.5 rounded-lg transition-colors text-sm ${
                    preferences.maxAppearances === count
                      ? "bg-sky-500 text-white font-medium"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {count === 0 ? "∞" : count}
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

        <div className="shrink-0 p-4 border-t border-slate-700 bg-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 transition-colors font-medium"
          >
            Retour au quiz
          </button>
        </div>
      </div>
    </div>
  );
}
