export interface Cliente {
  id_cliente: number;
  user_id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  tmb: number;
  altura: number;
  peso: number;
  fecha_nacimiento: string;
  carbohidratos_g: number;
  proteina_g: number;
  grasas_g: number;
  borrado: boolean;
  id_entrenador: number;
  id_nivel_gym: number;
  id_nivel_actividad: number;
  id_genero: number;
  id_objetivo: number;
  id_membresia: number;
  fecha_inicio: string;
  fecha_fin: string;
  imagen: string;
}

export interface Alimento {
  id_alimento: number;
  nombre: string;
  calorias: number;
  proteina_g: number;
  carbohidratos_g: number;
  grasa_g: number;
  api_id_referencia: string;
  metrica_g: number;
  unidad_medida: string;
}

export interface Dispone {
  id_dispone: number;
  id_cliente: number;
  id_alimento: number;
  id_parte_dia: number;
  fecha: string;
  cantidad: number;
  tamaño_porcion_g: string;
  gramos: number;
}

export interface Rutina {
  id_rutina: number;
  id_entrenador: number;
  nombre: string;
  descripcion: string;
  enfoque: string;
  tipo: string;
}

export interface Ejercicio {
  id_ejercicio: number;
  nombre: string;
  musculo: string;
  equipamento: string;
  instrucciones: unknown[] | Record<string, unknown>;
  imagen?: string | null;
  objetivo: string;
}

export interface SeAsigna {
  id_rutina: number;
  id_ejercicio: number;
  id_cliente: number;
  notas?: string | null;
  tiempo_descanso?: number | null;
  serie: number;
  repeticiones: number;
  peso: number;
  fecha: string;
  dia: string;
  tipo: string;
  asignado?: string | null;
}

export interface ParteDia {
  id_parte_dia: number;
  nombre: string;
  icono: string;
}
