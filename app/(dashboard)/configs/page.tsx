"use client";
import Authorize from "@/app/components/Authorize";
import { PermissionsEnum } from "@/app/enums/permissions.enum";
import useAuth from "@/app/hooks/useAuth";
import Link from "next/link";
import { MdDynamicForm } from "react-icons/md";

const Page = () => {
  const canAccessForms = useAuth([PermissionsEnum.VIEW_FORM]);
  const props = {
    permission: PermissionsEnum.VIEW_CONFIGS,
  };

  return (
    <>
      <Authorize props={props}>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        {canAccessForms.hasPermission && <FormCard />}
      </Authorize>
    </>
  );
};

export default Page;

const FormCard = () => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure className="px-10 pt-10">
        <MdDynamicForm className="text-8xl flex justify-center" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Formulários</h2>
        <p>Crie e edite seus formulários dinámicos por projeto</p>
        <div className="card-actions justify-end">
          <Link href={"forms"} className="btn btn-primary">
            Acessar
          </Link>
        </div>
      </div>
    </div>
  );
};
