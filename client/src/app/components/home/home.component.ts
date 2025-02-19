import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  notificationMessage: string | null = null;
  isMenuVisible: boolean = false;
  currentIndex: number = 0;
  isDarkMode: boolean = false;

  images = [
    { src: 'assets/mony1.jpg', text: '“Presupuesto claro, gastos bajo control.”' },
    { src: 'assets/imagen2.jpg', text: '“ControlGastos: tu asistente personal para el dinero.”' },
    { src: 'assets/imagen3.jpg', text: '“Cada gasto cuenta: regístralo y toma el control.”' },
    { src: 'assets/imagen4.jpg', text: '“Revisa y ajusta: el camino hacia unas finanzas saludables.”' }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(message => {
      this.notificationMessage = message;
    });
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}