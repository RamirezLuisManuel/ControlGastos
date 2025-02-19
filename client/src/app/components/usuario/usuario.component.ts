import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario: Usuario | null = null;
  errorMessage: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    const idUsuario = localStorage.getItem('IdUsuario');
  
    if (idUsuario) {
      this.usuarioService.getUsuarioPorId(idUsuario).subscribe(
        (usuario: Usuario) => {
          this.usuario = usuario;
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.errorMessage = 'Ocurrió un error al cargar los detalles del usuario.';
        }
      );
    } else {
      this.errorMessage = 'No se ha encontrado el ID de usuario. Por favor, inicie sesión nuevamente.';
    }
  }
}


