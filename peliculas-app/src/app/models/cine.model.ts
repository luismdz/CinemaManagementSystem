export interface CineDTO {
    id?: number | string;
    nombre: string;
    coordenadas: {
        latitud: number,
        longitud: number
    };
}