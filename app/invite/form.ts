import { z } from "zod";

export const completeRegistrationSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  timezone: z.object({ value: z.string(), offset: z.number().optional() }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type CompleteRegistrationFormValues = z.infer<typeof completeRegistrationSchema>;
