import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private API_URI = 'http://localhost:3000/api/correos';

  constructor(private http: HttpClient) {}

  enviarSuperToken(userId: number): Observable<any> {
    return this.http.post(`${this.API_URI}/enviar-correo`, { userId });
  }

  validarToken(token: string): Observable<any> {
    return this.http.post(`${this.API_URI}/validar-token`, { token });
  }
}
