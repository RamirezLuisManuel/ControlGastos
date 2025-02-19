import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URI = 'http://localhost:3000/api/usuario'; 

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<{ usuarios: Usuario[] }>(`${this.API_URI}/`).pipe(
      map(response => response.usuarios)
    );
  }

  createUser(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.API_URI}/`, usuario);
  }

  checkUsername(Usuario: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.API_URI}/${Usuario}`).pipe(
      map(response => response.exists)
    );
  }

  getUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URI}/${id}`);
  }


}