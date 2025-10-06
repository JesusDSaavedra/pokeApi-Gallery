import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'pokemon-theme';
  private darkModeSubject = new BehaviorSubject<boolean>(this.loadTheme());

  darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  /**
   * Carga el tema desde localStorage
   */
  private loadTheme(): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored === 'dark';
    } catch (error) {
      return false;
    }
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveTheme(isDark: boolean): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  /**
   * Alterna entre modo oscuro y claro
   */
  toggleTheme(): void {
    const newTheme = !this.darkModeSubject.value;
    this.darkModeSubject.next(newTheme);
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
  }

  /**
   * Establece el modo oscuro
   */
  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    this.saveTheme(isDark);
    this.applyTheme(isDark);
  }

  /**
   * Obtiene el estado actual del tema
   */
  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
