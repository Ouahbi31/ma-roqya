interface ProgressBarProps {
  value: number;
  color?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  color = "bg-green-islamic",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`w-full h-2.5 bg-cream-dark rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
