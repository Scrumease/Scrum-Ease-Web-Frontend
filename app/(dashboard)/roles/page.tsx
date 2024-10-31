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
import Filters from "./filters";
import { BsEye } from "react-icons/bs";
import { Role } from "@/app/interfaces/role/role.interface";
import { z } from "zod";
import useAuth from "@/app/hooks/useAuth";
import CreateEditModal from "@/app/components/modais/createEdit";
import { PermissionsEnum } from "@/app/enums/permissions.enum";

const Page = () => {
  const props = {
    permission: PermissionsEnum.VIEW_ROLE,
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
  const [data, setData] = useState<Role[]>([]);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const createPermission = useAuth([PermissionsEnum.CREATE_ROLE]);
  const updatePermission = useAuth([PermissionsEnum.UPDATE_ROLE]);

  const pagination: Pagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  const columns: Column<Role>[] = [{ header: "Nome", accessor: "name" }];

  const actionButtons: ActionButton<Role>[] = [
    {
      label: "Detalhes",
      onClick: (row) => console.log("Detalhes:", row),
      icon: <BsEye />,
      show: () => true,
    },
    {
      label: "Editar",
      onClick: (row) => handleEdit(row),
      show: () => updatePermission.hasPermission,
    },
  ];

  const handleEdit = (row: Role) => {
    setSelectedRole(row);
    setEditModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const getAll = useCallback(
    async (search?: string) => {
      try {
        const limit = 10;
        const response = await services.roleService.getAll({
          page: currentPage,
          limit: limit,
          search,
        });
        setData(response.data);
        const totalPages = Math.ceil(response.total / limit);
        setTotalPages(totalPages);
      } catch (error) {}
    },
    [currentPage]
  );

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleFilterSubmit = (data: { search: string }) => {
    getAll(data.search);
  };

  return (
    <>
      <Filters
        onSubmit={handleFilterSubmit}
        canCreate={createPermission.hasPermission}
        handleCreate={handleCreate}
      />
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        actionButtons={actionButtons}
      />
      {selectedRole && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          role={selectedRole}
        />
      )}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        refreshList={getAll}
      />
    </>
  );
};

const EditRoleModal = ({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}) => {
  const [permissions, setPermissions] = useState<Record<string, string>>({});
  const [roleData, setRoleData] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<any>();

  const getAllPermissions = async () => {
    try {
      const response = await services.roleService.getAllPermissions();
      setPermissions(response);
      return response;
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const getRole = async () => {
    try {
      const response = await services.roleService.getByName(role.name);
      setRoleData(response);
      return response;
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const getInitialInfos = useCallback(async () => {
    setIsLoading(true);
    const [permissions, role] = await Promise.all([
      getAllPermissions(),
      getRole(),
    ]);
    const fields = Object.keys(permissions!).map((permission) => ({
      name: permission,
      label: permissions![permission],
      type: "checkbox",
      showTooltip: false,
      validationSchema: z.boolean(),
    }));

    const initialValues = Object.keys(permissions!).reduce(
      (acc, key) => ({
        ...acc,
        [key]: role?.permissions?.includes(key) || false,
      }),
      {}
    );

    setForm({
      fields: fields,
      initialValues: initialValues,
    });
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role.name]);

  useEffect(() => {
    if (isOpen) {
      getInitialInfos();
    }
  }, [isOpen, getInitialInfos]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const permissions = Object.keys(values).filter((key) => values[key]);
      await services.roleService.updateRole(role._id, permissions);
      onClose();
    } catch (error) {
      console.error("Erro ao editar cargo:", error);
      throw error;
    }
  };

  return (
    <CreateEditModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Permissoẽs - ${role.name}`}
      fields={form.fields}
      initialValues={form.initialValues}
      onSubmit={handleSubmit}
      gridColumns={{
        base: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
      }}
    />
  );
};

const CreateRoleModal = ({
  isOpen,
  onClose,
  refreshList,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshList: () => void;
}) => {
  const [permissions, setPermissions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<any>();

  const getAllPermissions = async () => {
    try {
      const response = await services.roleService.getAllPermissions();
      setPermissions(response);
      return response;
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const getInitialInfos = useCallback(async () => {
    setIsLoading(true);
    const permissions = await getAllPermissions();

    const fields = [
      {
        name: "roleName",
        label: "Nome do Cargo",
        type: "text",
        showTooltip: false,
        className: {
          container: "col-span-full",
        },
        validationSchema: z.string().min(1, "O nome do cargo é obrigatório"),
      },
      ...Object.keys(permissions!).map((permission) => ({
        name: permission,
        label: permissions![permission],
        type: "checkbox",
        showTooltip: false,
        validationSchema: z.boolean(),
      })),
    ];

    const initialValues = {
      roleName: "",
      ...Object.keys(permissions!).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      ),
    };

    setForm({
      fields: fields,
      initialValues: initialValues,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      getInitialInfos();
    }
  }, [isOpen, getInitialInfos]);

  if (isLoading) {
    return;
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const permissions = Object.keys(values).filter((key) => values[key]);
      await services.roleService.createRole({
        permissions,
        name: values.roleName,
      });
      onClose();
      refreshList();
    } catch (error) {
      console.error("Erro ao criar cargo:", error);
      throw error;
    }
  };

  return (
    <CreateEditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Novo Cargo"
      fields={form.fields}
      initialValues={form.initialValues}
      onSubmit={handleSubmit}
      gridColumns={{
        base: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
      }}
    />
  );
};

export default Page;
