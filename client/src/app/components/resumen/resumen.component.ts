import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { GastosService } from '../../services/gastos.service';
import { IngresosService } from '../../services/ingresos.service';
import { ServiciosService } from '../../services/servicios.service';
import { Gasto } from '../../models/Gasto';
import { Ingreso } from '../../models/Ingreso';
import { Servicio } from '../../models/Servicio';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { VideoService } from '../../services/video.service';
import { ElementRef, Renderer2 } from '@angular/core';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  @ViewChild('videoPopup') videoPopup: ElementRef | undefined;
  gastos: Gasto[] = [];
  ingresos: Ingreso[] = [];
  servicios: Servicio[] = [];
  resumen: any[] = [];
  resumenOriginal: any[] = []; 
  IdUsuario: string | null = null;
  rolUsuario: string | null = null; 
  videoUrl: string | null = null;
  videos: any[] = [];
  selectedVideoUrl: string | null = null;
  isYoutubePopupVisible: boolean = false;

  private offsetX = 0;
  private offsetY = 0;
  private isDragging = false;

  constructor(
    private gastoService: GastosService,
    private ingresoService: IngresosService,
    private renderer: Renderer2,
    private videoService: VideoService,
    private servicioService: ServiciosService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.IdUsuario = localStorage.getItem('IdUsuario');
      this.rolUsuario = localStorage.getItem('RolUsuario'); // Obtener el rol del usuario
      if (this.IdUsuario) {
        this.getAllData();
      } else {
        console.error('Usuario no autenticado');
      }
      this.videoService.selectedVideoUrl$.subscribe(url => {
        this.videoUrl = url; 
      });
    } else {
      console.error('localStorage no está disponible en este entorno');
    }
  }

  createPdf() {
    const tableBody = [
      [{ text: 'Tipo', style: 'tableHeader' }, { text: 'Información', style: 'tableHeader' }, { text: 'Monto', style: 'tableHeader' }, { text: 'Fecha', style: 'tableHeader' }]
    ];

    if (this.rolUsuario === 'admin') {
      tableBody[0].splice(1, 0, { text: 'Usaurio al que pertenece', style: 'tableHeader' });
    }

    this.resumen.forEach(item => {
      const rowData = [
        item.type,
        item.Descripcion || item.OrigenIngreso || item.Producto,
        `$${item.Monto}`,
        new Date(item.FechaTransaccion || item.FechaIngreso || item.FechaServicio).toLocaleDateString()
      ];

      if (this.rolUsuario === 'admin') {
        rowData.splice(1, 0, item.NombreCompleto || 'N/A');
      }

      tableBody.push(rowData);
    });

    const pdfDefinition: any = {
      pageMargins: [40, 60, 40, 60],
      pageSize: 'A4',
      background: function (currentPage, pageSize) {
        return {
          canvas: [
            {
              type: 'rect',
              x: 10,
              y: 10,
              w: pageSize.width - 20,
              h: pageSize.height - 20,
              r: 1,
              lineWidth: 1,
              lineColor: '#000000'
            }
          ]
        };
      },
      content: [
        { text: 'Resumen Movimientos', style: 'header' },
        {
          style: 'tableExample',
          table: {
            body: tableBody,
            widths: this.rolUsuario === 'admin' ? ['20%', '25%', '25%', '15%', '15%'] : ['25%', '25%', '25%', '25%']
          },
          layout: {
            fillColor: function (rowIndex) {
              if (rowIndex === 0) {
                return '#3a3a3a';
              } else if (rowIndex % 2 === 0) {
                return '#f2f2f2';
              } else {
                return '#ffffff';
              }
            },
            hLineColor: '#CCCCCC',
            vLineColor: '#CCCCCC',
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'white',
        },
      }
    };

    pdfMake.createPdf(pdfDefinition).download('ResumenMovimientos.pdf');
  }

  getAllData() {
    if (this.IdUsuario) {
      this.gastoService.getGastos(this.IdUsuario).subscribe((data: Gasto[]) => {
        this.gastos = data;
        this.addToResumen(this.gastos, 'Gasto');
      }, error => {
        console.error('Error fetching gastos:', error);
      });

      this.ingresoService.getIngresos(this.IdUsuario).subscribe((data: Ingreso[]) => {
        this.ingresos = data;
        this.addToResumen(this.ingresos, 'Ingreso');
      }, error => {
        console.error('Error fetching ingresos:', error);
      });

      this.servicioService.getServicios(this.IdUsuario).subscribe((data: Servicio[]) => {
        this.servicios = data;
        this.addToResumen(this.servicios, 'Servicio');
      }, error => {
        console.error('Error fetching servicios:', error);
      });
    }
  }

  addToResumen(data: any[], type: string) {
    if (Array.isArray(data)) {
      data.forEach(item => {
        const resumenItem: any = {
          type: type,
          ...item
        };

        if (this.rolUsuario === 'admin') {
          resumenItem.NombreCompleto = item.NombreCompleto || 'Usuario'; // Para admin, agregamos el nombre completo
        }

        this.resumen.push(resumenItem);
      });
      this.resumenOriginal = [...this.resumen]; // Almacena una copia de los datos originales
    }
  }

  filterByType(type: string) {
    if (type === 'all') {
      this.resumen = [...this.resumenOriginal];
    } else {
      this.resumen = this.resumenOriginal.filter(item => item.type === type);
    }
  }

  onDateSelected(event: any) {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(0, 0, 0, 0); // Asegúrate de que la hora sea 00:00:00
  
    this.resumen = this.resumenOriginal.filter(item => {
      const itemDate = new Date(item.FechaTransaccion || item.FechaIngreso || item.FechaServicio);
      itemDate.setHours(0, 0, 0, 0); // Asegúrate de que la hora sea 00:00:00
  
      // Compara solo la parte de la fecha
      return (
        itemDate.getFullYear() === selectedDate.getFullYear() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getDate() === selectedDate.getDate()
      );
    });
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
}