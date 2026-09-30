import { useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";
const STORAGE_KEY = "theme";

/** Runs in <head> so a stored choice applies before the first paint. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/** "system" leaves the OS preference in charge; the others pin `data-theme` on <html>. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  useEffect(() => {
    const stored = document.documentElement.dataset.theme;
    if (stored === "light" || stored === "dark") setThemeState(stored);
  }, []);
  const setTheme = (next: Theme) => {
    setThemeState(next);
    if (next === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    // Storage can be blocked (private mode); the choice then lasts for this page only.
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };
  return [theme, setTheme] as const;
}
