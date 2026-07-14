interface ProgressBarProps {
  progress: number;
  label: string;
  detail: string;
}

export default function ProgressBar({
  progress,
  label,
  detail,
}: ProgressBarProps) {
  return (
    <div className="w-full max-w-md mb-6">
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>{label}</span>
        <span>{detail}</span>
      </div>
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-sky-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
