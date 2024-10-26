import React from "react";
import { FormSchema, Step1Schema, formSchema } from "../schema";
import { Step2Schema } from "../schema";
import { IoChevronBack } from "react-icons/io5";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import { daysOfWeek } from "@/app/utils/constants/days";
import { answerTypes } from "@/app/utils/constants/answerTypes";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { useForm } from "react-hook-form";

interface Step3Interface {
  formData: Partial<Step1Schema & Step2Schema>;
  handlePreviousStep: () => void;
  handleSubmit: () => void;
  projects: ProjectDocument[];
  users: UserDocument[];
}

const Step3 = ({
  formData,
  handlePreviousStep,
  handleSubmit,
  projects,
  users,
}: Step3Interface) => {
  const form = useForm<FormSchema>({
    defaultValues: {
      questions: [],
      isCurrentForm: false,
      notifyDays: [],
      notifyTime: "",
      notifyRecipients: [],
      ...formData,
    },
  });

  const handleErros = (errors: any) => {
    console.error(errors);
  };

  return (
    <div className="p-4">
      <div className="flex flex-row gap-4 items-center mb-8">
        <button
          onClick={handlePreviousStep}
          className="btn bg-transparent border-none shadow-none"
        >
          <IoChevronBack className="text-xl" />
        </button>
        <h3 className="font-bold text-3xl ">Resumo</h3>
      </div>
      <div className="p-4 card bg-base-100 shadow-md rounded-lg space-y-4">
        <div className="mt-4">
          <h3 className="font-semibold text-xl mb-4">
            Informações do Projeto:
          </h3>
          <p>
            <strong>Nome do Projeto:</strong>{" "}
            {projects.find((p) => p._id === formData.projectId)?.name}
          </p>
          <p>
            <strong>Dias da Notificação:</strong>{" "}
            {daysOfWeek
              .filter((d) => formData?.notifyDays?.includes(d.value as any))
              .map((e) => e.label)
              .join(", ") || "Nenhum dia selecionado"}
          </p>
          <p>
            <strong>Horário da Notificação:</strong> {formData.notifyTime}
          </p>
          <p>
            <strong>Destinatários de Notificação:</strong>{" "}
            {users
              .filter((u) => (formData.notifyRecipients || []).includes(u._id))
              .map((u) => u.name)
              .join(", ") || "Nenhum destinatário"}
          </p>
        </div>
        <div className="divider"></div>

        <div className="mt-4">
          <h3 className="font-semibold text-xl mb-4">Perguntas:</h3>
          {formData.questions?.map((question, index) => (
            <div key={index} className="border p-2 rounded mb-2">
              <p>
                <strong>Pergunta:</strong> {question.text}
              </p>
              <p>
                <strong>Tipo de Resposta:</strong>{" "}
                {
                  answerTypes.find((a) => a.value === question.answerType)
                    ?.label
                }
              </p>
              {question.choices && question.choices?.length > 0 && (
                <>
                  <span className="font-bold">Opções:</span>
                  <ul className="list-outside">
                    {question.choices?.map((choice, index) => (
                      <li key={index}>- {choice}</li>
                    ))}
                  </ul>
                </>
              )}
              {question.advancedSettings?.urgencyRequired && (
                <>
                  <div className="divider">Configurações Avançadas</div>

                  <span className="font-bold text-md">Urgência:</span>
                  <p className="text-sm">
                    <strong>- Nível de Urgência:</strong>{" "}
                    {question.advancedSettings?.urgencyThreshold || 0}
                  </p>
                  <p className="text-sm">
                    <strong>- Destinatários de Urgência:</strong>{" "}
                    {users
                      .filter((u) =>
                        (
                          question.advancedSettings?.urgencyRecipients || []
                        ).includes(u._id)
                      )
                      .map((u) => u.name)
                      .join(", ") || "Nenhum destinatário"}
                  </p>
                </>
              )}
            </div>
          )) || <p>Nenhuma pergunta adicionada.</p>}
        </div>
        <form
          onSubmit={form.handleSubmit(
            (e) => handleSubmit(),
            (e) => handleErros(e)
          )}
        >
          <button
            type="submit"
            className="btn bg-slate-100 mt-4 hover:bg-slate-400 text-black w-full"
          >
            Finalizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step3;
