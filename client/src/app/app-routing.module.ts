import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrarseComponent } from './components/auth/registrarse/registrarse.component';
import { InicioUsuarioComponent } from './components/inicio-usuario/inicio-usuario.component';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { GastoFormComponent } from './components/gasto-form/gasto-form.component';
import { IngresoListComponent } from './components/ingreso-list/ingreso-list.component';
import { IngresoFormComponent } from './components/ingreso-form/ingreso-form.component';
import { ServicioFormComponent } from './components/servicio-form/servicio-form.component';
import { ServicioListComponent } from './components/servicio-list/servicio-list.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { SoporteTecnicoComponent } from './components/soporte-tecnico/soporte-tecnico.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { AuthTokenComponent } from './components/auth/correo-form/correo-form.component';
import { PostTweetComponent } from './components/post-tweet/post-tweet.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'inicio-usuario', component: InicioUsuarioComponent },
  { path: 'gastos/list', component: GastoListComponent},
  { path: 'gastos/add', component: GastoFormComponent},
  { path: 'gastos/edit/:id', component: GastoFormComponent },
  { path: 'ingresos/list', component: IngresoListComponent},
  { path: 'ingresos/add', component: IngresoFormComponent},
  { path: 'ingresos/edit/:id', component: IngresoFormComponent },
  { path: 'servicios/add', component: ServicioFormComponent},
  { path: 'servicios/list', component: ServicioListComponent},
  { path: 'servicios/edit/:id', component: ServicioFormComponent },
  { path: 'usuario', component: UsuarioComponent},
  { path: "resumen", component: ResumenComponent},
  { path: "soporte-tecnico", component: SoporteTecnicoComponent},
  { path: "ubicacion", component: UbicacionComponent},
  { path: "paypal", component: PaypalComponent},
  { path: "tarjeta", component: TarjetaComponent},
  { path: "spotify", component: SpotifyComponent},
  { path: "correo", component: AuthTokenComponent},
  { path: "post-tweets", component: PostTweetComponent},
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

