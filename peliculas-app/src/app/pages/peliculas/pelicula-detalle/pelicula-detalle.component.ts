import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../../services/peliculas.service';
import { RatingService } from '../../../services/rating.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaDTO } from 'src/app/models/pelicula.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { generateUrlYoutubeEmbed } from '../../../utilidades';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pelicula-detalle',
  templateUrl: './pelicula-detalle.component.html',
  styleUrls: ['./pelicula-detalle.component.css'],
})
export class PeliculaDetalleComponent implements OnInit {
  pelicula: PeliculaDTO;
  currentId = 0;
  trailerURL: SafeResourceUrl;
  cinesCoordenadas: any[] = [];
  rating = 0;

  constructor(
    private peliculaSvc: PeliculasService,
    private ratingSvc: RatingService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitazer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentId = +params['id'];
      this.cargarPelicula(this.currentId);
    });
  }

  cargarPelicula(id: number) {
    this.peliculaSvc.obtenerPeliculaPorId(id).subscribe(
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

        this.rating = this.pelicula.usuarioPuntuacion;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.router.navigateByUrl('/');
      }
    );
  }

  obtenerRating(newRating: number) {
    const rating = newRating;

    this.ratingSvc
      .rate({ peliculaId: this.pelicula.id, puntuacion: rating })
      .subscribe((resp) => {
        Swal.fire({
          title: 'Gracias por su voto',
          text: 'Su voto ha sido registrado existosamente!',
          icon: 'success',
        }).then(() => {
          this.rating = resp.puntuacion;
          this.cargarPelicula(this.currentId);
        });
      }),
      (err) => console.log(err);
  }
}
