interface ArabescqueSeparatorProps {
  className?: string;
}

export default function ArabescqueSeparator({
  className = "",
}: ArabescqueSeparatorProps) {
  return (
    <div
      className={`my-6 h-[2px] w-full ${className}`}
      style={{
        background:
          "linear-gradient(to right, transparent, #F5A623, #2E6AB8, #F5A623, transparent)",
      }}
    />
  );
}
