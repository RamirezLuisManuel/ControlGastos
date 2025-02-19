import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = 'http://localhost:3000/api/ubicacion'; 

  constructor(private http: HttpClient) {}

  iniciarRuta(idUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar-ruta`, { idUsuario });
  }

  guardarUbicacion(idUsuario: number, idRuta: number, latitud: number, longitud: number, horaEntrada: string): Observable<any> {
    const body = { idUsuario, idRuta, latitud, longitud, horaEntrada };
    return this.http.post(`${this.apiUrl}/guardar`, body);
  }

  actualizarHoraSalida(idUbicacion: number, horaSalida: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar-salida`, { idUbicacion, horaSalida });
  }

  finalizarRuta(idRuta: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/finalizar-ruta`, { idRuta });
  }

  obtenerRutas(idUsuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rutas/${idUsuario}`);
  }
}
