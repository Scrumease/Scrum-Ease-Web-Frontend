"use client";
import { useState, useEffect } from "react";
import { services } from "@/app/services/services";
import FormResponses from "@/app/components/pages/dailys/progress/formResponses";
import Authorize from "@/app/components/Authorize";
import Select from "react-select";
import { selectStyle } from "@/app/components/ui/select.style";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import { FormDocument } from "@/app/interfaces/form/form.document";

const FormResponsesPage = ({ params }: { params: { formId: string } }) => {
  const { formId } = params;

  const [responses, setResponses] = useState([]);
  const [filterUserId, setFilterUserId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0]
  );

  useEffect(() => {
    if (formId) {
      fetchResponses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, filterUserId, startDate, endDate]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [users, setUsers] = useState<
    { _id: string; name: string; email: string }[]
  >([]);

  const [form, setForm] = useState<FormDocument>();

  const fetchUsers = async () => {
    try {
      const data = await services.formService.findOne(formId);
      setUsers(
        (data.projectId as ProjectDocument).users as unknown as {
          _id: string;
          name: string;
          email: string;
        }[]
      );
      setForm(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchResponses = async () => {
    try {
      const { data } = await services.dailyService.getResponses(formId, {
        filterUserId,
        startDate,
        endDate,
      });
      setResponses(data);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  const Title = () => {
    if (form) {
      return `Respostas do formulário - ${
        (form.projectId as ProjectDocument).name
      }`;
    }
    return "Respostas do formulário";
  };

  return (
    <Authorize props={{}}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          <Title />
        </h1>

        <div className="flex space-x-4 mb-4 items-end">
          <div className="flex flex-col gap-4">
            <label htmlFor="useId" className="text-md ">
              Usuário
            </label>
            {users.length > 0 && (
              <Select
                isClearable
                placeholder="Selecione um usuário"
                name="useId"
                options={users.map((user) => ({
                  value: user._id,
                  label: user.name,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => setFilterUserId(e?.value ?? "")}
                styles={selectStyle}
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="initialDate" className="text-md ">
              Data Inicial
            </label>
            <input
              type="date"
              name="initialDate"
              className="input input-bordered"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="endDate" className="text-md ">
              Data Final
            </label>
            <input
              type="date"
              name="endDate"
              className="input input-bordered"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        {responses && (
          <div>
            <FormResponses responses={responses} />
          </div>
        )}
        {!responses && (
          <div>
            <h1>Não há respostas para este formulário.</h1>
          </div>
        )}
      </div>
    </Authorize>
  );
};

export default FormResponsesPage;
