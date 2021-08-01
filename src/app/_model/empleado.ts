import { Detalle } from "./detalle";
import { Pais } from "./pais";

export class Empleado {
  id: number;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otroNombre: string;
  pais: Pais;
  tipoIdentificacion: Detalle;
  numeroIdentificacion: string;
  email: string;
  fechaIngreso: string;
  area: Detalle;
  estado: Detalle;
  fechaHoraRegistro: string;
  fechaHoraEdicion: string;
}

