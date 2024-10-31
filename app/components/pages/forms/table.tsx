"use client";

import { useToast } from "@/app/context/ToastContext";
import { Days, FormDocument } from "@/app/interfaces/form/form.document";
import { services } from "@/app/services/services";
import { useState, useCallback, useEffect } from "react";
import Authorize from "../../Authorize";
import { useRouter } from "next/navigation";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import { daysOfWeek } from "@/app/utils/constants/days";

const CardView = ({ canCreate }: { canCreate: boolean }) => {
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<FormDocument[]>([]);
  const [haveProject, setHaveProject] = useState<boolean>(false);

  const router = useRouter();

  const getAll = useCallback(
    async (search?: string) => {
      try {
        setLoading(true);
        const response = await services.formService.findAll({
          page: currentPage,
          limit: 9,
          search,
          selfForms: false,
        });
        setData(response.data);
        setTotalPages(Math.ceil(response.total / response.limit));
      } catch (error) {
        toast("Erro ao buscar formulários", "error");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage]
  );

  const checkHaveProject = useCallback(async () => {
    try {
      const response = await services.projectService.getAll({
        page: 1,
        limit: 1,
      });
      setHaveProject(response.total > 0);
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    checkHaveProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <>
      <Authorize props={{}}>
        {loading && <div>Carregando...</div>}
        {!loading && (
          <>
            <div className="flex flex-row justify-between mb-4 justify-items-center items-center">
              <h3 className="text-lg w-full">Formulários</h3>
              {canCreate && haveProject && (
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => router.push("/forms/form")}
                >
                  + Adicionar
                </button>
              )}
            </div>
            {!haveProject && (
              <p className="text-red-500">
                Nenhum projeto cadastrado, favor cadastrar um projeto antes de
                criar um formulário
              </p>
            )}
            {data.length === 0 && <p>Nenhum formulário cadastrado</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {data.map((form) => (
                <FormCard
                  key={form._id}
                  form={form}
                  onMarkAsDefault={async (id) => {
                    {
                      await services.formService.setActive(id);
                      await getAll();
                    }
                  }}
                />
              ))}
            </div>

            <div className="mt-6">
              <div className="btn-group">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`mr-2 btn ${
                      currentPage === index + 1 ? "btn-active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Authorize>
    </>
  );
};

export default CardView;

interface FormCardProps {
  form: FormDocument;
  onMarkAsDefault: (id: string) => Promise<void>;
}

const FormCard = ({ form, onMarkAsDefault }: FormCardProps) => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    router.push(`/forms/form/${form._id}`);
  };

  const handleMarkAsDefault = async () => {
    try {
      setLoading(true);
      await onMarkAsDefault(form._id);
      toast("Formulário definido como padrão com sucesso", "success");
    } catch (error) {
      toast("Erro ao definir formulário como padrão", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl p-4">
      <div className="card-body">
        <h2 className="card-title">
          {(form.projectId as ProjectDocument)?.name}
        </h2>

        <p>{`Notificação às ${form.notifyTime} nos dias: ${daysOfWeek
          .filter((d) => form.notifyDays.includes(d.value as Days))
          .map((e) => e.label)
          .join(", ")}`}</p>
        <div className="flex justify-between items-center">
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={handleEdit}>
              Editar
            </button>
          </div>
          {!form.isCurrentForm && (
            <button
              className={`btn btn-success ${loading ? "loading" : ""}`}
              onClick={handleMarkAsDefault}
              disabled={loading}
            >
              Definir como Padrão
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
