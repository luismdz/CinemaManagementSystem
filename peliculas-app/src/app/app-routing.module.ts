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
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generos', component: GenerosComponent, canActivate: [AuthGuard] },
  {
    path: 'generos/edit',
    component: GenerosEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'generos/edit/:id',
    component: GenerosEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'cines', component: CinesComponent, canActivate: [AuthGuard] },
  {
    path: 'cines/edit',
    component: CinesEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cines/edit/:id',
    component: CinesEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'actores', component: ActoresComponent, canActivate: [AuthGuard] },
  {
    path: 'actores/edit',
    component: ActoresEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'actores/edit/:id',
    component: ActoresEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'peliculas/edit',
    component: PeliculasEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'peliculas/edit/:id',
    component: PeliculasEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'peliculas/buscar', component: PeliculasFiltroComponent },
  { path: 'peliculas/:id', component: PeliculaDetalleComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
