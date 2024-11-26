import { FormDocument } from "@/app/interfaces/form/form.document";
import { FormResponse, formResponseSchema } from "./schema";
import { useState } from "react";
import { useToast } from "@/app/context/ToastContext";
import { Responses } from "@/app/interfaces/daily/daily.document";
import { ProjectDocument } from "@/app/interfaces/project/project.document";

interface DailyFormProps {
  formSnapshot: FormDocument;
  yesterdayResponse?: Responses[];
  onSubmit: (data: FormResponse) => void;
  project: ProjectDocument;
}

const DailyForm: React.FC<DailyFormProps> = ({
  formSnapshot,
  onSubmit,
  yesterdayResponse,
  project,
}) => {
  const [formResponses, setFormResponses] = useState<FormResponse>({
    formResponses: formSnapshot.questions.map((q) => ({
      orderQuestion: q.order,
      textQuestion: q.text,
      answer:
        q.answerType === "multiple choice"
          ? []
          : q.answerType === "text"
          ? ""
          : "sim",
      urgencyThreshold: q.advancedSettings?.urgencyThreshold || 0,
    })),
  });

  const toast = useToast();

  const handleAnswerChange = (order: number, field: string, value: any) => {
    setFormResponses((prev) => ({
      formResponses: prev.formResponses.map((response) =>
        response.orderQuestion === order
          ? { ...response, [field]: value }
          : response
      ),
    }));
  };

  const handleSubmit = () => {
    const parsed = formResponseSchema.parse(formResponses);
    let errosFlag = 0;
    parsed?.formResponses.forEach((a) => {
      if (
        a.answer === "" ||
        a.answer === undefined ||
        a.answer === null ||
        (Array.isArray(a.answer) && a.answer.length === 0)
      ) {
        errosFlag++;
      }

      if (
        formSnapshot.questions.find((q) => q.order === a.orderQuestion)
          ?.advancedSettings?.urgencyRequired &&
        (a.urgencyThreshold === undefined || a.urgencyThreshold < 0)
      ) {
        errosFlag++;
      }
    });
    if (errosFlag > 0) {
      toast("Preencha todas as respostas e configurações avançadas", "error");
      return;
    }
    if (parsed) {
      onSubmit(parsed);
    } else {
      console.error(parsed);
    }
  };

  return (
    <div className="card-body">
      <h1 className="card-title text-2xl font-bold mb-6">
        Responda à Daily - {project.name}
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        {formSnapshot.questions.map((question) => (
          <div
            key={question.order}
            className="card question-block bg-base-100 p-4 rounded-md shadow"
          >
            <label className="card-title text-lg font-medium mb-2 flex items-center">
              {yesterdayResponse?.find(
                (resp) => resp.orderQuestion === question.order
              ) ? (
                <>
                  {question.text}

                  <span className="text-warning text-sm">{` - Resposta de ontem: [${
                    yesterdayResponse.find(
                      (resp) => resp.orderQuestion === question.order
                    )?.answer
                  }]`}</span>
                </>
              ) : (
                question.text
              )}
            </label>
            {question.answerType === "text" && (
              <textarea
                rows={4}
                className="textarea textarea-bordered w-full"
                value={
                  (formResponses.formResponses.find(
                    (response) => response.orderQuestion === question.order
                  )?.answer || "") as any
                }
                onChange={(e) =>
                  handleAnswerChange(question.order, "answer", e.target.value)
                }
              />
            )}
            {question.answerType === "yes/no" && (
              <select
                className="select select-bordered w-full"
                defaultValue={
                  (formResponses.formResponses.find(
                    (response) => response.orderQuestion === question.order
                  )?.answer || "") as any
                }
                onChange={(e) =>
                  handleAnswerChange(
                    question.order,
                    "answer",
                    e.target.value === "sim"
                  )
                }
              >
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            )}
            {question.answerType === "multiple choice" && (
              <div className="space-y-2">
                {question.choices?.map((choice) => (
                  <label key={choice} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      value={choice}
                      checked={(
                        formResponses.formResponses.find(
                          (response) =>
                            response.orderQuestion === question.order
                        )?.answer as string[]
                      ).includes(choice)}
                      onChange={(e) => {
                        const selectedChoices =
                          formResponses.formResponses.find(
                            (response) =>
                              response.orderQuestion === question.order
                          )?.answer as string[];
                        if (e.target.checked) {
                          handleAnswerChange(question.order, "answer", [
                            ...selectedChoices,
                            choice,
                          ]);
                        } else {
                          handleAnswerChange(
                            question.order,
                            "answer",
                            selectedChoices.filter((c) => c !== choice)
                          );
                        }
                      }}
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            )}

            {question.advancedSettings?.urgencyRequired && (
              <div className="mt-4">
                <label className="card-title block text-lg font-medium mb-2">
                  {yesterdayResponse?.find(
                    (resp) => resp.orderQuestion === question.order
                  ) ? (
                    <>
                      {`Nível de Urgência`}

                      <span className="text-warning text-sm">{` - Resposta de ontem: [${
                        yesterdayResponse.find(
                          (resp) => resp.orderQuestion === question.order
                        )?.urgencyThreshold
                      }]`}</span>
                    </>
                  ) : (
                    `Nível de Urgência`
                  )}
                </label>

                <input
                  type="number"
                  min={0}
                  max={10}
                  className="input input-bordered w-full"
                  value={
                    formResponses.formResponses.find(
                      (response) => response.orderQuestion === question.order
                    )?.urgencyThreshold || 0
                  }
                  onChange={(e) =>
                    handleAnswerChange(
                      question.order,
                      "urgencyThreshold",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            )}
          </div>
        ))}
        <button className="btn btn-primary w-full mt-4" type="submit">
          Enviar Respostas
        </button>
      </form>
    </div>
  );
};

export default DailyForm;
