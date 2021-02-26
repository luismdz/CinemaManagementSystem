import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { PeliculaDTO } from '../../models/pelicula.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  peliculasEnCines: PeliculaDTO[];
  peliculasFuturas: PeliculaDTO[];

  constructor(private peliculasSvc: PeliculasService) {
    this.peliculasSvc.dataActualizada.subscribe((value: boolean) => {
      if (value) {
        this.cargarPeliculas();
      }
    });
  }

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  private cargarPeliculas() {
    this.peliculasSvc.obtenerLandingPageInfo().subscribe(
      (peliculas: any) => {
        this.peliculasEnCines = peliculas.enCines;
        this.peliculasFuturas = peliculas.proximosEstrenos;
      },
      () => {
        this.peliculasEnCines = [];
        this.peliculasFuturas = [];
      }
    );
  }
}
