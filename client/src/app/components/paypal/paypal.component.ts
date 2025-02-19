import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PresupuestosService } from '../../services/presupuestos.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { TarjetaService } from '../../services/tarjeta.service';
import { UsuarioService } from '../../services/usuario.service'; 
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
  presupuestos: any = [];
  tarjeta: any = null;
  idUsuario: string | null = null;
  nombreUsuario: string = ''; 
  saldoSeleccionado: number = 0;
  nuevoSaldo: number = 0;
  bancoOrigen: string = 'Buscando Banco';
  tarjetas: any[] = [];
  tarjetaSeleccionada: any = null;
  bancoAsignado: boolean = false;

  bancos: string[] = [
    'BBVA Bancomer',
    'Banco Santander',
    'HSBC México',
    'Banco del Bajío',
    'Banco Azteca',
    'Banco Inbursa',
    'Bancoppel',
    'Banco Ve por Más',
    'Banco Mercantil del Norte',
    'Bank of America México'
  ];

  constructor(
    private presupuestosService: PresupuestosService,
    public notificationService: NotificationService,
    private tarjetaService: TarjetaService,
    private usuarioService: UsuarioService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuario = localStorage.getItem('IdUsuario');
      if (this.idUsuario) {
        this.loadPresupuestos();
        this.loadTarjetas();
        this.bancoOrigen = this.seleccionarBancoAzar();
        this.loadNombreUsuario(); 
      } else {
        console.error('Usuario no autenticado');
        this.router.navigate(['/login']);
      }
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

  loadTarjetas() {
    if (this.idUsuario) {
      this.tarjetaService.getTarjetasByUsuario(this.idUsuario).subscribe(
        (resp: any) => {
          this.tarjetas = resp;
        },
        (err) => console.error(err)
      );
    }
  }

  loadNombreUsuario() {
    if (this.idUsuario) {
      this.usuarioService.getUsuarioPorId(this.idUsuario).subscribe(
        (usuario) => {
          this.nombreUsuario = usuario.Nombre; 
        },
        (err) => console.error(err)
      );
    }
  }

  seleccionarBancoAzar(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.bancos.length);
    return this.bancos[indiceAleatorio];
  }

  onTarjetaSeleccionada(tarjeta: any) {
    this.tarjetaSeleccionada = tarjeta;
    this.saldoSeleccionado = tarjeta.Saldo;

    if (!this.bancoAsignado) {
      this.bancoOrigen = this.seleccionarBancoAzar();
      this.bancoAsignado = true;
    }
  }

  confirmarTransferencia() {
    if (!this.tarjetaSeleccionada || this.nuevoSaldo <= 0) {
      console.error('Seleccione una tarjeta válida y asegúrese de ingresar un monto correcto.');
      return;
    }

    const transferenciaData = {
      IdUsuario: this.idUsuario,
      IdTarjeta: this.tarjetaSeleccionada.IdTarjeta,
      monto: this.nuevoSaldo,
    };

    this.tarjetaService.simularTransferencia(transferenciaData).subscribe(
      (resp: any) => {
        this.notificationService.showNotification('Transferencia realizada con éxito');
        this.saldoSeleccionado = resp.saldoRestante;

        const fechaTransaccion = new Date(resp.recibo.fecha); 
        this.generarReciboPDF(transferenciaData, resp.recibo.orderID, fechaTransaccion);
      },
      (err) => console.error('Error al realizar la transferencia', err)
    );
  }

  generarReciboPDF(transferenciaData: any, orderID: string, fechaTransaccion: Date) {
    const docDefinition = {
      content: [
        {
          text: 'PayPal Recibo de Transferencia',
          style: 'header',
          alignment: 'center',
          color: '#0070BA'
        },
        {
          text: `Orden ID: ${orderID}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10]
        },
        {
          text: 'Detalles Transferencia',
          style: 'sectionHeader',
          color: '#333333',
          margin: [0, 20]
        },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Nombre Usuario: ', bold: true },
                this.nombreUsuario, 
                '\n',
                { text: 'Tarjeta Vinculada: ', bold: true },
                this.obtenerUltimos4Digitos(this.tarjetaSeleccionada.NumeroTarjeta),
                '\n',
                { text: 'Monto Transferido: ', bold: true },
                `$${transferenciaData.monto}`,
                '\n',
                { text: 'Banco Fuente: ', bold: true },
                this.bancoOrigen
              ]
            },
            {
              width: '*',
              text: [
                { text: 'Fecha Transaccion: ', bold: true },
                fechaTransaccion.toLocaleDateString(), 
                '\n',
                { text: 'Descripcion Transferencia: ', bold: true },
                'Simulacion de transferencia',
              ]
            }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 18,
          margin: [0, 0, 0, 5]
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
      }
    };

    pdfMake.createPdf(docDefinition).download('recibo-transferencia.pdf');
  }

  obtenerUltimos4Digitos(numero: string): string {
    return `**** **** **** ${numero.slice(-4)}`;
  }

  eliminarTarjeta(idTarjeta: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
        this.tarjetaService.eliminarTarjeta(idTarjeta).subscribe(
            (resp) => {
                this.notificationService.showNotification('Tarjeta eliminada con éxito');
                this.loadTarjetas(); // Recargar las tarjetas para reflejar la eliminación
            },
            (err) => console.error('Error al eliminar la tarjeta', err)
        );
    }
}

}
