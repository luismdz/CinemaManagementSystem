export interface ActorDTO {
  id?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento?: Date;
  foto?: File | string;
  biografia?: string;
  personaje?: string;
}

export interface ActorPeliculaDTO {
  id: number;
  personaje: string;
  nombreCompleto?: string;
  foto?: string;
  orden?: number;
}
