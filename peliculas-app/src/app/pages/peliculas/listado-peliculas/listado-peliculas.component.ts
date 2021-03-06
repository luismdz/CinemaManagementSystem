import { Component, Input, OnInit } from '@angular/core';
import { PeliculaDTO } from '../../../models/pelicula.model';
import { PeliculasService } from '../../../services/peliculas.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-listado-peliculas',
  templateUrl: './listado-peliculas.component.html',
  styleUrls: ['./listado-peliculas.component.css'],
})
export class ListadoPeliculasComponent implements OnInit {
  @Input() peliculas: PeliculaDTO[] = [];
  user: User;

  constructor(
    private peliculaSvc: PeliculasService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.authSvc.user$.subscribe((user) => (this.user = user));
  }

  eliminarPelicula(id: number) {
    Swal.fire({
      icon: 'warning',
      title: 'Seguro que desea eliminar esta pelicula?',
      text: `No sera capaz de revertir esto.`,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.peliculaSvc.eliminarPelicula(id).subscribe(
          () => {
            Swal.fire({
              title: 'Eliminada',
              text: 'La pelicula ha sido eliminada',
              icon: 'success',
            });
          },
          (err: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error',
              text: `${err.message}`,
            }).then();
          }
        );
      }
    });
  }
}
