import { BaseDocument } from "../common/base.document";
import { FormDocument } from "../form/form.document";

export type DailyDocument = {
  userId: string;
  projectId: string;
  date: string;
  formSnapshot: FormDocument;
  formResponses: Responses[];
} & BaseDocument;

export type Responses = {
  textQuestion: string;
  orderQuestion: number;
  answer: any;
  urgencyThreshold?: number;
};
