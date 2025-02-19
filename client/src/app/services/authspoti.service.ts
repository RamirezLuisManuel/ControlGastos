import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  authService: any;
  spotifyService: any;
  podcasts: any[];

  constructor() {}

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  logout(): void {
    this.authService.clearAccessToken(); // Limpiar el token en AuthService
    this.spotifyService.clearCachedPodcasts(); // Limpiar podcasts cacheados en SpotifyService
    this.podcasts = []; // Limpiar la lista en el componente
    this.accessToken = null;
  }
}