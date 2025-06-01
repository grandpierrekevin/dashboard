import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "blue" | "green";

const themeColors = {
  light: {
    primary: "#2563eb",
    background: "#ffffff",
    text: "#1f2937",
  },
  dark: {
    primary: "#3b82f6",
    background: "#111827",
    text: "#f3f4f6",
  },
};

// Fonction utilitaire pour détecter le thème système
const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved && Object.keys(themeColors).includes(saved)) {
        return saved;
      }
    } catch {}
    return getSystemTheme();
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {}

    // Applique le thème
    const colors = themeColors[theme];
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty("--primary", colors.primary);
      document.documentElement.style.setProperty("--background", colors.background);
      document.documentElement.style.setProperty("--text", colors.text);
      
      // Gère le mode sombre
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Écoute les changements de préférences système
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return { theme, setTheme };
} 