import {
  UseFormRegister,
  FieldValues,
  Control,
  useFieldArray,
} from "react-hook-form";
import { Step2Schema } from "../schema";
import Select from "react-select";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { selectStyle } from "@/app/components/ui/select.style";
import { IoMdClose } from "react-icons/io";
import { FaArrowDown, FaArrowUp, FaQuestionCircle } from "react-icons/fa";
import { answerTypes } from "@/app/utils/constants/answerTypes";

interface QuestionCardProps {
  question: any;
  register: UseFormRegister<FieldValues & Step2Schema>;
  control: Control<Step2Schema>;
  index: number;
  remove: (index: number) => void;
  form: any;
  errors?: any;
  users: UserDocument[];
  move: (from: number, to: number) => void;
  total: number;
}

export const QuestionCard = ({
  question,
  register,
  control,
  index,
  remove,
  errors,
  form,
  users,
  move,
  total,
}: QuestionCardProps) => {
  const mappedUsers = users.map((user) => ({
    label: user.name,
    value: user._id,
  }));

  const setSelectValue = (
    key: string,
    selectedOptions:
      | { label: string; value: string }
      | { label: string; value: string }[]
  ) => {
    if (!Array.isArray(selectedOptions)) {
      form.setValue(key, selectedOptions.value);
      form.trigger(key);
      return;
    }
    form.setValue(
      key,
      selectedOptions.map((option) => option.value)
    );
    form.clearErrors(key);
  };

  const {
    fields,
    append,
    remove: removeChoice,
  } = useFieldArray<any>({
    control,
    name: `questions.${index}.choices`,
  });

  return (
    <div className="p-4 card bg-base-100 shadow-md rounded-lg space-y-4">
      {/* Header com os botões de mover */}
      <div className="flex justify-between w-full items-center">
        <h3 className="font-bold text-lg">Pergunta {index + 1}</h3>
        <div className="flex space-x-2">
          {/* Botão para mover para cima */}
          <button
            type="button"
            onClick={() => move(index, index - 1)}
            disabled={index === 0}
            className="btn bg-transparent border-none shadow-none"
          >
            <FaArrowUp className="text-blue-500" />
          </button>
          {/* Botão para mover para baixo */}
          <button
            type="button"
            onClick={() => move(index, index + 1)}
            disabled={index === total - 1}
            className="btn bg-transparent border-none shadow-none"
          >
            <FaArrowDown className="text-blue-500" />
          </button>
          {/* Botão para remover o card */}
          <button
            type="button"
            onClick={() => remove(index)}
            className="btn bg-transparent border-none shadow-none"
          >
            <IoMdClose className="text-red-500 text-lg" />
          </button>
        </div>
      </div>

      {/* Texto da Pergunta */}
      <div className="flex md:flex-row flex-col w-full gap-4">
        <div className="w-full">
          <label className="block font-semibold">Texto da Pergunta:</label>
          <input
            type="text"
            {...register(`questions.${index}.text`)}
            className={`input input-bordered w-full ${
              errors?.text ? "border-red-500" : ""
            }`}
            defaultValue={question.text}
          />
          {errors?.text && (
            <p className="text-red-500">{errors.text.message}</p>
          )}
        </div>

        {/* Tipo de Resposta */}
        <div className="w-full">
          <label className="block font-semibold">Tipo de Resposta:</label>
          <select
            {...register(`questions.${index}.answerType`)}
            className={`select select-bordered w-full ${
              errors?.answerType ? "border-red-500" : ""
            }`}
            defaultValue={question.answerType}
            onChange={(e) => {
              form.setValue(`questions.${index}.answerType`, e.target.value);
              form.trigger(`questions.${index}.answerType`);
              if (e.target.value !== "multiple choice") {
                form.setValue(`questions.${index}.choices`, []);
              }
            }}
          >
            {answerTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors?.answerType && (
            <p className="text-red-500">{errors.answerType.message}</p>
          )}
        </div>
      </div>

      {form.getValues(`questions.${index}.answerType`) ===
        "multiple choice" && (
        <div>
          <label className="block font-semibold">Opções:</label>
          {fields.map((field, choiceIndex) => (
            <div key={field.id} className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                {...register(`questions.${index}.choices.${choiceIndex}`)}
                className={`input input-bordered w-full ${
                  errors?.questions?.[index]?.choices?.[choiceIndex]
                    ? "border-red-500"
                    : ""
                }`}
                placeholder={`Opção ${choiceIndex + 1}`}
                defaultValue={(field as unknown as any).value}
              />
              <button
                type="button"
                onClick={() => removeChoice(choiceIndex)}
                className="btn btn-error"
              >
                Remover
              </button>
            </div>
          ))}

          {/* Botão para adicionar novas opções */}
          <button
            type="button"
            className="btn btn-sm mt-2"
            onClick={() => append("")}
          >
            Adicionar Opção
          </button>

          {errors?.questions?.[index]?.choices && (
            <p className="text-red-500">
              {errors.questions[index].choices.message}
            </p>
          )}
        </div>
      )}
      {/* Configurações Avançadas */}
      <div>
        <label className="block font-semibold">Configurações Avançadas:</label>

        {/* Urgency Required */}
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register(
                `questions.${index}.advancedSettings.urgencyRequired`
              )}
              className="checkbox"
              onChange={(e) => {
                form.setValue(
                  `questions.${index}.advancedSettings.urgencyRequired`,
                  e.target.checked
                );
                if (!e.target.checked) {
                  form.setValue(
                    `questions.${index}.advancedSettings.urgencyThreshold`,
                    0
                  );
                  form.setValue(
                    `questions.${index}.advancedSettings.urgencyRecipients`,
                    []
                  );
                }
                form.trigger(
                  `questions.${index}.advancedSettings.urgencyRequired`
                );
              }}
              defaultChecked={question.advancedSettings.urgencyRequired}
            />
            <span className="ml-2">Urgência Necessária</span>
          </label>
        </div>

        {/* Urgency Threshold e Recipients (Somente se Urgency Required for marcado) */}
        {question.advancedSettings.urgencyRequired && (
          <>
            <div className="mt-2">
              <label className="block font-semibold">
                Nível de Urgência:
                <span
                  className="ml-2 tooltip tooltip-right"
                  data-tip="Define o nível de urgência necessário na resposta para que essa pergunta seja enviada para os destinatários da urgência."
                >
                  <FaQuestionCircle />
                </span>
              </label>
              <input
                type="number"
                {...register(
                  `questions.${index}.advancedSettings.urgencyThreshold`
                )}
                className={`input input-bordered w-full ${
                  errors?.advancedSettings?.urgencyThreshold
                    ? "border-red-500"
                    : ""
                }`}
                onChange={(e) => {
                  form.setValue(
                    `questions.${index}.advancedSettings.urgencyThreshold`,
                    e.target.valueAsNumber ?? 0
                  );
                  form.trigger(
                    `questions.${index}.advancedSettings.urgencyThreshold`
                  );
                }}
                defaultValue={question.advancedSettings.urgencyThreshold}
              />
              {errors?.advancedSettings?.urgencyThreshold && (
                <p className="text-red-500">
                  {errors.advancedSettings.urgencyThreshold.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text"> Destinatários da Urgência</span>
              </label>
              <Select
                isMulti
                {...register(
                  `questions.${index}.advancedSettings.urgencyRecipients`
                )}
                defaultValue={mappedUsers.filter((u) =>
                  question.advancedSettings.urgencyRecipients?.includes(u.value)
                )}
                options={mappedUsers}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) =>
                  setSelectValue(
                    `questions.${index}.advancedSettings.urgencyRecipients`,
                    e as { label: string; value: string }[]
                  )
                }
                styles={selectStyle}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
