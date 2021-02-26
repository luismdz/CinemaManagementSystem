import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CineDTO } from '../models/cine.model';

@Injectable({
  providedIn: 'root',
})
export class CineService {
  private apiUrl = environment.apiURL + '/cines';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<CineDTO[]> {
    return this.http.get<CineDTO[]>(`${this.apiUrl}/list`).pipe(
      map((resp) => {
        let data: any[] = resp;

        data = data.map((d: any) => {
          return {
            id: d['id'],
            nombre: d['nombre'],
            coordenadas: {
              latitud: d['latitud'],
              longitud: d['longitud'],
            },
          };
        });

        return data;
      })
    );
  }

  obtenerTodosPorPagina(
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<CineDTO[]> {
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageSize = pageSize < 5 ? 5 : pageSize;

    return this.http
      .get<CineDTO[]>(
        `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      )
      .pipe(
        map((resp) => {
          let data: any[] = resp['data'];

          data = data.map((d: any) => {
            return {
              id: d['id'],
              nombre: d['nombre'],
              coordenadas: {
                latitud: d['latitud'],
                longitud: d['longitud'],
              },
            };
          });

          return {
            ...resp,
            data,
          };
        })
      );
  }

  obtenerCinePorId(id: number) {
    return this.http.get<CineDTO>(`${this.apiUrl}/${id}`).pipe(
      map((resp: any) => {
        const cine: CineDTO = {
          id: resp.id,
          nombre: resp.nombre,
          coordenadas: {
            latitud: resp.latitud,
            longitud: resp.longitud,
          },
        };

        return cine;
      })
    );
  }

  crearCine(cine: CineDTO) {
    delete cine.id;

    const data = {
      nombre: cine.nombre,
      latitud: cine.coordenadas.latitud,
      longitud: cine.coordenadas.longitud,
    };

    return this.http.post(this.apiUrl, data);
  }

  actualizarCine(id: number, cine: CineDTO) {
    const data = {
      nombre: cine.nombre,
      latitud: cine.coordenadas.latitud,
      longitud: cine.coordenadas.longitud,
    };

    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarCine(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
