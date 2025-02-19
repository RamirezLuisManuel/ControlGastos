import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpotifyService } from '../../services/spotify.service';
import { PresupuestosService } from '../../services/presupuestos.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {
  notificationMessage: string | null = null;
  presupuestos: any = [];
  idUsuario: string | null = null;
  isAdmin: boolean;
  accessToken: string | null = null;
  selectedPodcastEmbedUrl: SafeResourceUrl | null = null;
  podcasts: any[] = [];
  selectedPodcastEpisodes: any[] = [];
  isLoadingPodcasts = false;
  error: string | null = null;

  constructor(
    private presupuestosService: PresupuestosService,
    private spotifyService: SpotifyService,
    private sanitizer: DomSanitizer // Inyección de DomSanitizer
  ) {}

  ngOnInit(): void {
    this.spotifyService.getSpotifyToken().subscribe({
      next: (token) => {
        this.accessToken = token;
        if (this.accessToken) {
          this.searchFinancePodcasts();
          this.loadPresupuestos();
        }
      },
      error: (error) => {
        console.error('Error al obtener el token:', error);
      }
    });
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

  searchFinancePodcasts(): void {
    this.isLoadingPodcasts = true;
    this.spotifyService.searchFinancePodcasts(this.accessToken as string).subscribe({
      next: (response) => {
        this.podcasts = response.filter(podcast => podcast.languages?.includes('es') || podcast.description.toLowerCase().includes('español') || podcast.languages?.includes('es') || 
        /dinero|ahorro|finanzas|economía/i.test(podcast.description) || 
        /dinero|ahorro|finanzas|economía/i.test(podcast.name));;
        this.isLoadingPodcasts = false;
      },
      error: (error) => {
        console.error('Error buscando podcasts:', error);
        this.error = 'Error al obtener podcasts';
        this.isLoadingPodcasts = false;
      }
    });
  }

// Método para seleccionar un podcast y crear el URL embebido
selectPodcast(podcastId: string): void {
  const url = `https://open.spotify.com/embed/show/${podcastId}`;
  this.selectedPodcastEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}
