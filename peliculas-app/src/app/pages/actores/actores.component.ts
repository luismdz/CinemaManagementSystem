import { Component, OnInit } from '@angular/core';
import { ActoresService } from '../../services/actores.service';
import { ActorDTO } from '../../models/actor.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-actores',
  templateUrl: './actores.component.html',
  styleUrls: ['./actores.component.css'],
})
export class ActoresComponent implements OnInit {
  actores: ActorDTO[];
  isLoading: boolean;
  displayedColumns = ['number', 'imagen', 'nombre', 'acciones'];
  currentPage = 1;
  pageSize = 10;
  totalRecords: number = 0;

  constructor(private actorSvc: ActoresService) {}

  ngOnInit(): void {
    this.cargarDatos(this.currentPage, this.pageSize);
  }

  cargarDatos(pagina?: number, cantidadRegistros?: number) {
    this.isLoading = true;

    this.actorSvc.obtenerTodosPorPagina(pagina, cantidadRegistros).subscribe(
      (response: any) => {
        this.actores = response.data;
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
      this.actorSvc.eliminarActor(id).subscribe(
        () => {
          this.cargarDatos(this.currentPage, this.pageSize);
        },
        (err) => console.log(err)
      );
    }
  }

  actualizarPagina(page: PageEvent) {
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.cargarDatos(this.currentPage, page.pageSize);
  }
}
