"use client";

import React from "react";
import Modal from "../Modal";
import { ProjectInterface } from "@/app/interfaces/project/project.interface";
import { User } from "@/app/interfaces/user/user.interface";

interface ViewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInterface | null;
}

const ViewProjectModal: React.FC<ViewProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!project) return null;

  return (
    <Modal
      title="Visualização de Projeto"
      isOpen={isOpen}
      onClose={onClose}
      id="view-project"
    >
      <div className="p-4 max-w-max">
        <div className="grid grid-cols-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Nome do Projeto</h2>
            <p>{project.name}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Descrição</h2>
            <p>{project.description}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Status</h2>
            <p>{project.isActive}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Criado em</h2>
            <p>{new Date(project.createdAt).toLocaleString()}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Última atualização</h2>
            <p>{new Date(project.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Membros do Projeto</h2>
          {project.users.length > 0 ? (
            <ul className="list-disc ml-6">
              {project.users.map((member, index) => (
                <li key={index} className="mb-2">
                  <p className="font-medium">{(member as User).name}</p>
                  <p className="text-sm text-gray-500">
                    {(member as User).email}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              Nenhum membro adicionado ao projeto.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewProjectModal;
