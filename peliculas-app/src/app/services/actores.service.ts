import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActorDTO } from '../models/actor.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ActoresService {
  private apiUrl = environment.apiURL + '/actores';

  constructor(private http: HttpClient) {}

  obtenerTodos() {
    return this.http.get<ActorDTO[]>(`${this.apiUrl}/list`).pipe(
      map((resp) => {
        const actores = resp.map((actor) => {
          return {
            ...actor,
            nombreCompleto: actor.nombre + ' ' + actor.apellido,
          };
        });

        return actores;
      })
    );
  }

  obtenerTodosPorPagina(
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<ActorDTO[]> {
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageSize = pageSize < 5 ? 5 : pageSize;

    return this.http.get<ActorDTO[]>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  obtenerActorPorId(id: number) {
    return this.http.get<ActorDTO>(`${this.apiUrl}/${id}`);
  }

  obtenerActorPorNombre(nombre: string) {
    return this.http
      .get<ActorDTO[]>(`${this.apiUrl}/buscarPorNombre/${nombre}`)
      .pipe(
        map((resp) => {
          const actores = resp.map((actor) => {
            return {
              ...actor,
              nombreCompleto: actor.nombre + ' ' + actor.apellido,
            };
          });

          return actores;
        })
      );
  }

  crearActor(actor: ActorDTO) {
    delete actor.id;
    const data = this.toFormData(actor);

    return this.http.post(this.apiUrl, data);
  }

  actualizarActor(id: number, actor: ActorDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, actor);
  }

  eliminarActor(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Parsear datos del actor a un FormData para enviar a la api
  private toFormData(actor: ActorDTO): FormData {
    const formData = new FormData();

    formData.append('nombre', actor.nombre);
    formData.append('apellido', actor.apellido);

    if (actor.biografia) {
      formData.append('biografia', actor.biografia);
    }

    if (actor.foto && typeof actor.foto === 'object') {
      formData.append('foto', actor.foto);
    }

    if (actor.fechaNacimiento) {
      formData.append('fechaNacimiento', actor.fechaNacimiento.toDateString());
    }

    return formData;
  }
}
