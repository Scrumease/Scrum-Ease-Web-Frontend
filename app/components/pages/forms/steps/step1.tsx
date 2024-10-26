import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import Select from "react-select";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { FormSchema, Step1Schema, formSchema, step1Schema } from "../schema";
import { selectStyle } from "@/app/components/ui/select.style";
import { daysOfWeek } from "@/app/utils/constants/days";
import { CustomOption } from "@/app/components/ui/select";
import Modal from "@/app/components/Modal";
const Step1 = ({
  handleNextStep,
  formDocument,
  projects = [],
}: {
  handleNextStep: (form: Step1Schema) => void;
  formDocument?: Partial<FormSchema>;
  projects: ProjectDocument[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    ...form
  } = useForm<Step1Schema>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      ...formDocument,
    },
  });

  const onSubmit = (data: Step1Schema) => {
    handleNextStep(data);
  };

  const setSelectValue = (
    key: keyof Step1Schema,
    selectedOptions:
      | { label: string; value: string }
      | { label: string; value: string }[]
  ) => {
    if (!Array.isArray(selectedOptions)) {
      setValue(key, selectedOptions.value);
      form.trigger(key);
      return;
    }
    setValue(
      key,
      selectedOptions.map((option) => option.value)
    );
    form.trigger(key);
  };

  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState<ProjectDocument | null>(null);

  const handleDetailsClick = (project: ProjectDocument) => {
    setSelectedProjectDetails(project);
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit(onSubmit, (e) => console.error(e))}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text"> Dias de Notificação</span>
          </label>
          <Select
            isMulti
            name="notifyDays"
            options={daysOfWeek}
            className="basic-multi-select"
            classNamePrefix="select"
            defaultValue={daysOfWeek.filter((d) =>
              formDocument?.notifyDays?.includes(d.value as any)
            )}
            onChange={(e) =>
              setSelectValue(
                "notifyDays",
                e as { label: string; value: string }[]
              )
            }
            styles={selectStyle}
          />
          {errors.notifyDays && (
            <span className="text-red-500">
              {errors.notifyDays.message?.toString()}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text"> Horário de Notificação</span>
          </label>
          <input
            type="time"
            {...register("notifyTime")}
            className="input input-bordered w-full"
          />
          {errors.notifyTime && (
            <span className="text-red-500">{errors.notifyTime.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text"> Projeto</span>
          </label>
          {projects.length > 0 && (
            <Select
              isMulti={false}
              name="projectId"
              options={projects.map((p) => ({
                value: p._id,
                label: p.name,
                onDetailsClick: () => handleDetailsClick(p),
              }))}
              defaultValue={projects
                .map((p) => ({
                  value: p._id,
                  label: p.name,
                }))
                .find((p) => p.value === formDocument?.projectId)}
              className="basic-multi-select"
              classNamePrefix="select"
              components={{ Option: CustomOption }}
              onChange={(e) => {
                setSelectValue(
                  "projectId",
                  e as {
                    label: string;
                    value: string;
                  }
                );
              }}
              styles={selectStyle}
            />
          )}
          {errors.projectId && (
            <span className="text-red-500">{errors.projectId.message}</span>
          )}
          {selectedProjectDetails && (
            <Modal
              id="project-details"
              isOpen={!!selectedProjectDetails}
              onClose={() => setSelectedProjectDetails(null)}
              title={`Detalhes do Projeto: ${selectedProjectDetails.name}`}
            >
              <div>
                <p>
                  <strong>Descrição:</strong>{" "}
                  {selectedProjectDetails.description}
                </p>
                <p>
                  <strong>Usuários:</strong>{" "}
                  {selectedProjectDetails.users
                    .map((e) => {
                      return (e as UserDocument).name;
                    })
                    .join(", ")}
                </p>
              </div>
            </Modal>
          )}
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Próximo
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;
