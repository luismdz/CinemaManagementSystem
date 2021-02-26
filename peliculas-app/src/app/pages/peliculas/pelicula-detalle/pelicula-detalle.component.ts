import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../../services/peliculas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaDTO } from 'src/app/models/pelicula.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { generateUrlYoutubeEmbed } from '../../../utilidades';

@Component({
  selector: 'app-pelicula-detalle',
  templateUrl: './pelicula-detalle.component.html',
  styleUrls: ['./pelicula-detalle.component.css'],
})
export class PeliculaDetalleComponent implements OnInit {
  pelicula: PeliculaDTO;
  trailerURL: SafeResourceUrl;
  cinesCoordenadas: any[] = [];

  constructor(
    private peliculaSvc: PeliculasService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitazer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.peliculaSvc.obtenerPeliculaPorId(params['id']).subscribe(
        (pelicula: PeliculaDTO) => {
          this.pelicula = pelicula;

          if (this.pelicula.trailer?.length > 0) {
            this.trailerURL = this.sanitazer.bypassSecurityTrustResourceUrl(
              generateUrlYoutubeEmbed(this.pelicula.trailer)
            );
          }

          this.cinesCoordenadas = this.pelicula.cines.map((c) => {
            return {
              ...c.coordenadas,
              mensaje: c.nombre,
            };
          });
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.router.navigateByUrl('/');
        }
      );
    });
  }
}
