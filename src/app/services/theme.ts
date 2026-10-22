import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private readonly storageKey = 'cardcrusher-theme';
  readonly mode = signal<ThemeMode>(this.getInitialMode());

  constructor() {
    this.apply(this.mode());
  }

  toggle() {
    const next: ThemeMode = this.mode() === 'light' ? 'dark' : 'light';
    this.mode.set(next);
    this.apply(next);

    try {
      localStorage.setItem(this.storageKey, next);
    } catch {}
  }

  private apply(mode: ThemeMode) {
    document.documentElement.setAttribute('data-theme', mode);
  }

  private getInitialMode(): ThemeMode {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {}
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}