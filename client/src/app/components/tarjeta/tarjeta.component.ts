import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { TarjetaService } from '../../services/tarjeta.service';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements AfterViewInit, OnInit {
  @ViewChild('tarjeta') tarjeta!: ElementRef;
  @ViewChild('btnAbrirFormulario') btnAbrirFormulario!: ElementRef;
  @ViewChild('formulario') formulario!: ElementRef;

  idUsuario: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public notificationService: NotificationService,
    private tarjetaService: TarjetaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('IdUsuario');

    if (!this.idUsuario) {
      alert('No se encontró el ID del usuario. Por favor, inicie sesión.');
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const numeroTarjeta = this.tarjeta.nativeElement.querySelector('.numero');
      const nombreTarjeta = this.tarjeta.nativeElement.querySelector('.nombre');
      const logoMarca = this.tarjeta.nativeElement.querySelector('#logo-marca');
      const firma = this.tarjeta.nativeElement.querySelector('.firma p');
      const mesExpiracion = this.tarjeta.nativeElement.querySelector('.mes');
      const yearExpiracion = this.tarjeta.nativeElement.querySelector('.year');
      const ccv = this.tarjeta.nativeElement.querySelector('.ccv');

      const mostrarFrente = () => {
        if (this.tarjeta.nativeElement.classList.contains('active')) {
          this.tarjeta.nativeElement.classList.remove('active');
        }
      };

      this.tarjeta.nativeElement.addEventListener('click', () => {
        this.tarjeta.nativeElement.classList.toggle('active');
      });

      this.btnAbrirFormulario.nativeElement.addEventListener('click', () => {
        this.btnAbrirFormulario.nativeElement.classList.toggle('active');
        this.formulario.nativeElement.classList.toggle('active');
      });

      for (let i = 1; i <= 12; i++) {
        const opcion = document.createElement('option');
        opcion.value = i.toString();
        opcion.innerText = i.toString();
        this.formulario.nativeElement.selectMes.appendChild(opcion);
      }

      const yearActual = new Date().getFullYear();
      for (let i = yearActual; i <= yearActual + 8; i++) {
        const opcion = document.createElement('option');
        opcion.value = i.toString();
        opcion.innerText = i.toString();
        this.formulario.nativeElement.selectYear.appendChild(opcion);
      }

      this.formulario.nativeElement.inputNumero.addEventListener('keyup', (e: KeyboardEvent) => {
        const valorInput = (e.target as HTMLInputElement).value
          .replace(/\s/g, '')
          .replace(/\D/g, '')
          .slice(0, 16)
          .replace(/([0-9]{4})/g, '$1 ')
          .trim();

        this.formulario.nativeElement.inputNumero.value = valorInput;

        const primerDigito = valorInput.charAt(0);
        if (valorInput.length > 0 && primerDigito !== '4' && primerDigito !== '5') {
          this.formulario.nativeElement.inputNumero.value = '';
          numeroTarjeta.textContent = '#### #### #### ####';
          logoMarca.innerHTML = '';
          return;
        }

        numeroTarjeta.textContent = valorInput || '#### #### #### ####';
        logoMarca.innerHTML = '';

        if (primerDigito === '4') {
          const imagen = document.createElement('img');
          imagen.src = '/assets/visa.png';
          imagen.style.width = '50px';
          imagen.style.height = 'auto';
          logoMarca.appendChild(imagen);
        } else if (primerDigito === '5') {
          const imagen = document.createElement('img');
          imagen.src = '/assets/mastercard.png';
          imagen.style.width = '50px';
          imagen.style.height = 'auto';
          logoMarca.appendChild(imagen);
        }

        mostrarFrente();
      });

      this.formulario.nativeElement.inputNombre.addEventListener('keyup', (e: KeyboardEvent) => {
        const valorInput = (e.target as HTMLInputElement).value
          .replace(/[^a-zA-Z\s]/g, '')
          .slice(0, 30);

        this.formulario.nativeElement.inputNombre.value = valorInput;

        nombreTarjeta.textContent = valorInput || 'Nombre Completo';
        firma.textContent = valorInput || '';

        mostrarFrente();
      });

      this.formulario.nativeElement.selectMes.addEventListener('change', (e: Event) => {
        mesExpiracion.textContent = (e.target as HTMLSelectElement).value;
        mostrarFrente();
      });

      this.formulario.nativeElement.selectYear.addEventListener('change', (e: Event) => {
        yearExpiracion.textContent = (e.target as HTMLSelectElement).value.slice(2);
        mostrarFrente();
      });

      this.formulario.nativeElement.inputCCV.addEventListener('keyup', () => {
        if (!this.tarjeta.nativeElement.classList.contains('active')) {
          this.tarjeta.nativeElement.classList.toggle('active');
        }

        ccv.textContent = this.formulario.nativeElement.inputCCV.value.replace(/\s/g, '').replace(/\D/g, '');
      });

      this.formulario.nativeElement.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        if (!this.idUsuario) {
          alert('No se pudo obtener el ID del usuario. Intente nuevamente.');
          return;
        }

        this.notificationService.showNotification('Tarjeta procesada (sin servicio)');
        this.router.navigate(['/paypal']); 
      });

      this.formulario.nativeElement.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        const tarjetaData = {
          NumeroTarjeta: this.formulario.nativeElement.inputNumero.value,
          NombreTitular: this.formulario.nativeElement.inputNombre.value,
          FechaVencimiento: `${this.formulario.nativeElement.selectMes.value}/${this.formulario.nativeElement.selectYear.value}`,
          CVV: this.formulario.nativeElement.inputCCV.value,
          IdUsuario: this.idUsuario
        };

        this.tarjetaService.addTarjeta(tarjetaData).subscribe(
          (response) => {
            this.notificationService.showNotification('Tarjeta agregada exitosamente');
            this.router.navigate(['/paypal']);  
          },
          (error) => {
            console.error('Error al agregar la tarjeta:', error);
            this.notificationService.showNotification('Error al agregar la tarjeta');
          }
        );
      });
    }
  }
}
