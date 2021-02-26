import { Component, OnInit } from '@angular/core';
import { CineService } from '../../services/cine.service';
import { CineDTO } from '../../models/cine.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-cines',
  templateUrl: './cines.component.html',
  styleUrls: ['./cines.component.css']
})
export class CinesComponent implements OnInit {

  cines: CineDTO[];
  isLoading: boolean;
  displayedColumns = ['number', 'nombre', 'acciones'];
  currentPage = 1;
  pageSize = 10;
  totalRecords: number = 0; 


  constructor(
    private cineSvc: CineService
  ) { }

  ngOnInit(): void {

    this.cargarDatos(this.currentPage, this.pageSize);

  }

  cargarDatos(pagina?: number, cantidadRegistros?: number) {
    
    this.isLoading = true;

    this.cineSvc.obtenerTodosPorPagina(pagina, cantidadRegistros)
      .subscribe((response:any) => {
        this.cines = response.data;
        this.totalRecords = response.totalRecords;
        this.isLoading = false;
        
      }, err => {
        
        console.error(err);
        this.isLoading = false;

      });

  } 

  eliminarCine(id: number) {

    if(id !== null || id !== undefined) {
      this.cineSvc.eliminarCine(id).subscribe(
        () => {
          this.cargarDatos(this.currentPage, this.pageSize);
        }, err => console.log(err)
      )
    }

  }

  actualizarPagina(page: PageEvent) {
 
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    // console.log(page);
    this.cargarDatos(this.currentPage, page.pageSize);
  }

}
