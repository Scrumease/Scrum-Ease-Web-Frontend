import { z } from "zod";

export const formResponseSchema = z.object({
  formResponses: z.array(
    z.object({
      orderQuestion: z.number(),
      textQuestion: z.string(),
      answer: z.union([z.string(), z.boolean(), z.array(z.string())]),
      urgencyThreshold: z.number().optional(),
    })
  ),
});

export type FormResponse = z.infer<typeof formResponseSchema>;
