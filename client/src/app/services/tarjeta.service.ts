import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  private apiUrl = 'http://localhost:3000/api/tarjetas';  

  constructor(private http: HttpClient) { }

  addTarjeta(tarjetaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, tarjetaData);
  }
  
  getTarjetasByUsuario(idUsuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${idUsuario}`);
  }
  
  simularTransferencia(transferenciaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transferencia`, transferenciaData);
  }  

  eliminarTarjeta(idTarjeta: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${idTarjeta}`);
}

}
