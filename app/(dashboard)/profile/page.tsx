"use client";
import Authorize from "@/app/components/Authorize";
import ChangePasswordForm from "@/app/components/pages/profile/ChangePasswordForm";
import OrganizationList from "@/app/components/pages/profile/OrganizationListComponent";
import UserProfileForm from "@/app/components/pages/profile/UserProfileForm";
import { useToast } from "@/app/context/ToastContext";
import { FindAllTenantsResponseDto } from "@/app/interfaces/tenant/FindAllTenantsResponseDto";
import { services } from "@/app/services/services";
import { getUserInfoFromToken } from "@/app/utils/token";
import React, { useCallback, useEffect, useState } from "react";

const UserProfile = () => {
  const toast = useToast();
  const [tenants, setTenants] = useState<FindAllTenantsResponseDto[]>([]);

  const userInfo = getUserInfoFromToken();

  const handleProfileSubmit = (data: any) => {
    console.log("Dados do perfil enviados: ", data);
    // Lógica para salvar as alterações do perfil
  };

  const handlePasswordSubmit = async (data: any) => {
    try {
      await services.authService.changePassword({ ...data });
      toast("Senha alterada com sucesso", "success");
    } catch (error) {
      console.error("Erro ao alterar a senha: ", error);
      toast("Erro ao alterar a senha", "error");
    }
  };

  const getTenants = useCallback(async () => {
    try {
      const tenants = await services.tenantService.findAll();
      setTenants(tenants);
    } catch (error) {}
  }, []);

  useEffect(() => {
    getTenants();
  }, [getTenants]);

  return (
    <Authorize props={{}}>
      <div className="min-h-full">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <UserProfileForm
              user={{ name: userInfo!.name, email: userInfo!.email }}
              defaultValues={{ name: userInfo!.name }}
              onSubmit={handleProfileSubmit}
            />
            <ChangePasswordForm onSubmit={handlePasswordSubmit} />
          </div>
          <div>
            <OrganizationList
              refreshList={getTenants}
              organizations={tenants}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </Authorize>
  );
};

export default UserProfile;
