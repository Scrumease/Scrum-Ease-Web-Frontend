"use client";
import { Tenant } from "@/app/interfaces/tenant/tenant.interface";
import React from "react";

interface OrganizationListProps {
    organizations: Tenant[] | null;
    isLoading: boolean;
    onViewDetails: (id: string) => void;
  }
  
  const OrganizationList: React.FC<OrganizationListProps> = ({ organizations, isLoading, onViewDetails }) => {
    return (
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Organizações</h2>
          {isLoading ? (
            <OrganizationSkeleton />
          ) : (
            <ul className="space-y-4">
              {organizations?.map((org) => (
                <li key={org._id} className="border-b border-base-200 py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{org.name}</h3>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => onViewDetails(org._id)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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