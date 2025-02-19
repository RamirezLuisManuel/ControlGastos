import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Gasto } from '../models/Gasto';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private API_URI = 'http://localhost:3000/api/gasto';

  constructor(private http: HttpClient) { }

  getGastos(idUser: string): Observable<Gasto[]> {
    return this.http.get<{ gastos: Gasto[] }>(`${this.API_URI}/${idUser}`).pipe(
      map(response => response.gastos)
    );
  }
  
  getGasto(id: string, idUser: string): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.API_URI}/${idUser}/${id}`).pipe(
      map((gasto: Gasto) => {
        if (gasto.FechaTransaccion) {
          gasto.FechaTransaccion = gasto.FechaTransaccion.split('T')[0];
        }
        return gasto;
      })
    );
  }

  saveGastos(idUser: string, gasto: Gasto): Observable<any> {
    return this.http.post<any>(`${this.API_URI}/${idUser}`, gasto);
  } 

  deleteGasto(id: string, idUser: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URI}/${idUser}/${id}`);
  }

  updateGasto(id: string, idUser: string, gasto: Gasto): Observable<any> {
    return this.http.put<any>(`${this.API_URI}/${idUser}/${id}`, gasto);
  }
}