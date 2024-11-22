interface AdvancedSettingsDto {
  urgencyRequired: boolean;
  urgencyRecipients: string[];
  urgencyThreshold: number;
}

interface QuestionDto {
  text: string;
  answerType: string;
  order: number;
  choices?: string[];
  advancedSettings: AdvancedSettingsDto;
  dependencies?: {
    questionTitle?: string | null;
    expectedAnswer?: string | null;
  };
}

type CreateFormDto = {
  projectId: string;
  questions: QuestionDto[];
  isCurrentForm: boolean;
  notifyDays: string[];
  notifyTime: string;
  notifyRecipients: string[];
};
