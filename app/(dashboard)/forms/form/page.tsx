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
const Page = () => {
  const props = {
    permission: PermissionsEnum.CREATE_FORM,
  };

  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [users, setUsers] = useState<UserDocument[]>([]);
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          dependencies: question.dependencies,
        });
      });
      await services.formService.create({
        projectId: data.projectId,
        questions: questions,
        isCurrentForm: true,
        notifyDays: data.notifyDays,
        notifyTime: data.notifyTime,
        notifyRecipients: data.notifyRecipients,
      });
      toast("Formulário criado com sucesso!", "success");
      router.push("/forms");
    } catch (error) {
      toast("Erro ao criar formulário", "error");
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

  const getInfos = async () => {
    setIsLoading(true);
    await Promise.all([getAllProjects(), getAllUsers()]);
    setIsLoading(false);
  };

  useEffect(() => {
    getInfos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formDocument: Partial<FormDocument> = {
    questions: [
      {
        text: "O que você fez ontem?",
        answerType: "text",
        order: 1,
        choices: [],
        advancedSettings: {
          urgencyRequired: false,
          urgencyRecipients: [],
          urgencyThreshold: 0,
        },
      },
      {
        text: "O que você fará hoje?",
        answerType: "text",
        order: 2,
        choices: [],
        advancedSettings: {
          urgencyRequired: false,
          urgencyRecipients: [],
          urgencyThreshold: 0,
        },
      },
      {
        text: "Tem algum impedimento?",
        answerType: "text",
        order: 3,
        choices: [],
        advancedSettings: {
          urgencyRequired: true,
          urgencyRecipients: undefined as unknown as string[],
          urgencyThreshold: 5,
        },
      },
    ],
    notifyDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  };

  return (
    <>
      <Authorize props={props}>
        {isLoading && <div>Carregando...</div>}
        {!isLoading && (
          <MultiStepForm
            isEdditing={false}
            handleSubmitForm={formSubmittion}
            projects={projects}
            formDocument={formDocument}
            users={users}
          />
        )}
      </Authorize>
    </>
  );
};

export default Page;
