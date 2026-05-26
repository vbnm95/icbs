type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3" aria-label={`진행률 ${progress}%`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E9EEF4]">
        <div
          className="h-full rounded-full bg-[#75B0F4] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="min-w-10 text-right text-sm font-extrabold text-[#4B86FF]">
        {progress}%
      </span>
    </div>
  );
}
