type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3" aria-label={`진행률 ${progress}%`}>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/70 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#72A9F6] to-[#4F8FEA] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="min-w-12 text-right text-lg font-extrabold text-[#4F8FEA]">
        {progress}%
      </span>
    </div>
  );
}
