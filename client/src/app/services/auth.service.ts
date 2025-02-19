import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor() {}

    // Método para obtener el usuario logueado
    getLoggedUser() {
        return JSON.parse(localStorage.getItem('user') || '{}'); // Simulación
    }
}
