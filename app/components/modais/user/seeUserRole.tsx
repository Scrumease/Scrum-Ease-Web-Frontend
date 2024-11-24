"use client";

import React, { useState } from "react";
import Modal from "../../Modal";
import { RoleDocument } from "@/app/interfaces/role/role.document";
import { UserDocument } from "@/app/interfaces/user/user.document";
import {
  PermissionsEnum,
  categoryTranslations,
  permissionTranslations,
} from "@/app/enums/permissions.enum";

interface SeeUserRoleModalProps {
  isOpen: boolean;
  onClose: (triggerUpdatePage: boolean) => void;
  roles: RoleDocument[];
  userRole: {
    user: UserDocument;
    role: RoleDocument;
  };
  onChangeRole: (newRoleId: string, userId: string) => Promise<void>;
}

const SeeUserRoleModal: React.FC<SeeUserRoleModalProps> = ({
  isOpen,
  onClose,
  roles = [],
  userRole,
  onChangeRole,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState(userRole.role._id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!userRole) return null;

  const handleRoleChange = async () => {
    setLoading(true);
    setError("");
    try {
      await onChangeRole(selectedRoleId, userRole.user._id);
      onClose(true);
    } catch (err) {
      setError("Erro ao trocar o cargo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const groupPermissions = (permissions: string[]) => {
    const grouped = permissions.reduce((acc, permissionValue) => {
      const permissionKey = Object.entries(PermissionsEnum).find(
        ([, value]) => value === permissionValue
      )?.[0];

      if (permissionKey) {
        const category = permissionKey.split("_")[0];
        if (!acc[category]) acc[category] = [];
        acc[category].push(permissionTranslations[permissionKey]);
      }

      return acc;
    }, {} as Record<string, string[]>);

    return grouped;
  };

  const groupedPermissions = groupPermissions(
    userRole.role.permissions as unknown as string[]
  );

  return (
    <Modal
      title="Cargo do Usuário"
      isOpen={isOpen}
      onClose={() => onClose(false)}
      id="view-user-role"
    >
      <div className="p-4 max-w-lg w-full">
        <h3 className="text-lg font-semibold">
          Usuário: {userRole.user.name} ({userRole.user.email})
        </h3>
        <div className="mt-4">
          <h4 className="text-md font-medium">Permissões do Cargo Atual:</h4>
          <div className="mt-2 text-sm grid grid-cols-2">
            {Object.entries(groupedPermissions).map(
              ([category, permissions]) => (
                <div key={category} className="mb-4">
                  <h5 className="font-semibold">
                    {" "}
                    {categoryTranslations[category] || category}
                  </h5>
                  <ul className="list-disc list-inside">
                    {permissions.map((permission, index) => (
                      <li key={index}>{permission}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
        <div className="mt-6">
          <label
            htmlFor="role-select"
            className="block text-sm font-medium text-gray-700"
          >
            Alterar Cargo
          </label>
          <select
            id="role-select"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            disabled={loading}
          >
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            onClick={handleRoleChange}
            disabled={loading}
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SeeUserRoleModal;
