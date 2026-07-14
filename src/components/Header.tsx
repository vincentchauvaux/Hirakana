import { RotateCcw, Settings2 } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export default function Header({ onReset, showReset }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-6 w-full max-w-md">
      <div className="flex items-center gap-2">
        <span className="text-sky-400 font-bold text-2xl tracking-tight">
          いカ
        </span>
        <div>
          <h1 className="text-xl font-bold leading-tight">HiraKata</h1>
          <p className="text-xs text-slate-400">Hiragana & Katakana</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Réinitialiser la progression"
            aria-label="Réinitialiser la progression"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
        <Settings2 className="w-5 h-5 text-slate-500" aria-hidden />
      </div>
    </header>
  );
}
