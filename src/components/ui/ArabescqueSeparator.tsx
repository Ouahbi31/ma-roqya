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
          "linear-gradient(to right, transparent, #B5832A, #2D6A4F, #B5832A, transparent)",
      }}
    />
  );
}
