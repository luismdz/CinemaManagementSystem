import { GeneroDTO } from './generos.model';
import { CineDTO } from './cine.model';
import { ActorDTO } from './actor.model';

export interface PeliculaCreacionDTO {
  titulo: string;
  resumen?: string;
  trailer?: string;
  enCines: boolean;
  proximoEstreno?: boolean;
  fechaLanzamiento?: Date;
  poster?: File;
  precio?: number;
  generosIds?: number[];
  cinesIds?: number[];
  actores?: [
    {
      id: number;
      personaje?: string;
    }
  ];
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
  precio?: number;
  generos?: GeneroDTO[];
  cines?: CineDTO[];
  actores?: ActorDTO[];
}
