import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
