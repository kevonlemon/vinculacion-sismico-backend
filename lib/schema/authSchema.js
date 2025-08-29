import z from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "El correo es requerido"),
  password: z.string().trim().min(1, "La contraseña es requerida"),
});

export const RegisterSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .min(5, "El nombre debe tener al menos 5 caracteres"),

  email: z
    .string()
    .trim()
    .min(1, "El correo es requerido")
    .email("El correo no es válido"),

  password: z
    .string()
    .trim()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
  rol: z.enum(["admin", "inspector", "ayudante", "cliente"], {
    errorMap: () => ({
      message:
        "El rol es requerido y debe ser admin, inspector, ayudante o cliente",
    }),
  }),
  telefono: z
    .string()
    .trim()
    .min(1, "El número de teléfono es requerido")
    .max(10, "El número de teléfono no debe superar 10 dígitos"),
});
