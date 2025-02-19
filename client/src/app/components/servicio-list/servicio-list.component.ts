import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ServiciosService } from '../../services/servicios.service';
import { PresupuestosService } from '../../services/presupuestos.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-servicio-list',
  templateUrl: './servicio-list.component.html',
  styleUrls: ['./servicio-list.component.css']
})
export class ServicioListComponent implements OnInit {
  servicios: any = [];
  notificationMessage: string | null = null;
  idUsuario: string | null = null;
  rolUsuario: string | null = null; 
  presupuestos: any = [];

  constructor(
    private serviciosService: ServiciosService,
    private presupuestosService: PresupuestosService,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuario = localStorage.getItem('IdUsuario');
      this.rolUsuario = localStorage.getItem('RolUsuario'); 

      if (this.idUsuario) {
        this.loadServicios(this.rolUsuario);
        this.loadPresupuestos();
      } else {
        console.error('Usuario no autenticado');
        this.router.navigate(['/login']);
      }
    } else {
      console.warn('No se puede acceder a localStorage en el lado del servidor.');
      this.router.navigate(['/login']);
    }

    this.notificationService.notification$.subscribe(message => {
      this.notificationMessage = message;
    });
  }

  loadServicios(rolUsuario: string | null) {
    if (this.idUsuario) {
      this.serviciosService.getServicios(this.idUsuario).subscribe(
        (resp: any) => {
          if (rolUsuario === 'admin') {
            this.servicios = resp; 
          } else {
            this.servicios = resp; 
          }
        },
        err => console.log(err)
      );
    }
  }

  deleteServicio(id: number) {
    if (this.idUsuario) {
      if (this.rolUsuario === 'admin') {
        this.serviciosService.deleteServicio(id.toString(), this.idUsuario).subscribe(
          () => {
            this.servicios = this.servicios.filter((servicio: any) => servicio.IdServicio !== id);
            this.loadPresupuestos();
            this.notificationService.showNotification('Servicio eliminado correctamente');
          },
          err => console.log(err)
        );
      } else {
        this.serviciosService.deleteServicio(id.toString(), this.idUsuario).subscribe(
          () => {
            this.servicios = this.servicios.filter((servicio: any) => servicio.IdServicio !== id);
            this.loadPresupuestos();
            this.notificationService.showNotification('Servicio eliminado correctamente');
          },
          err => console.log(err)
        );
      }
    }
  }

  editServicio(id: number) {
    if (this.rolUsuario === 'admin') {
      this.router.navigate(['/servicios/edit', id]);
    } else {
      this.router.navigate(['/servicios/edit', id]);
    }
  }

  loadPresupuestos() {
    if (this.idUsuario) {
      this.presupuestosService.getPresupuestos(this.idUsuario).subscribe(
        (resp: any) => {
          this.presupuestos = resp;
        },
        err => console.log(err)
      );
    }
  }
}
