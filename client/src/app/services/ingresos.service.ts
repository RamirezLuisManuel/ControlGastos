import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingreso } from '../models/Ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private API_URI = 'http://localhost:3000/api/ingreso';

  constructor(private http: HttpClient) { }

  getIngresos(idUser: string): Observable<Ingreso[]> {
    return this.http.get<{ ingresos: Ingreso[] }>(`${this.API_URI}/${idUser}`).pipe(
      map(response => response.ingresos)
    );
  }  

  getIngreso(id: string, idUser: string): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.API_URI}/${idUser}/${id}`).pipe(
      map((ingreso: Ingreso) => {
        if (ingreso.FechaIngreso) {
          // Transformar FechaIngreso a YYYY-MM-DD
          ingreso.FechaIngreso = ingreso.FechaIngreso.split('T')[0];
        }
        return ingreso;
      })
    );
  }

  saveIngresos(idUser: string, ingreso: Ingreso): Observable<any> {
    return this.http.post<any>(`${this.API_URI}/${idUser}`, ingreso);
  } 

  deleteIngreso(id: string, idUser: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URI}/${idUser}/${id}`);
  }

  updateIngreso(id: string, idUser: string, ingreso: Ingreso): Observable<any> {
    return this.http.put<any>(`${this.API_URI}/${idUser}/${id}`, ingreso);
  }
}
