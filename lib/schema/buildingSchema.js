import { z } from "zod";

export const BuildingSchema = z.object({
  nombre_edificio: z
    .string()
    .trim()
    .min(1, "El nombre del edificio es requerido")
    .min(3, "El nombre del edificio debe tener al menos 3 caracteres"),

  direccion: z
    .string()
    .trim()
    .min(1, "La dirección es requerida")
    .min(5, "La dirección debe tener al menos 5 caracteres"),

  ciudad: z
    .string()
    .trim()
    .min(1, "La ciudad es requerida")
    .min(2, "La ciudad debe tener al menos 2 caracteres"),

  codigo_postal: z
    .string()
    .trim()
    .min(1, "El código postal es requerido")
    .regex(/^\d{4,6}$/, "El código postal debe tener entre 4 y 6 dígitos"),

  uso: z.string().trim().min(1, "El uso del edificio es requerido"),

  latitud: z
    .number({
      required_error: "La latitud es requerida",
      invalid_type_error: "La latitud debe ser un número",
    })
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90"),

  longitud: z
    .number({
      required_error: "La longitud es requerida",
      invalid_type_error: "La longitud debe ser un número",
    })
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180"),

  inspector: z
    .number({
      required_error: "El inspector es requerido",
      invalid_type_error: "El inspector debe ser un número",
    })
    .int("El inspector debe ser un número entero")
    .positive("El inspector debe ser un número positivo"),

  fecha_registro_edificio: z.date({
    required_error: "La fecha de registro es requerida",
    invalid_type_error: "La fecha de registro debe ser una fecha válida",
  }),

  numero_pisos: z
    .number({
      required_error: "El número de pisos es requerido",
      invalid_type_error: "El número de pisos debe ser un número",
    })
    .int("El número de pisos debe ser un número entero")
    .positive("El número de pisos debe ser positivo"),

  area_total: z
    .number({
      required_error: "El área total es requerida",
      invalid_type_error: "El área total debe ser un número",
    })
    .positive("El área total debe ser positiva"),

  anio_construccion: z
    .number({
      required_error: "El año de construcción es requerido",
      invalid_type_error: "El año de construcción debe ser un número",
    })
    .int("El año de construcción debe ser un número entero")
    .min(1800, "El año de construcción debe ser mayor a 1800")
    .max(
      new Date().getFullYear(),
      "El año de construcción no puede ser futuro"
    ),

  anio_codigo: z
    .number({
      required_error: "El año del código es requerido",
      invalid_type_error: "El año del código debe ser un número",
    })
    .int("El año del código debe ser un número entero")
    .min(1800, "El año del código debe ser mayor a 1800")
    .max(new Date().getFullYear(), "El año del código no puede ser futuro"),

  ampliacion: z.boolean({
    required_error: "Debe especificar si tiene ampliación",
    invalid_type_error: "La ampliación debe ser verdadero o falso",
  }),

  anio_ampliacion: z
    .number({
      invalid_type_error: "El año de ampliación debe ser un número",
    })
    .int("El año de ampliación debe ser un número entero")
    .min(1800, "El año de ampliación debe ser mayor a 1800")
    .max(new Date().getFullYear(), "El año de ampliación no puede ser futuro")
    .optional(),

  historico: z.boolean({
    required_error: "Debe especificar si es histórico",
    invalid_type_error: "Histórico debe ser verdadero o falso",
  }),

  albergue: z.boolean({
    required_error: "Debe especificar si es albergue",
    invalid_type_error: "Albergue debe ser verdadero o falso",
  }),

  gubernamental: z.boolean({
    required_error: "Debe especificar si es gubernamental",
    invalid_type_error: "Gubernamental debe ser verdadero o falso",
  }),

  unidades: z
    .number({
      required_error: "El número de unidades es requerido",
      invalid_type_error: "Las unidades deben ser un número",
    })
    .int("Las unidades deben ser un número entero")
    .nonnegative("Las unidades no pueden ser negativas"),

  cod_tipo_suelo: z
    .number({
      required_error: "El código de tipo de suelo es requerido",
      invalid_type_error: "El código de tipo de suelo debe ser un número",
    })
    .int("El código de tipo de suelo debe ser un número entero")
    .positive("El código de tipo de suelo debe ser positivo"),

  foto_edificio: z
    .string()
    .trim()
    .url("La foto del edificio debe ser una URL válida")
    .optional(),

  grafico_edificio: z
    .string()
    .trim()
    .url("El gráfico del edificio debe ser una URL válida")
    .optional(),
});
