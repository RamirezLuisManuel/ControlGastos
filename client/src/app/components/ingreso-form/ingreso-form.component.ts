import { Component, OnInit } from '@angular/core';
import { Ingreso } from '../../models/Ingreso';
import { IngresosService } from '../../services/ingresos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-ingreso-form',
  templateUrl: './ingreso-form.component.html',
  styleUrls: ['./ingreso-form.component.css']
})
export class IngresoFormComponent implements OnInit {

  ingreso: Ingreso = {
    TipoIngreso: '',
    OrigenIngreso: '',
    Categoria: '',
    Monto: '',
    FechaIngreso: ''
  };

  isEditMode = false;
  ingresoId: string | null = '';
  errorMessages: { [key: string]: string } = {};
  idUsuario: string | null = null;

  constructor(
    private ingresosService: IngresosService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('IdUsuario'); 
    this.ingresoId = this.route.snapshot.paramMap.get('id');
    if (this.ingresoId) {
      this.isEditMode = true;
      this.ingresosService.getIngreso(this.ingresoId, this.idUsuario).subscribe(
        (ingreso: Ingreso) => {
          if (ingreso.FechaIngreso) {
            // Transformar FechaIngreso a YYYY-MM-DD
            ingreso.FechaIngreso = ingreso.FechaIngreso.split('T')[0];
          }
          this.ingreso = ingreso;
        },
        err => console.log(err)
      );
    }
  }

  validateForm(): boolean {
    this.errorMessages = {};

    if (!this.ingreso.TipoIngreso) {
      this.errorMessages['TipoIngreso'] = 'Seleccione un tipo de ingreso*';
    }
    if (!this.ingreso.OrigenIngreso) {
      this.errorMessages['OrigenIngreso'] = 'Ingrese el origen del ingreso*';
    }
    if (!this.ingreso.Categoria) {
      this.errorMessages['Categoria'] = 'Seleccione una categoría*';
    }
    if (!this.ingreso.Monto || isNaN(Number(this.ingreso.Monto)) || Number(this.ingreso.Monto) <= 0) {
      this.errorMessages['Monto'] = 'Ingrese un monto válido (debe ser un número positivo)*';
    }
    if (!this.ingreso.FechaIngreso) {
      this.errorMessages['FechaIngreso'] = 'Seleccione una fecha*';
    }

    return Object.keys(this.errorMessages).length === 0;
  }

  saveIngreso() {
    if (this.validateForm()) {
      console.log('IdUsuario:', this.idUsuario);
      console.log('Ingreso:', this.ingreso);

      const monto = Number(this.ingreso.Monto);

      if (isNaN(monto) || monto <= 0) {
        this.errorMessages['Monto'] = 'Ingrese un monto válido (debe ser un número positivo)*';
        return;
      }

      this.ingreso.Monto = monto.toString();

      if (this.isEditMode && this.ingresoId) {
        this.ingresosService.updateIngreso(this.ingresoId, this.idUsuario, this.ingreso).subscribe(
          res => {
            console.log(res);
            this.notificationService.showNotification('Ingreso actualizado correctamente');
            this.router.navigate(['/ingresos/list']);
          },
          err => {
            console.log(err);
            this.notificationService.showNotification('Error al actualizar el ingreso');
          }
        );
      } else {
        this.ingresosService.saveIngresos(this.idUsuario, this.ingreso).subscribe(
          res => {
            console.log(res);
            this.notificationService.showNotification('Ingreso guardado correctamente');
            this.router.navigate(['/ingresos/list']);
          },
          err => {
            console.log(err);
            this.notificationService.showNotification('Error al guardar el ingreso');
          }
        );
      }
    }
  }
}
