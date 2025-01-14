import { BaseDocument } from "../common/base.document";
import { ProjectDocument } from "../project/project.document";
import { TenantDocument } from "../tenant/tenant.document";

export type FormDocument = {
  tenantId: string | TenantDocument;
  projectId: string | ProjectDocument;
  project?: ProjectDocument;
  questions: QuestionDocument[];
  isCurrentForm: boolean;
  notifyDays: Days[];
  notifyTime: string;
  notifyRecipients: string[];
} & BaseDocument;

type QuestionDocument = {
  text: string;
  answerType: "text" | "yes/no" | "multiple choice";
  order: number;
  choices?: string[];
  advancedSettings: AdvancedSettingsDocument;
};

type AdvancedSettingsDocument = {
  urgencyRequired: boolean;
  urgencyRecipients: string[];
  urgencyThreshold: number;
};

export type Days =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
