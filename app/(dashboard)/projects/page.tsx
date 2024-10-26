"use client";

import React, { useCallback, useEffect, useState } from "react";
import Authorize from "@/app/components/Authorize";
import DataTable from "@/app/components/table/DataTable";
import {
  Column,
  Pagination,
  ActionButton,
} from "@/app/components/table/interface";
import { services } from "@/app/services/services";
import { BsEye } from "react-icons/bs";
import Filters from "@/app/components/filters";
import { ProjectInterface } from "@/app/interfaces/project/project.interface";
import ViewProjectModal from "@/app/components/modais/viewProject";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import { useToast } from "@/app/context/ToastContext";
import { PermissionsEnum } from "@/app/enums/permissions.enum";

const page = () => {
  const props = {
    permission: PermissionsEnum.VIEW_PROJECT,
  };

  return (
    <>
      <Authorize props={props}>
        <Table />
      </Authorize>
    </>
  );
};

const Table = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<ProjectInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);
  const pagination: Pagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  const router = useRouter();
  const toast = useToast();
  const hasEditPermission = useAuth([PermissionsEnum.UPDATE_PROJECT]);
  const hasCreatePermission = useAuth([PermissionsEnum.CREATE_PROJECT]);

  const columns: Column<ProjectInterface>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Ativo", accessor: "isActive" },
  ];

  //TODO: ver bug ativar/desativar (label)
  const actionButtons: ActionButton<ProjectInterface>[] = [
    {
      label: "Detalhes",
      onClick: (row) => openModal(row),
      icon: <BsEye />,
      show: () => true,
    },
    {
      label: "Editar",
      onClick: (row) => router.push(`/projects/form/${row._id}`),
      show: () => hasEditPermission.hasPermission,
    },
    {
      label: (row) => (row.isActive ? "Desativar" : "Ativar"),
      onClick: async (row) => {
        try {
          await services.projectService.toggleActive(row._id);
          getAll();
        } catch (error) {
          toast("Erro ao atualizar projeto", "error");
        }
      },
      show: () => hasEditPermission.hasPermission,
    },
  ];

  const getAll = useCallback(
    async (search?: string) => {
      try {
        setLoading(true);
        const response = await services.projectService.getAll({
          page: currentPage,
          limit: 10,
          search,
        });
        setData(response.data);
        setTotalPages(Math.ceil(response.total / response.limit));
      } catch (error) {
        toast("Erro ao buscar projetos", "error");
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    getAll();
  }, [currentPage]);

  const handleFilterSubmit = (data: { search: string }) => {
    getAll(data.search);
  };

  const formmatData = (data: ProjectInterface[]) => {
    return data.map((project) => {
      return {
        ...project,
        isActive: project.isActive ? "Ativo" : "Inativo",
      };
    });
  };

  const openModal = (project: ProjectInterface) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <Authorize props={{}}>
        {loading && <div>Carregando...</div>}
        {!loading && (
          <>
            <Filters
              title="Projetos"
              onSubmit={handleFilterSubmit}
              canCreate={hasCreatePermission.hasPermission}
              handleCreate={() => router.push("/projects/form")}
            />
            <DataTable
              columns={columns}
              data={formmatData(data)}
              pagination={pagination}
              actionButtons={actionButtons}
            />
            <ViewProjectModal
              isOpen={isModalOpen}
              onClose={closeModal}
              project={selectedProject}
            />
          </>
        )}
      </Authorize>
    </>
  );
};

export default page;
