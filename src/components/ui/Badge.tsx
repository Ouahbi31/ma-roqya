import { type ReactNode } from "react";

type BadgeVariant = "green" | "gold" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-green-light/15 text-green-islamic border border-green-light/30",
  gold: "bg-gold/15 text-gold border border-gold/30",
  default: "bg-cream text-text-secondary border border-cream-dark",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
