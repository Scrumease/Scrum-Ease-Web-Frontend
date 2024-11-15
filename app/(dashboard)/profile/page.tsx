"use client";
import Authorize from "@/app/components/Authorize";
import ChangePasswordForm from "@/app/components/pages/profile/ChangePasswordForm";
import OrganizationList from "@/app/components/pages/profile/OrganizationListComponent";
import UserProfileForm from "@/app/components/pages/profile/UserProfileForm";
import { useToast } from "@/app/context/ToastContext";
import { FindAllTenantsResponseDto } from "@/app/interfaces/tenant/FindAllTenantsResponseDto";
import { UserDocument } from "@/app/interfaces/user/user.document";
import { services } from "@/app/services/services";
import React, { useCallback, useEffect, useState } from "react";

const UserProfile = () => {
  const toast = useToast();
  const [tenants, setTenants] = useState<FindAllTenantsResponseDto[]>([]);

  const [user, setUser] = useState<UserDocument>();

  const handleProfileSubmit = async (data: any) => {
    try {
      await services.userService.update({ ...data });
      toast("Usuário atualizado com sucesso", "success");
      await getMe();
    } catch (error) {
      console.error("Erro ao atualizar o usuário: ", error);
      toast("Erro ao atualizar o usuário", "error");
    }
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

  const getMe = useCallback(async () => {
    try {
      const me = await services.userService.me();
      setUser(me);
    } catch (error) {
      console.error("Erro ao buscar informações do usuário: ", error);
    }
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  const initialRequest = useCallback(async () => {
    Promise.all([getTenants(), getMe()]).then(() => setIsLoading(false));
  }, [getTenants, getMe]);

  useEffect(() => {
    initialRequest();
  }, [initialRequest]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="spinner border-b-2 border-gray-900 h-20 w-20"></div>
      </div>
    );
  }

  return (
    <Authorize props={{}}>
      <div className="min-h-full">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <UserProfileForm
              user={{ name: user!.name, email: user!.email }}
              defaultValues={{
                name: user?.name ?? "",
                timezone: user?.timezone ?? { value: "UTC", offset: 0 },
              }}
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
