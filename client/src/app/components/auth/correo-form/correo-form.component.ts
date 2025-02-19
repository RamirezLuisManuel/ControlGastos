import { Component } from '@angular/core';
import { CorreoService } from '../../../services/correo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-token',
  templateUrl: './correo-form.component.html',
  styleUrls: ['./correo-form.component.css'],
})
export class AuthTokenComponent {
  token = '';
  mensaje = '';

  constructor(private correoService: CorreoService,
              private router: Router,) {}

  validarToken() {
    this.correoService.validarToken(this.token).subscribe(
      (response) => {
        this.mensaje = 'Autenticación exitosa ✅';
        this.router.navigate(['/inicio-usuario']);
        console.log(response);
      },
      (error) => {
        this.mensaje = 'Token inválido o expirado ❌';
        console.error(error);
      }
    );
  }
}
