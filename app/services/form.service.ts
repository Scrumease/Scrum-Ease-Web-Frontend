import api from "./client";
import { FindPaginated } from "../interfaces/common/findPaginated";
import { FormDocument } from "../interfaces/form/form.document";
import { FilterInterface } from "../interfaces/common/filter";
import { UpdateFormDto } from "../interfaces/form/form.update.dto";

export interface FormService {
  create: (dto: CreateFormDto) => Promise<FormDocument>;
  findAll: (
    filter: FilterInterface & {
      projectId?: string;
      isCurrentForm?: boolean;
      selfForms?: boolean;
    }
  ) => Promise<FindPaginated<FormDocument>>;
  findOne: (id: string) => Promise<FormDocument>;
  update: (id: string, dto: UpdateFormDto) => Promise<FormDocument>;
  setActive: (id: string) => Promise<void>;
}

const basePath = "/forms";

export const formService: FormService = {
  create: (dto: CreateFormDto) =>
    api.post(basePath, dto).then((res) => res.data),
  findAll: (filter) =>
    api.get(basePath, { params: filter }).then((res) => res.data),
  findOne: (id: string) => api.get(`${basePath}/${id}`).then((res) => res.data),
  update: (id: string, dto: UpdateFormDto) =>
    api.put(`${basePath}/${id}`, dto).then((res) => res.data),
  setActive: (id: string) =>
    api.put(`${basePath}/setActive/${id}`).then((res) => res.data),
};
