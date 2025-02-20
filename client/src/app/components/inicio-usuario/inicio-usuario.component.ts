import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ViewChild, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PresupuestosService } from '../../services/presupuestos.service';
import { Router } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';
import { TweetService } from '../../services/tweet.service';
import { VideoService } from '../../services/video.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/Usuario';
import { FinancesService } from '../../services/finances.service';
@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPopup') videoPopup: ElementRef | undefined;
  @ViewChild('messageInput') messageInput!: ElementRef;
  query: string = '';
  results: any[] = [];
  searchPerformed: boolean = false;
  chatMessages: { type: string; text: string }[] = [];
  presupuestos: any = [];
  idUsuario: string | null = null;
  tweets: any[] = [];
  isTweetsPopupVisible: boolean = false;
  videos: any[] = [];
  selectedVideoUrl: string | null = null;
  isYoutubePopupVisible: boolean = false;
  isTelegramPopupVisible: boolean = false;
  isGooglePopupVisible: boolean = false;
  videoUrl: string;
  chatId: string = '6661979365';
  usuario: Usuario | null = null;
  errorMessage: string | null = null;
  isMenuVisible: boolean = false;
  rolUsuario: string | null = null;
  isDarkMode: boolean = false;
  isFinhubPopupVisible: boolean = false; // Nueva bandera para mostrar/ocultar popup de Finanzas
  notificationMessage: string | null = null;
  stockData: any; // Almacena los datos de la acción para la API de Finnhub
  ticker: string = ''; // Cambia este valor según el ticker que desees consultar para la API de Finnhub
  loading: boolean = false; // Para manejar el estado de carga para la API de Finnhub 
  recommendations: any; //Para las recomendaciones del mercado API Finnhub
  companyNews: any;  //Para la compania de la que se desea ver la noticias 
  receiveMessage: any;

  suggestions: string[] = [
    "Cómo hacer un presupuesto",
    "Consejos para ahorrar dinero",
    "Inversiones para principiantes",
    "Errores comunes en el control de gastos",
    "Cómo mejorar la salud financiera",
    "Consejos de finanzas personales"
  ];
  
  filteredSuggestions: string[] = [];
  

  private apiKey: string = 'AIzaSyCkCmBeyvOnhnsPpaIv31_h9T4blk0Sy8A';
  private searchEngineId: string = '72c53c886ef4f4338';

  private offsetX = 0;
  private offsetY = 0;
  private isDragging = false;

  initialPosition = { lat: 19.433668, lng: -99.115728 };
  center: google.maps.LatLngLiteral = this.initialPosition;
  zoom = 15;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  markers: google.maps.Marker[] = [];

  constructor(
    private presupuestosService: PresupuestosService,
    private tweetService: TweetService,
    private http: HttpClient,
    private telegramService: TelegramService,
    private renderer: Renderer2,
    private videoService: VideoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private stockService: FinancesService, //Servicio de finhub (finanzas).
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuario = localStorage.getItem('IdUsuario');
      this.rolUsuario = localStorage.getItem('RolUsuario'); // Recuperar el rol del usuario

      if (this.idUsuario && this.rolUsuario) {
        this.loadUsuario();
        this.loadPresupuestos();
        this.loadTweets();
      } else {
        console.error('Usuario no autenticado o rol no disponible');
        this.router.navigate(['/login']);
      }
    } else {
      console.warn('No se puede acceder a localStorage en el lado del servidor.');
      this.router.navigate(['/login']);
    }
  }
  
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('load', () => {
        this.getCurrentLocation();
      });
    }
  }

  loadUsuario() {
    if (this.idUsuario) {
      this.usuarioService.getUsuarioPorId(this.idUsuario).subscribe(
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

  loadPresupuestos() {
    if (this.idUsuario) {
      this.presupuestosService.getPresupuestos(this.idUsuario).subscribe(
        (resp: any) => {
          this.presupuestos = resp;
        },
        (err) => console.log(err)
      );
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.initializeMap();
        },
        (error) => {
          console.error('Error obteniendo la ubicación: ', error);
        }
      );
    } else {
      console.warn('Geolocalización no es soportada por este navegador.');
    }
  }

  initializeMap() {
    if (this.map?.googleMap) {
      this.addMarker(this.center);
    } else {
      console.error('Mapa no está inicializado.');
    }
  }

  addMarker(location: google.maps.LatLngLiteral) {
    this.clearMarkers();

    const marker = new google.maps.Marker({
      position: location,
      map: this.map.googleMap!,
      title: 'Estoy aquí'
    });

    this.markers.push(marker);
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  recenterMap() {
    if (this.map?.googleMap) {
      this.getCurrentLocation();
      this.map.googleMap.setZoom(14);
    }
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      console.log(event.latLng.toJSON());
    }
  }

  loadTweets() {
    this.tweetService.getTweets().subscribe(
      data => {
        this.tweets = data;
      },
      error => {
        console.error('Error al obtener tweets', error);
      }
    );
  }

  toggleTweetsPopup(): void {
    this.isTweetsPopupVisible = !this.isTweetsPopupVisible;
  }

  searchVideos(query: string) {
    this.videoService.searchVideos(query).subscribe(
      data => {
        this.videos = data.map((item: any) => ({
          title: item.snippet.title,
          videoId: item.id.videoId
        }));
      },
      error => console.error('Error al buscar videos', error)
    );
  }

  playVideo(videoId: string) {
    this.selectedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
    this.videoService.setSelectedVideoUrl(this.videoUrl);
  }

  toggleYoutubePopup(): void {
    this.isYoutubePopupVisible = !this.isYoutubePopupVisible;
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.offsetX = event.clientX - this.videoPopup!.nativeElement.offsetLeft;
    this.offsetY = event.clientY - this.videoPopup!.nativeElement.offsetTop;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.renderer.setStyle(this.videoPopup!.nativeElement, 'left', `${event.clientX - this.offsetX}px`);
      this.renderer.setStyle(this.videoPopup!.nativeElement, 'top', `${event.clientY - this.offsetY}px`);
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  toggleTelegramPopup(): void {
    this.isTelegramPopupVisible = !this.isTelegramPopupVisible;
  }

  sendMessage(): void {
    const message = this.messageInput.nativeElement.value;
    if (message.trim()) {
        this.chatMessages.push({ type: 'outgoing', text: message });

        this.telegramService.sendMessage(this.chatId, message).subscribe(
            (response) => {
                if (response && response.message) {
                    this.chatMessages.push({ type: 'incoming', text: response.message });

                    if (response.redirect) {
                        if (/creación de gastos/i.test(response.message)) {
                            this.router.navigate(['gastos/add']);
                        } else if (/listado de gastos/i.test(response.message)) {
                            this.router.navigate(['gastos/list']);
                        } else if (/creación de ingresos/i.test(response.message)) {
                            this.router.navigate(['ingresos/add']);
                        } else if (/listado de ingresos/i.test(response.message)) {
                            this.router.navigate(['ingresos/list']);
                        } else if (/creación de servicios/i.test(response.message)) {
                            this.router.navigate(['servicios/add']);
                        } else if (/listado de servicios/i.test(response.message)) {
                            this.router.navigate(['servicios/list']);
                        } else if (/resumen/i.test(response.message)) {
                            this.router.navigate(['resumen']);
                        }
                    }
                } else {
                    console.error('Respuesta del servidor no contiene un mensaje');
                }
            },
            (error) => {
                console.error('Error enviando mensaje al bot de Telegram', error);
            }
        );

        this.messageInput.nativeElement.value = '';
    }
}



  performSearch() {
    if (this.query.trim() === '') return;

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(this.query)}&key=${this.apiKey}&cx=${this.searchEngineId}`;

    this.http.get<any>(url).subscribe(
      (data) => {
        this.results = data.items || [];
        this.searchPerformed = true;
        this.filteredSuggestions = [];
      },
      (error) => {
        console.error('Error:', error);
        this.results = [];
        this.searchPerformed = true;
      }
    );
  }

  toggleGooglePopup(): void {
    this.isGooglePopupVisible = !this.isGooglePopupVisible;
    if (this.isGooglePopupVisible) {
      const randomIndex = Math.floor(Math.random() * this.suggestions.length);
      this.query = this.suggestions[randomIndex];
    }
  }
  

  onInputChange(query: string) {
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInsidePopup = target.closest('.floating-container, .nav-links, .icon-bar');
    if (!isInsidePopup) {
      this.isTweetsPopupVisible = false;
      this.isYoutubePopupVisible = false;
      this.isTelegramPopupVisible = false;
      this.isGooglePopupVisible = false;
    }
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  
    const body = document.body;
    if (this.isMenuVisible) {
      body.classList.add('no-scroll'); // Bloquea el scroll
    } else {
      body.classList.remove('no-scroll'); // Permite el scroll
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  //Api de FinHube
  toggleFinhubPopup(): void {
    this.isFinhubPopupVisible = !this.isFinhubPopupVisible;
  }

  // Consulta de datos financieros
  fetchStockData(ticker: string) {
    this.loading = true;
    this.errorMessage = '';

    this.stockService.getStockData(ticker).subscribe(
      (data: any) => {
        this.stockData = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }

  fetchRecommendationTrends(ticker: string) {
    this.loading = true;
    this.stockService.getRecommendationTrends(ticker).subscribe(
      (recommendations: any) => {
        this.recommendations = recommendations;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }

  fetchRecentCompanyNews(ticker: string) {
    this.loading = true;
    this.stockService.getRecentCompanyNews(ticker).subscribe(
      (news: any) => {
        this.companyNews = news;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.ticker) {
      this.fetchStockData(this.ticker);
      this.fetchRecommendationTrends(this.ticker);
      this.fetchRecentCompanyNews(this.ticker);
      this.searchPerformed = true;
    }
  }

  //Metodo para acceso rapido a apartados (gastos, ingresos, servicios)
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}


