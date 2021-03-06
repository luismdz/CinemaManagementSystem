import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  usuarios: User[];
  isLoading: boolean;
  displayedColumns = ['number', 'nombre', 'email', 'isAdmin'];
  currentPage = 1;
  pageSize = 10;
  totalRecords: number = 0;

  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {
    this.cargarDatos(this.currentPage, this.pageSize);
  }

  cargarDatos(pagina?: number, cantidadRegistros?: number) {
    this.isLoading = true;

    this.authSvc.obtenerUsuariosPorPagina(pagina, cantidadRegistros).subscribe(
      (response: any) => {
        this.usuarios = response.data;
        this.totalRecords = response.totalRecords;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  toggleAdmin(value: boolean, user: User) {
    if (value) {
      Swal.fire({
        title: 'Otorgar privilegios de Administrador',
        text: 'Está seguro de realizar la operación?',
        confirmButtonText: 'Confirmar',
        showCancelButton: true,
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.authSvc.hacerAdmin(user.email).subscribe(() => {
              Swal.fire(
                'Exitoso',
                `El usuario ${user.email} ahora es administrador`,
                'success'
              );
              this.cargarDatos(this.currentPage, this.pageSize);
            });
          }
        })
        .finally(() => this.cargarDatos(this.currentPage, this.pageSize));
    } else {
      Swal.fire({
        title: 'Remover privilegios de Administrador',
        text: 'Está seguro de realizar la operación?',
        confirmButtonText: 'Confirmar',
        showCancelButton: true,
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.authSvc.removerAdmin(user.email).subscribe(() => {
              Swal.fire(
                'Exitoso',
                `El usuario ${user.email} ya no es administrador`,
                'success'
              );
              this.cargarDatos(this.currentPage, this.pageSize);
            });
          }
        })
        .finally(() => this.cargarDatos(this.currentPage, this.pageSize));
    }
  }

  actualizarPagina(page: PageEvent) {
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.cargarDatos(this.currentPage, page.pageSize);
  }
}
