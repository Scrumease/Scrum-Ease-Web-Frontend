"use client";

import React, { useCallback, useEffect, useState } from "react";
import Authorize from "@/app/components/Authorize";
import DataTable from "@/app/components/table/DataTable";
import {
  ActionButton,
  Column,
  Pagination,
} from "@/app/components/table/interface";
import { services } from "@/app/services/services";
import Filters from "./filters";
import { PermissionsEnum } from "@/app/enums/permissions.enum";
import SeeUserRoleModal from "@/app/components/modais/user/seeUserRole";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { BsEye } from "react-icons/bs";
import { RoleDocument } from "@/app/interfaces/role/role.document";
import { useToast } from "@/app/context/ToastContext";
import useAuth from "@/app/hooks/useAuth";

const Page = () => {
  const props = {
    permission: PermissionsEnum.LIST_USERS,
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
  const [data, setData] = useState<UserDocument[]>([]);
  const [roles, setRoles] = useState<RoleDocument[]>([]);
  const toast = useToast();

  const pagination: Pagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  const columns: Column<UserDocument>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  const hasEditPermission = useAuth([PermissionsEnum.UPDATE_USER_ROLE]);
  const actionButtons: ActionButton<UserDocument>[] = [
    {
      label: "Ver Cargo",
      show: () => hasEditPermission.hasPermission,
      onClick: (row) =>
        setSeeUserRoleModalState({
          isOpen: true,
          userRole: {
            user: {
              ...row,
            },
            role: {
              ...(row.tenantRoles[0].role as RoleDocument),
            },
          },
        }),
      icon: <BsEye />,
    },
  ];

  const getAll = useCallback(
    async (search?: string) => {
      try {
        const response = await services.userService.getAll({
          page: currentPage,
          limit: 10,
          search,
        });
        setData(response.data);
        setTotalPages(Math.ceil(response.total / 10));
      } catch (error) {}
    },
    [currentPage]
  );

  const getRoles = useCallback(async () => {
    try {
      const response = await services.roleService.getAll({
        page: 1,
        limit: -1,
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleFilterSubmit = (data: { search: string }) => {
    getAll(data.search);
  };

  const [seeUserRoleModalState, setSeeUserRoleModalState] = useState<{
    isOpen: boolean;
    userRole: {
      user: UserDocument;
      role: RoleDocument;
    } | null;
  }>({
    isOpen: false,
    userRole: {
      user: {} as UserDocument,
      role: {} as RoleDocument,
    },
  });

  const changeRole = async (newRoleId: string, userId: string) => {
    try {
      await services.userService.updateRole({
        userId,
        roleId: newRoleId,
      });
    } catch (error) {
      toast("Erro ao trocar o cargo. Tente novamente.", "error");
      throw error;
    }
  };

  return (
    <>
      <Filters onSubmit={handleFilterSubmit} />
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        actionButtons={actionButtons}
      />
      {seeUserRoleModalState.isOpen && (
        <SeeUserRoleModal
          isOpen={seeUserRoleModalState.isOpen}
          onClose={async (triggerUpdatePage) => {
            setSeeUserRoleModalState({ isOpen: false, userRole: null });
            if (triggerUpdatePage) {
              await getAll();
            }
          }}
          roles={roles}
          userRole={seeUserRoleModalState.userRole!}
          onChangeRole={async (newRoleId, userId) =>
            await changeRole(newRoleId, userId)
          }
        />
      )}
    </>
  );
};

export default Page;
