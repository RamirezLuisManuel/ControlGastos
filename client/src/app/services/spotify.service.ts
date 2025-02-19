import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '9a607847709f4e528b6c9017b68d7eea';
  private clientSecret = '15d8a8c972db4c5f9a8a34898e11b452';
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  // Obtener el token de Spotify usando client_credentials
  getSpotifyToken(): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    return this.http.post<{ access_token: string }>(this.tokenUrl, body.toString(), { headers }).pipe(
      map(response => response.access_token),
      catchError(error => {
        console.error('Error obteniendo el token:', error);
        return throwError(error);
      })
    );
  }

  // Búsqueda de podcasts
  searchFinancePodcasts(accessToken: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    const params = new HttpParams()
      .set('q', 'finanzas OR dinero OR ahorro OR economía')
      .set('type', 'show')
      .set('market', 'ES')
      .set('limit', '11');

    return this.http.get<any>(`${this.apiUrl}/search`, { headers, params }).pipe(
      map(response => response.shows.items || []),
      catchError(error => {
        console.error('Error buscando podcasts:', error);
        return throwError(error);
      })
    );
  }

  // Obtener episodios de un podcast
  getPodcastEpisodes(accessToken: string, showId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any>(`${this.apiUrl}/shows/${showId}/episodes`, { headers }).pipe(
      map(response => response.items || []),
      catchError(error => {
        console.error('Error al obtener episodios:', error);
        return throwError(error);
      })
    );
  }
}
