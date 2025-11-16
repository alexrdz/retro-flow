export function getUsername(): string | null {
  return localStorage.getItem('retro_username');
}

export function setUsername(username: string): void {
  localStorage.setItem('retro_username', username);
}

export function clearUsername(): void {
  localStorage.removeItem('retro_username');
}
