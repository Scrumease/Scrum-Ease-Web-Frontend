"use client";
import Authorize from "@/app/components/Authorize";
import MultiStepForm from "@/app/components/pages/forms/multi-step-form";
import { FormSchema } from "@/app/components/pages/forms/schema";
import { useToast } from "@/app/context/ToastContext";
import { PermissionsEnum } from "@/app/enums/permissions.enum";
import { FormDocument } from "@/app/interfaces/form/form.document";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { services } from "@/app/services/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Page = ({ params }: { params: { id: string } }) => {
  const props = {
    permission: PermissionsEnum.UPDATE_FORM,
  };

  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormDocument>();
  const toast = useToast();
  const router = useRouter();

  const formSubmittion = async (data: FormSchema) => {
    try {
      const questions: QuestionDto[] = [];
      data.questions.forEach((question) => {
        questions.push({
          text: question.text,
          answerType: question.answerType,
          order: question.order,
          choices: question.choices,
          advancedSettings: {
            urgencyRequired: question.advancedSettings.urgencyRequired,
            urgencyRecipients: question.advancedSettings.urgencyRecipients,
            urgencyThreshold: question.advancedSettings
              .urgencyThreshold as number,
          },
        });
      });
      await services.formService.update(params.id, {
        projectId: data.projectId,
        questions: questions,
        isCurrentForm: true,
        notifyDays: data.notifyDays,
        notifyTime: data.notifyTime,
        notifyRecipients: data.notifyRecipients,
      });
      toast("Formulário atualizado com sucesso!", "success");
      router.push("/forms");
    } catch (error) {
      toast("Erro ao atualizar formulário", "error");
    }
  };

  const getAllProjects = async () => {
    await services.projectService
      .getAll({ page: 1, limit: -1 })
      .then((response) => {
        setProjects(response.data as unknown as ProjectDocument[]);
      });
  };

  const getAllUsers = async () => {
    await services.userService
      .getAll({ page: 1, limit: -1 })
      .then((response) => {
        setUsers(response.data as unknown as UserDocument[]);
      });
  };

  const loadFormData = async (projectId: string) => {
    setIsLoading(true);
    try {
      const form = await services.formService.findOne(projectId);
      setForm(form);
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFormData(params.id);
    getAllProjects();
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Authorize props={props}>
        {isLoading && <div>Carregando...</div>}
        {!isLoading && (
          <MultiStepForm
            isEdditing={true}
            handleSubmitForm={formSubmittion}
            projects={projects}
            formDocument={form}
            users={users}
          />
        )}
      </Authorize>
    </>
  );
};

export default Page;
