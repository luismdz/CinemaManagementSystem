export interface CineDTO {
  id?: number;
  nombre: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
}
