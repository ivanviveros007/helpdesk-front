import { cn } from "@/lib/cn";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export function Spinner({ className, size = "md", label = "Cargando..." }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3" role="status">
      <span
        className={cn(
          "animate-spin rounded-full border-2 border-slate-200 border-t-blue-600",
          sizeMap[size],
          className
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
