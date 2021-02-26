export interface ActorDTO {
    id?: number | string;
    nombre: string;
    apellido: string;
    fechaNacimiento?: Date;
    foto?: File | string;
    biografia?: string;
    nombreCompleto?: string;
    personaje?: string;
}