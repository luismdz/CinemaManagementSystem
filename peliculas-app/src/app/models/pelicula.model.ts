import { GeneroDTO } from './generos.model';
import { CineDTO } from './cine.model';
import { ActorDTO, ActorPeliculaDTO } from './actor.model';

export interface PeliculaCreacionDTO {
  titulo: string;
  resumen?: string;
  trailer?: string;
  enCines: boolean;
  proximoEstreno?: boolean;
  fechaLanzamiento?: Date;
  poster?: File;
  generosIds?: number[];
  cinesIds?: number[];
  actores?: ActorDTO[];
}

export interface PeliculaDTO {
  id: number;
  titulo: string;
  resumen?: string;
  trailer?: string;
  enCines: boolean;
  proximoEstreno?: boolean;
  fechaLanzamiento?: Date;
  poster?: string;
  puntuacion: number;
  usuarioPuntuacion?: number;
  generos?: GeneroDTO[];
  cines?: CineDTO[];
  actores?: ActorPeliculaDTO[];
}
