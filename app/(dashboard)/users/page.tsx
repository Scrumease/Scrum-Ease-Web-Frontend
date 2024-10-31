"use client";

import React, { useCallback, useEffect, useState } from "react";
import Authorize from "@/app/components/Authorize";
import DataTable from "@/app/components/table/DataTable";
import { Column, Pagination } from "@/app/components/table/interface";
import { services } from "@/app/services/services";
import Filters from "./filters";
import { User } from "@/app/interfaces/user/user.interface";
import { PermissionsEnum } from "@/app/enums/permissions.enum";

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
  const [data, setData] = useState<User[]>([]);

  const pagination: Pagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };

  const columns: Column<User>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
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
        setTotalPages(response.total);
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
      <Filters onSubmit={handleFilterSubmit} />
      <DataTable columns={columns} data={data} pagination={pagination} />
    </>
  );
};

export default Page;
