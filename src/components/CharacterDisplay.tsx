interface CharacterDisplayProps {
  value: string;
  prompt: string;
  compact?: boolean;
}

export default function CharacterDisplay({
  value,
  prompt,
  compact = false,
}: CharacterDisplayProps) {
  const isRomaji = /^[a-z]+$/i.test(value);

  return (
    <div
      className={`flex flex-col items-center w-full max-w-md ${compact ? "mb-3" : "mb-6"}`}
    >
      <p
        className={`text-slate-400 ${compact ? "text-xs mb-1.5" : "text-sm mb-3"}`}
      >
        {prompt}
      </p>
      <div
        className={`bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-950/40 border border-slate-700/50 ${
          compact ? "w-24 h-24" : "w-32 h-32"
        }`}
      >
        <span
          className={`font-light ${
            compact
              ? isRomaji
                ? "text-3xl"
                : "text-5xl"
              : isRomaji
                ? "text-4xl"
                : "text-6xl"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
