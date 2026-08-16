import { browser } from "$app/environment";

const THEME_KEY = "theme";

type Theme = "light" | "dark";

class ThemeStore {
  current = $state<Theme>("light");

  init() {
    if (!browser) return;
    this.current = document.documentElement.classList.contains("dark") ? "dark" : "light";
  }

  set(theme: Theme) {
    this.current = theme;
    if (!browser) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }

  toggle() {
    this.set(this.current === "dark" ? "light" : "dark");
  }
}

export const theme = new ThemeStore();

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

/** Shortcut "d" untuk ganti tema — dipasang sekali dari root layout. */
export function registerThemeHotkey() {
  if (!browser) return () => {};

  function onKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.repeat) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.toLowerCase() !== "d") return;
    if (isTypingTarget(event.target)) return;
    theme.toggle();
  }

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
