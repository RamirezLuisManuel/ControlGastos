import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GastosService } from '../../services/gastos.service';
import { PresupuestosService } from '../../services/presupuestos.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-gasto-list',
  templateUrl: './gasto-list.component.html',
  styleUrls: ['./gasto-list.component.css']
})
export class GastoListComponent implements OnInit {
  gastos: any = [];
  notificationMessage: string | null = null;
  idUsuario: string | null = null;
  rolUsuario: string | null = null;
  presupuestos: any = [];

  constructor(
    private gastosService: GastosService,
    private presupuestosService: PresupuestosService,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuario = localStorage.getItem('IdUsuario');
      this.rolUsuario = localStorage.getItem('RolUsuario');

      if (this.idUsuario) {
        this.loadGastos(this.rolUsuario);
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

  loadGastos(rolUsuario: string | null) {
    if (this.idUsuario) {
      this.gastosService.getGastos(this.idUsuario).subscribe(
        (resp: any) => {
          if (rolUsuario === 'superAdmin' || rolUsuario === 'admin') {
            this.gastos = resp;
          } else {
            this.gastos = resp; 
          }
        },
        err => console.log(err)
      );
    }
  }

  deleteGasto(id: number) {
    if (this.idUsuario) {
      // El superAdmin puede eliminar cualquier gasto
      this.gastosService.deleteGasto(id.toString(), this.idUsuario).subscribe(
        () => {
          this.gastos = this.gastos.filter((gasto: any) => gasto.IdGasto !== id);
          this.loadPresupuestos();
          this.notificationService.showNotification('Gasto eliminado correctamente');
        },
        err => {
          console.error('Error al eliminar el gasto:', err);
          this.notificationService.showNotification('Error al eliminar el gasto');
        }
      );
    }
  }
  
  editGasto(id: number) {
    // El superAdmin puede editar cualquier gasto
    this.router.navigate(['/gastos/edit', id]);
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
