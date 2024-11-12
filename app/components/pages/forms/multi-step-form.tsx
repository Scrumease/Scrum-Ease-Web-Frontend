import React, { useEffect, useState } from "react";
import { FormSchema } from "./schema";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { FormDocument } from "@/app/interfaces/form/form.document";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";

const MultiStepForm = ({
  handleSubmitForm,
  formDocument,
  isEdditing,
  projects = [],
  users = [],
}: {
  handleSubmitForm: (form: FormSchema) => Promise<void>;
  formDocument?: Partial<FormDocument>;
  projects: ProjectDocument[];
  users: UserDocument[];
  isEdditing: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormSchema>>({
    ...formDocument,
    projectId: (formDocument?.projectId as ProjectDocument)?._id as string,
  });

  const handleNextStep = (data: Partial<FormSchema>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleFinalSubmit = async () => {
    await handleSubmitForm(formData as FormSchema);
  };

  useEffect(() => {
    setIsLoading(true);
    setFormData((prevData) => ({
      ...prevData,
      projectId: formDocument?.projectId as string,
    }));
    setIsLoading(false);
  }, [formDocument]);

  return (
    <>
      {isEdditing && !formDocument && <div className="loader"></div>}
      {(!isEdditing || (isEdditing && formDocument)) && (
        <div className="p-4">
          {step === 1 && (
            <Step1
              handleNextStep={handleNextStep}
              formDocument={formData}
              projects={projects}
            />
          )}

          {step === 2 && (
            <Step2
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleNextStep}
              formDocument={formData}
              users={users}
            />
          )}

          {step === 3 && (
            <Step3
              handlePreviousStep={handlePreviousStep}
              handleSubmit={handleFinalSubmit}
              projects={projects}
              users={users}
              formData={formData}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MultiStepForm;
