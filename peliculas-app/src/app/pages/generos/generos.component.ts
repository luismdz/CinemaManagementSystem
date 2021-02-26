import { Component, OnInit } from '@angular/core';

import { GenerosService } from '../../services/generos.service';
import { GeneroDTO } from '../../models/generos.model';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.component.html',
  styleUrls: ['./generos.component.css'],
})
export class GenerosComponent implements OnInit {
  generos: GeneroDTO[];
  isLoading: boolean;
  displayedColumns = ['number', 'nombre', 'acciones'];
  currentPage = 1;
  pageSize = 10;
  totalRecords: number = 0;

  constructor(private generosSvc: GenerosService) {}

  ngOnInit(): void {
    this.cargarDatos(this.currentPage, this.pageSize);
  }

  cargarDatos(pagina?: number, cantidadRegistros?: number) {
    this.isLoading = true;

    this.generosSvc.obtenerTodosPorPagina(pagina, cantidadRegistros).subscribe(
      (response: any) => {
        this.generos = response.data;
        this.totalRecords = response.totalRecords;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  eliminarGenero(id: number) {
    if (id !== null || id !== undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Seguro que desea eliminar este género?',
        text: `No sera capaz de revertir esto.`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.generosSvc.eliminarGenero(id).subscribe(
            () => {
              this.cargarDatos(this.currentPage, this.pageSize);
              Swal.fire({
                title: 'Eliminado',
                text: 'El Género ha sido eliminado',
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

  actualizarPagina(page: PageEvent) {
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.cargarDatos(this.currentPage, page.pageSize);
  }
}
