import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SecurityContext } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// External dependencies Modules
import { NgxSpinnerModule } from 'ngx-spinner';
import { MarkdownModule } from 'ngx-markdown';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FlexLayoutModule } from '@angular/flex-layout';

// Components
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './pages/home/home.component';
import { ListadoPeliculasComponent } from './pages/peliculas/listado-peliculas/listado-peliculas.component';
import { PeliculasEditComponent } from './pages/peliculas/peliculas-edit/peliculas-edit.component';
import { GenerosComponent } from './pages/generos/generos.component';
import { GenerosEditComponent } from './pages/generos/generos-edit/generos-edit.component';
import { ActoresComponent } from './pages/actores/actores.component';
import { ActoresEditComponent } from './pages/actores/actores-edit/actores-edit.component';
import { CinesComponent } from './pages/cines/cines.component';
import { CinesEditComponent } from './pages/cines/cines-edit/cines-edit.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { PeliculasFiltroComponent } from './pages/peliculas/peliculas-filtro/peliculas-filtro.component';
import { InputImgComponent } from './components/input-img/input-img.component';
import { InputMarkdownComponent } from './components/input-markdown/input-markdown.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { SelectorMultipleComponent } from './components/selector-multiple/selector-multiple.component';
import { AutocompleteActoresComponent } from './pages/actores/autocomplete-actores/autocomplete-actores.component';
import { PeliculaDetalleComponent } from './pages/peliculas/pelicula-detalle/pelicula-detalle.component';
import { RatingComponent } from './components/rating/rating.component';
import { ImagePipe } from './pipes/image.pipe';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    ListadoPeliculasComponent,
    PeliculasEditComponent,
    GenerosComponent,
    GenerosEditComponent,
    ActoresComponent,
    ActoresEditComponent,
    CinesComponent,
    CinesEditComponent,
    BuscadorComponent,
    PeliculasFiltroComponent,
    InputImgComponent,
    InputMarkdownComponent,
    MapaComponent,
    SelectorMultipleComponent,
    AutocompleteActoresComponent,
    PeliculaDetalleComponent,
    ImagePipe,
    RatingComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    LeafletModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
