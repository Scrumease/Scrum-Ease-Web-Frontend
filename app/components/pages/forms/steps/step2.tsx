import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, Step2Schema, step2Schema } from "../schema";
import { QuestionCard } from "../questionCard/card";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { IoChevronBack } from "react-icons/io5";

const Step2 = ({
  handleNextStep,
  formDocument,
  users,
  handlePreviousStep,
}: {
  handleNextStep: (form: Partial<Step2Schema>) => void;
  formDocument?: Partial<FormSchema>;
  users: UserDocument[];
  handlePreviousStep: () => void;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    ...form
  } = useForm<Step2Schema>({
    defaultValues: { questions: [], ...formDocument },
    resolver: zodResolver(step2Schema),
    mode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = () => {
    append({
      text: "",
      answerType: "text",
      order: fields.length + 1,
      choices: [],
      advancedSettings: {
        urgencyRequired: false,
        urgencyRecipients: [],
        urgencyThreshold: 0,
      },
      dependencies: {
        questionTitle: undefined,
        expectedAnswer: undefined,
      },
    });
  };

  const onSubmit: SubmitHandler<Step2Schema> = (data) => {
    handleNextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between w-full items-center mb-8">
        <div className="flex flex-row gap-4 items-center">
          <button
            onClick={handlePreviousStep}
            className="btn bg-transparent border-none shadow-none"
          >
            <IoChevronBack className="text-xl" />
          </button>
          <h3 className="font-bold text-3xl ">Perguntas</h3>
        </div>
        <button
          type="button"
          onClick={addQuestion}
          className="btn btn-success mt-4"
        >
          Adicionar Pergunta
        </button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <QuestionCard
            questions={fields}
            control={control}
            key={field.id}
            question={field}
            total={fields.length}
            register={register}
            index={index}
            move={move}
            remove={remove}
            form={form}
            users={users}
            errors={errors.questions?.[index]}
          />
        ))}

        {errors.questions && (
          <p className="text-red-500">{errors.questions.message}</p>
        )}

        <button type="submit" className="btn btn-primary mt-4 w-full">
          Próximo
        </button>
      </div>
    </form>
  );
};

export default Step2;
