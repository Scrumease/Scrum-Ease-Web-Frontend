import { z } from "zod";

const advancedSettingsSchema = z.object({
  urgencyRequired: z.boolean().default(false),
  urgencyRecipients: z.array(z.string()),
  urgencyThreshold: z
    .number()
    .min(0)
    .max(10)
    .default(0)
    .or(
      z.string().refine(
        (val) => {
          if (typeof val === "string") {
            return !isNaN(Number(val));
          }
          return false;
        },
        { message: "O valor deve ser um número" }
      )
    ),
});

const questionSchema = z.object({
  text: z.string().min(1, { message: "O texto da pergunta é obrigatório" }),
  answerType: z.enum(["text", "yes/no", "multiple choice"], {
    errorMap: () => ({ message: "Tipo de resposta inválido" }),
  }),
  order: z.number().min(1, { message: "A ordem deve ser um número positivo" }),
  choices: z
    .array(z.string().min(1, "A opção não pode estar vazia"))
    .optional(),
  advancedSettings: advancedSettingsSchema,
  dependencies: z
    .object({
      questionTitle: z.string().optional().nullable(),
      expectedAnswer: z.string().optional().nullable(),
    })
    .optional()
    .refine(
      (val) => {
        if (val && val.questionTitle) {
          return val.questionTitle.trim().length > 0;
        }
        return true;
      },
      { message: "A pergunta de dependência não pode estar vazia" }
    ),
});

export type QuestionSchema = z.infer<typeof questionSchema>;

export const formSchema = z.object({
  projectId: z.string().min(1, "ID de projeto inválido"),
  questions: z
    .array(questionSchema)
    .min(1, { message: "Pelo menos uma pergunta é necessária" }),
  isCurrentForm: z.boolean().default(false),
  notifyDays: z
    .array(
      z.enum(
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        {
          errorMap: () => ({ message: "Dia de notificação inválido" }),
        }
      )
    )
    .min(1, { message: "Pelo menos um dia de notificação é necessário" }),
  notifyTime: z
    .string()
    .min(1, { message: "O horário de notificação é obrigatório" }),
  notifyRecipients: z.array(z.string()).min(1, {
    message: "Pelo menos um destinatário de notificação é obrigatório",
  }),
});

export type FormSchema = z.infer<typeof formSchema>;

export const step1Schema = z.object({
  projectId: z.string().min(1, "ID de projeto inválido"),
  notifyDays: z
    .array(
      z.enum(
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        {
          errorMap: () => ({ message: "Dia de notificação inválido" }),
        }
      )
    )
    .min(1, { message: "Pelo menos um dia de notificação é necessário" }),
  notifyTime: z
    .string()
    .min(1, { message: "O horário de notificação é obrigatório" }),
});
export type Step1Schema = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, { message: "Pelo menos uma pergunta é necessária" })
    .refine(
      (questions) => {
        // Verifica se todas as dependências estão configuradas corretamente
        return questions.every((question, index) => {
          if (question.dependencies && question.dependencies.questionTitle) {
            // Verifica se a pergunta de dependência existe dentro das questões
            const dependentQuestion = questions.find(
              (q) => q.text === question.dependencies?.questionTitle
            );
            if (!dependentQuestion) {
              return false; // Se a pergunta de dependência não for encontrada
            }

            // A resposta esperada é uma string, então apenas garantimos que ela não seja vazia
            if (question.dependencies?.expectedAnswer?.trim().length === 0) {
              return false; // Se a resposta esperada for uma string vazia
            }
          }
          return true;
        });
      },
      {
        message:
          "Algumas dependências estão configuradas incorretamente ou as perguntas dependentes não existem",
      }
    ),
});
export type Step2Schema = z.infer<typeof step2Schema>;
