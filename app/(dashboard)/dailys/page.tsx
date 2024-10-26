"use client";
import Authorize from "@/app/components/Authorize";
import { FormDocument } from "@/app/interfaces/form/form.document";
import { ProjectDocument } from "@/app/interfaces/project/project.document";
import { services } from "@/app/services/services";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDynamicForm } from "react-icons/md";

const page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<FormDocument[]>([]);

  const getProjects = async () => {
    setLoading(true);
    try {
      const response = await services.formService.findAll({
        page: currentPage,
        limit: 9,
        selfForms: true,
        isCurrentForm: true,
      });
      setForm(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error) {
      setForm([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, [currentPage]);

  return (
    <Authorize props={{}}>
      {loading && <div>Carregando...</div>}
      {!loading && (
        <div>
          <ProjectCard formDocument={form} />
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center">
              <button
                className="btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>
              <span className="mx-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      )}
    </Authorize>
  );
};

export default page;

const ProjectCard = ({ formDocument }: { formDocument: FormDocument[] }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {formDocument.map((form, index) => (
          <div key={index} className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <MdDynamicForm className="text-8xl flex justify-center" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {(form.projectId as ProjectDocument).name}
              </h2>
              <Link
                href={`dailys/${form._id}/anwser`}
                className="btn btn-primary"
              >
                Responder
              </Link>
              <Link
                href={`dailys/${form._id}/progress`}
                className="btn btn-success"
              >
                Visualizar respostas
              </Link>
            </div>
          </div>
        ))}
      </div>
      {formDocument.length === 0 && (
        <div className="text-lg text-red-500">
          Você não está cadastrado em nenhum formulário no momento.
        </div>
      )}
    </>
  );
};
