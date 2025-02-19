import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { LoginComponent } from './components/auth/login/login.component';
import { RegistrarseComponent } from './components/auth/registrarse/registrarse.component';
import { HomeComponent } from './components/home/home.component';
import { InicioUsuarioComponent } from './components/inicio-usuario/inicio-usuario.component';
import { GastoFormComponent } from './components/gasto-form/gasto-form.component';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { IngresoFormComponent } from './components/ingreso-form/ingreso-form.component';
import { IngresoListComponent } from './components/ingreso-list/ingreso-list.component';
import { ServicioFormComponent } from './components/servicio-form/servicio-form.component';
import { ServicioListComponent } from './components/servicio-list/servicio-list.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { SoporteTecnicoComponent } from './components/soporte-tecnico/soporte-tecnico.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SpotifyComponent } from './components/spotify/spotify.component';
import { PostTweetComponent } from './components/post-tweet/post-tweet.component';
import { AuthTokenComponent } from './components/auth/correo-form/correo-form.component';
import { FooterComponent } from './components/footer/footer.component';

registerLocaleData(localeEs, 'es');

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegistrarseComponent,
        InicioUsuarioComponent,
        GastoFormComponent,
        GastoListComponent,
        IngresoFormComponent,
        IngresoListComponent,
        ServicioFormComponent,
        ServicioListComponent,
        UsuarioComponent,
        ResumenComponent,
        SoporteTecnicoComponent,
        UbicacionComponent,
        PaypalComponent,
        TarjetaComponent,
        SafeUrlPipe,
        SpotifyComponent,
        PostTweetComponent,
        PostTweetComponent,
        AuthTokenComponent,
        FooterComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    GoogleMapsModule], providers: [
        { provide: LOCALE_ID, useValue: 'es' },
        provideHttpClient(withFetch()),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
