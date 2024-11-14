"use client";
import { useToast } from "@/app/context/ToastContext";
import { FindAllTenantsResponseDto } from "@/app/interfaces/tenant/FindAllTenantsResponseDto";
import { Tenant } from "@/app/interfaces/tenant/tenant.interface";
import { services } from "@/app/services/services";
import React from "react";
import NewTenantModal from "../../modais/newTenant";

interface OrganizationListProps {
  organizations: FindAllTenantsResponseDto[] | null;
  isLoading: boolean;
  refreshList: () => void;
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  isLoading,
  refreshList,
}) => {
  const toast = useToast();

  const leave = async (id: string) => {
    try {
      await services.tenantService.leave(id);
      refreshList();
    } catch (error) {
      toast("Erro ao sair da organização", "error");
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <div className="card-body">
        <h2 className="card-title mb-4">
          <div className="flex justify-between items-center gap-4 w-full">
            <span>Organizações</span>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              Adicionar
            </button>
          </div>
        </h2>
        {isLoading ? (
          <OrganizationSkeleton />
        ) : (
          <ul className="space-y-4">
            {organizations?.map((org) => (
              <li key={org._id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{org.name ?? "-"}</h3>
                  </div>
                  {!org.isAdmin && organizations.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={() => leave(org._id)}
                    >
                      Sair
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isOpen && (
        <NewTenantModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            refreshList();
          }}
        />
      )}
    </div>
  );
};

const OrganizationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 animate-pulse">
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;
