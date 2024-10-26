"use client";
import Authorize from "@/app/components/Authorize";
import ChangePasswordForm from "@/app/components/pages/profile/ChangePasswordForm";
import OrganizationList from "@/app/components/pages/profile/OrganizationListComponent";
import UserProfileForm from "@/app/components/pages/profile/UserProfileForm";
import { getUserInfoFromToken } from "@/app/utils/token";
import React from "react";

const UserProfile = () => {
  const userInfo = getUserInfoFromToken();

  const handleProfileSubmit = (data: any) => {
    console.log("Dados do perfil enviados: ", data);
    // Lógica para salvar as alterações do perfil
  };

  const handlePasswordSubmit = (data: any) => {
    console.log("Dados de troca de senha enviados: ", data);
    // Lógica para trocar a senha
  };

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
              organizations={[]}
              onViewDetails={(id: string) => console.log(id)}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </Authorize>
  );
};

export default UserProfile;
