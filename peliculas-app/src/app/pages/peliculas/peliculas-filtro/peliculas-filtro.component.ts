import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneroDTO } from '../../../models/generos.model';
import { PeliculasService } from '../../../services/peliculas.service';
import { PeliculaDTO } from '../../../models/pelicula.model';
import { GenerosService } from '../../../services/generos.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-peliculas-filtro',
  templateUrl: './peliculas-filtro.component.html',
  styleUrls: ['./peliculas-filtro.component.css'],
})
export class PeliculasFiltroComponent implements OnInit {
  generos: GeneroDTO[];
  peliculas: any[];
  filterForm: FormGroup;
  hasError = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private peliculasSvc: PeliculasService,
    private generoSvc: GenerosService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      titulo: '',
      generoId: 0,
      enCines: false,
      proximosEstrenos: false,
    });

    this.generoSvc
      .obtenerTodos()
      .subscribe((generos: GeneroDTO[]) => (this.generos = generos));

    this.leerParamUrl();

    this.filterForm.valueChanges.subscribe((values) => {
      this.filtrarPeliculas(values);
      this.escribirParamUrl();
    });
  }

  private leerParamUrl() {
    this.route.queryParams.subscribe((params: any) => {
      const generoId = isNaN(+params['generoId']) ? 0 : +params['generoId'];
      const obj = { ...params, generoId };

      this.filterForm.patchValue(obj);

      this.filtrarPeliculas(this.filterForm.value);
    });
  }

  private escribirParamUrl() {
    const queryString = [];
    const rutaActual = this.route.snapshot.routeConfig.path;

    const {
      titulo,
      generoId,
      enCines,
      proximosEstrenos,
    } = this.filterForm.value;

    if (titulo.length > 0) {
      queryString.push(`titulo=${titulo}`);
    }

    if (generoId !== 0 && !isNaN(generoId)) {
      queryString.push(`generoId=${generoId}`);
    }

    if (enCines) {
      queryString.push(`enCines=${enCines}`);
    }

    if (proximosEstrenos) {
      queryString.push(`proximosEstrenos=${proximosEstrenos}`);
    }

    this.location.replaceState(rutaActual, queryString.join('&'));
  }

  filtrarPeliculas(values: any): void {
    // Filtro desde BackEnd
    this.peliculas = null;
    values.pageNumber = this.currentPage;
    values.pageSize = this.pageSize;

    this.peliculasSvc.filtrar(values).subscribe(
      (resp: any) => {
        this.peliculas = resp.data;
        this.totalRecords = resp.totalRecords;
      },
      () => {
        this.hasError = true;
        this.peliculas = [];
      }
    );
  }

  limpiarFiltros() {
    this.filterForm.patchValue({
      titulo: '',
      generoId: 0,
      enCines: false,
      proximosEstrenos: false,
    });
  }

  actualizarPagina(page: PageEvent) {
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.filtrarPeliculas(this.filterForm.value);
  }
}
