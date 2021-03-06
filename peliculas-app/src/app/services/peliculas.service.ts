import { Injectable } from '@angular/core';
import { PeliculaCreacionDTO, PeliculaDTO } from '../models/pelicula.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActorPeliculaDTO } from '../models/actor.model';

@Injectable({
  providedIn: 'root',
})
export class PeliculasService {
  private apiUrl = environment.apiURL + '/peliculas';
  dataActualizada: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<PeliculaDTO[]> {
    return this.http.get<PeliculaDTO[]>(`${this.apiUrl}/list`).pipe(
      map((resp: PeliculaDTO[]) => {
        const peliculas = resp.map((p) => {
          return <PeliculaDTO>{
            ...p,
            fechaLanzamiento: new Date(p.fechaLanzamiento),
            proximoEstreno: new Date(p.fechaLanzamiento) > new Date(),
          };
        });

        return peliculas;
      })
    );
  }

  obtenerTodosPorPagina(
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<any> {
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageSize = pageSize < 5 ? 5 : pageSize;

    return this.http.get<any>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  obtenerLandingPageInfo() {
    return this.http.get<any>(`${this.apiUrl}/landingPage`);
  }

  filtrar(valores: any) {
    const params = new HttpParams({ fromObject: valores });

    return this.http
      .get<any>(`${this.apiUrl}/filtro`, {
        params,
        observe: 'response',
      })
      .pipe(map((resp) => resp.body));
  }

  crearPelicula(pelicula: PeliculaCreacionDTO) {
    const data = this.toFormData(pelicula);
    this.dataActualizada.next(true);
    return this.http.post(this.apiUrl, data);
  }

  obtenerPeliculaPorId(id: number) {
    return this.http.get<PeliculaDTO>(`${this.apiUrl}/${id}`).pipe(
      map((pelicula: PeliculaDTO) => {
        let cines = [];
        let actores = [];

        cines = pelicula.cines.map((cine) => {
          return {
            id: cine['id'],
            nombre: cine['nombre'],
            coordenadas: {
              latitud: cine['latitud'],
              longitud: cine['longitud'],
            },
          };
        });

        actores = pelicula.actores.map((actor: any) => {
          return <ActorPeliculaDTO>{
            id: actor.id,
            personaje: actor.personaje,
            foto: actor.foto,
            nombreCompleto: actor.nombre + ' ' + actor.apellido,
            orden: actor.orden,
          };
        });

        return {
          ...pelicula,
          fechaLanzamiento: new Date(pelicula.fechaLanzamiento),
          proximoEstreno: new Date(pelicula.fechaLanzamiento) > new Date(),
          cines,
          actores,
        };
      })
    );
  }

  actualizarPelicula(id: number, pelicula: PeliculaCreacionDTO) {
    const data = this.toFormData(pelicula);
    this.dataActualizada.next(true);
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarPelicula(id: number) {
    this.dataActualizada.next(true);
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Parsear datos del actor a un FormData para enviar a la api
  private toFormData(pelicula: PeliculaCreacionDTO): FormData {
    const formData = new FormData();

    formData.append('titulo', pelicula.titulo);
    formData.append('resumen', pelicula.resumen ?? '');
    formData.append('trailer', pelicula.trailer ?? '');
    formData.append('enCines', pelicula.enCines.toString());

    if (pelicula.fechaLanzamiento) {
      formData.append(
        'fechaLanzamiento',
        pelicula.fechaLanzamiento.toDateString()
      );
    }

    if (pelicula.poster && typeof pelicula.poster === 'object') {
      formData.append('poster', pelicula.poster);
    }

    if (pelicula.generosIds.length > 0) {
      formData.append('generosIds', JSON.stringify(pelicula.generosIds));
    }

    if (pelicula.cinesIds.length > 0) {
      formData.append('cinesIds', JSON.stringify(pelicula.cinesIds));
    }

    if (pelicula.actores.length > 0) {
      formData.append('actores', JSON.stringify(pelicula.actores));
    }

    return formData;
  }
}
