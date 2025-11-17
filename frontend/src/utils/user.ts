import type { UserPreferences } from "../types";

export function getUserPreferences(): UserPreferences | null {
  const stored = localStorage.getItem('retro_user_prefs');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setUserPreferences(prefs: UserPreferences): void {
  localStorage.setItem('retro_user_prefs', JSON.stringify(prefs));
}

export function clearUserPreferences(): void {
  localStorage.removeItem('retro_user_prefs');
}

export function getUsername(): string | null {
  const prefs = getUserPreferences();
  return prefs?.username ?? null;
}

export function shouldShowUsername(): boolean {
  const prefs = getUserPreferences();
  return prefs?.showUsername ?? false;
}
