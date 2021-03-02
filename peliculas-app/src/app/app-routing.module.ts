import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GenerosComponent } from './pages/generos/generos.component';
import { GenerosEditComponent } from './pages/generos/generos-edit/generos-edit.component';
import { CinesComponent } from './pages/cines/cines.component';
import { ActoresComponent } from './pages/actores/actores.component';
import { PeliculasEditComponent } from './pages/peliculas/peliculas-edit/peliculas-edit.component';
import { CinesEditComponent } from './pages/cines/cines-edit/cines-edit.component';
import { ActoresEditComponent } from './pages/actores/actores-edit/actores-edit.component';
import { PeliculasFiltroComponent } from './pages/peliculas/peliculas-filtro/peliculas-filtro.component';
import { PeliculaDetalleComponent } from './pages/peliculas/pelicula-detalle/pelicula-detalle.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generos', component: GenerosComponent },
  { path: 'generos/edit', component: GenerosEditComponent },
  { path: 'generos/edit/:id', component: GenerosEditComponent },
  { path: 'cines', component: CinesComponent },
  { path: 'cines/edit', component: CinesEditComponent },
  { path: 'cines/edit/:id', component: CinesEditComponent },
  { path: 'actores', component: ActoresComponent },
  { path: 'actores/edit', component: ActoresEditComponent },
  { path: 'actores/edit/:id', component: ActoresEditComponent },
  { path: 'peliculas/edit', component: PeliculasEditComponent },
  { path: 'peliculas/edit/:id', component: PeliculasEditComponent },
  { path: 'peliculas/buscar', component: PeliculasFiltroComponent },
  { path: 'peliculas/:id', component: PeliculaDetalleComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
