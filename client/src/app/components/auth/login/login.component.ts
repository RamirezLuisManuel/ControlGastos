import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { NotificationService } from '../../../services/notification.service';
import { CorreoService } from '../../../services/correo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string | null = null;
  notificationMessage: string | null = null;
  passwordFieldType: string = 'password';

  username: string = '';
  password: string = '';

  constructor(
    private usuarioService: UsuarioService, 
    private correoService: CorreoService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(message => {
      this.notificationMessage = message;
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    const passwordInput = document.getElementById('exampleInputPassword1') as HTMLInputElement;
    passwordInput.type = this.passwordFieldType;
  }

  onSubmit(loginForm: any) {
    if (loginForm.invalid) {
      this.errorMessage = 'Los campos no pueden estar vacíos';
      return;
    }

    const { username, password } = loginForm.value;

    this.usuarioService.getUsuarios().subscribe(
      (usuarios: any[]) => {
        const usuario = usuarios.find(u => u.Usuario === username && u.Contrasena === password);

        if (usuario) {
          const userId = usuario.IdUsuario;

          // Guarda los datos del usuario
          localStorage.setItem('IdUsuario', userId);
          localStorage.setItem('RolUsuario', usuario.Rol);

          // Enviar súper token
          this.correoService.enviarSuperToken(userId).subscribe(
            (response) => {
              console.log('Correo enviado:', response);
              this.router.navigate(['/correo']);
              this.notificationService.showNotification('Inicio de sesión exitoso. Revisa tu correo.');
            },
            (error) => {
              console.error('Error al enviar correo:', error);
              this.errorMessage = 'Error al enviar el correo con el súper token.';
            }
          );
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Ocurrió un error al verificar el usuario. Intente nuevamente más tarde.';
      }
    );
  }

}
