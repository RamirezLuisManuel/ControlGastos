import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servicio } from '../models/Servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private API_URI = 'http://localhost:3000/api/servicio';

  constructor(private http: HttpClient) { }

  getServicios(idUser: string): Observable<Servicio[]> {
    return this.http.get<{ servicios: Servicio[] }>(`${this.API_URI}/${idUser}`).pipe(
      map(response => response.servicios)
    );
  }

  getServicio(id: string, idUser: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.API_URI}/${idUser}/${id}`).pipe(
      map((servicio: Servicio) => {
        if (servicio.FechaServicio) {
          // Transformar FechaServicio a YYYY-MM-DD
          servicio.FechaServicio = servicio.FechaServicio.split('T')[0];
        }
        return servicio;
      })
    );
  }

  saveServicios(idUser: string, servicio: Servicio): Observable<any> {
    return this.http.post<any>(`${this.API_URI}/${idUser}`, servicio);
  }

  deleteServicio(id: string, idUser: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URI}/${idUser}/${id}`);
  }

  updateServicio(id: string, idUser: string, servicio: Servicio): Observable<any> {
    return this.http.put<any>(`${this.API_URI}/${idUser}/${id}`, servicio);
  }
}
