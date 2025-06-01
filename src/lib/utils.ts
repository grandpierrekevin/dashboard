import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colorMap = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  orange: "#f97316",
  red: "#ef4444",
  yellow: "#eab308",
  pink: "#ec4899",
  cyan: "#06b6d4",
} as const;

export type ColorKey = keyof typeof colorMap;

export function getColorClass(color: ColorKey) {
  return {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
  }[color];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getRandomColor(): ColorKey {
  const colors = Object.keys(colorMap) as ColorKey[];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getColorForValue(value: number, max: number): ColorKey {
  const percentage = value / max;
  if (percentage >= 0.8) return "green";
  if (percentage >= 0.6) return "blue";
  if (percentage >= 0.4) return "yellow";
  if (percentage >= 0.2) return "orange";
  return "red";
}

// Calcule Total, Moyenne, Maximum, Minimum à partir d'un tableau de valeurs numériques
export function getGlobalStats(values: number[]) {
  const total = values.reduce((a, b) => a + b, 0);
  const moyenne = values.length ? total / values.length : 0;
  const maximum = values.length ? Math.max(...values) : 0;
  const minimum = values.length ? Math.min(...values) : 0;
  return [
    { name: "Total", value: total },
    { name: "Moyenne", value: moyenne },
    { name: "Maximum", value: maximum },
    { name: "Minimum", value: minimum },
  ];
}
