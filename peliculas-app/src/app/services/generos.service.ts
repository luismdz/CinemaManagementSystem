import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { GeneroDTO } from '../models/generos.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  private apiUrl = environment.apiURL + '/generos';

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodos(): Observable<GeneroDTO[]> {
    return this.http.get<GeneroDTO[]>(`${this.apiUrl}/list`);
  }

  obtenerTodosPorPagina(pageNumber: number = 1, pageSize: number = 50): Observable<GeneroDTO[]> {

    pageNumber = (pageNumber < 1) ? 1: pageNumber;
    pageSize = (pageSize < 5) ? 5: pageSize;
    
    return this.http.get<GeneroDTO[]>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  obtenerGeneroPorId(id: number) {
    return this.http.get<GeneroDTO>(`${this.apiUrl}/${id}`);
  }

  crearGenero(genero: GeneroDTO) {
    delete genero.id;
    return this.http.post(this.apiUrl, genero);
  }

  actualizarGenero(id: number, genero: GeneroDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, genero);
  }

  eliminarGenero(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
