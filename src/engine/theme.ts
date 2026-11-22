import { useEffect, useState } from "react";
import { getState, setPrefs } from "./store";

function isDark(theme: "light" | "dark" | "system") {
  return theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export function applyTheme() {
  const dark = isDark(getState().prefs.theme);
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new CustomEvent("ml-theme", { detail: dark }));
}

export function setTheme(theme: "light" | "dark" | "system") {
  setPrefs({ theme });
  applyTheme();
}

export function toggleTheme() {
  setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
}

/** true bila mode gelap sedang aktif. */
export function useTheme(): boolean {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const h = (e: Event) => setDark((e as CustomEvent<boolean>).detail);
    window.addEventListener("ml-theme", h);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sys = () => {
      if (getState().prefs.theme === "system") applyTheme();
    };
    mq.addEventListener("change", sys);
    return () => {
      window.removeEventListener("ml-theme", h);
      mq.removeEventListener("change", sys);
    };
  }, []);
  return dark;
}
