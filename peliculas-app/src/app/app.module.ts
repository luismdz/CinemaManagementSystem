import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SecurityContext } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";

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
import { MarkdownModule } from 'ngx-markdown';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapaComponent } from './components/mapa/mapa.component';
import { SelectorMultipleComponent } from './components/selector-multiple/selector-multiple.component';
import { AutocompleteActoresComponent } from './pages/actores/autocomplete-actores/autocomplete-actores.component';
import { PeliculaDetalleComponent } from './pages/peliculas/pelicula-detalle/pelicula-detalle.component';
import { ImagePipe } from './pipes/image.pipe';

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
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
