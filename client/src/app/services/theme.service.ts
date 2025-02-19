import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      this.setDarkMode(isDark);
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }
}