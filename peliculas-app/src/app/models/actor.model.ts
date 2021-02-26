export interface ActorDTO {
  id?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento?: Date;
  foto?: File | string;
  biografia?: string;
  nombreCompleto?: string;
  personaje?: string;
}
