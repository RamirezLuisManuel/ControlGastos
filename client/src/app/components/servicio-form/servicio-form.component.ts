import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../models/Servicio';
import { ServiciosService } from '../../services/servicios.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-servicio-form',
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.css']
})
export class ServicioFormComponent implements OnInit {

  servicio: Servicio = {
    Producto: '',
    Cantidad: '',
    Cliente: '',
    Estado: '',
    Monto: '',
    FechaServicio: ''
  };

  isEditMode = false;
  servicioId: string | null = '';
  errorMessages: { [key: string]: string } = {};
  idUsuario: string | null = null;

  constructor(
    private serviciosService: ServiciosService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('IdUsuario'); 
    this.servicioId = this.route.snapshot.paramMap.get('id');
    if (this.servicioId) {
      this.isEditMode = true;
      this.serviciosService.getServicio(this.servicioId, this.idUsuario).subscribe(
        (servicio: Servicio) => {
          if (servicio.FechaServicio) {
            // Transformar FechaServicio a YYYY-MM-DD
            servicio.FechaServicio = servicio.FechaServicio.split('T')[0];
          }
          this.servicio = servicio;
        },
        err => console.log(err)
      );
    }
  }

  validateForm(): boolean {
    this.errorMessages = {};
  
    if (!this.servicio.Producto) {
      this.errorMessages['Producto'] = 'Seleccione el producto*';
    }
    if (!this.servicio.Cantidad) {
      this.errorMessages['Cantidad'] = 'Escriba la cantidad de producto(s)*';
    }
    if (!this.servicio.Cliente) {
      this.errorMessages['Cliente'] = 'Escriba el nombre del cliente*';
    }
    if (!this.servicio.Estado) {
      this.errorMessages['Estado'] = 'Seleccione el estado actual*';
    }
    if (!this.servicio.Monto || isNaN(Number(this.servicio.Monto)) || Number(this.servicio.Monto) <= 0) {
      this.errorMessages['Monto'] = 'Ingrese un monto válido (debe ser un número positivo)*';
    }
    if (!this.servicio.FechaServicio) {
      this.errorMessages['FechaServicio'] = 'Seleccione una fecha*';
    }

    return Object.keys(this.errorMessages).length === 0;
  }

  saveServicio() {
    if (this.validateForm()) {
      console.log('IdUsuario:', this.idUsuario);
      console.log('Servicio:', this.servicio);

      const monto = Number(this.servicio.Monto);

      if (isNaN(monto) || monto <= 0) {
        this.errorMessages['Monto'] = 'Ingrese un monto válido (debe ser un número positivo)*';
        return;
      }

      this.servicio.Monto = monto.toString();

      if (this.isEditMode && this.servicioId) {
        this.serviciosService.updateServicio(this.servicioId, this.idUsuario, this.servicio).subscribe(
          res => {
            console.log(res);
            this.notificationService.showNotification('Servicio actualizado correctamente');
            this.router.navigate(['/servicios/list']);
          },
          err => {
            console.log(err);
            this.notificationService.showNotification('Error al actualizar el servicio');
          }
        );
      } else {
        this.serviciosService.saveServicios(this.idUsuario, this.servicio).subscribe(
          res => {
            console.log(res);
            this.notificationService.showNotification('Servicio guardado correctamente');
            this.router.navigate(['/servicios/list']);
          },
          err => {
            console.log(err);
            this.notificationService.showNotification('Error al guardar el servicio');
          }
        );
      }
    }
  }
}
