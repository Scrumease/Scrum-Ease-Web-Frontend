"use client";
import Authorize from "@/app/components/Authorize";
import Table from "@/app/components/pages/forms/table";
import { PermissionsEnum } from "@/app/enums/permissions.enum";
import useAuth from "@/app/hooks/useAuth";
const Page = () => {
  const canCreate = useAuth([PermissionsEnum.CREATE_FORM]);
  const props = {
    permission: PermissionsEnum.VIEW_FORM,
  };

  return (
    <>
      <Authorize props={props}>
        <Table canCreate={canCreate.hasPermission} />
      </Authorize>
    </>
  );
};

export default Page;
