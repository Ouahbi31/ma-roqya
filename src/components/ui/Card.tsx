import { type ReactNode } from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
}

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`bg-cream/40 rounded-2xl shadow-sm border border-cream-dark ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
