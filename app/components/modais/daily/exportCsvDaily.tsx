"use client";

import React, { useState } from "react";
import Modal from "../../Modal";

interface ExportCsvModalProps {
  isOpen: boolean;
  onClose: (
    triggerExport: boolean,
    data?: { startDate: string; endDate: string; userIds: string[] }
  ) => void;
  users: {
    _id: string;
    name: string;
    email: string;
  }[];
}

const firstDayOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
)
  .toISOString()
  .split("T")[0];
const lastDayOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
)
  .toISOString()
  .split("T")[0];

const ExportCsvModal: React.FC<ExportCsvModalProps> = ({
  isOpen,
  onClose,
  users = [],
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
  const [error, setError] = useState("");

  const handleExport = () => {
    if (!startDate || !endDate) {
      setError("Por favor, selecione uma data de início e uma data de fim.");
      return;
    }

    setError("");
    onClose(true, { startDate, endDate, userIds: selectedUserIds });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Modal
      title="Exportar Respostas para CSV"
      isOpen={isOpen}
      onClose={() => onClose(false)}
      id="export-csv-modal"
    >
      <div className="p-4 max-w-lg w-full">
        <h3 className="text-lg font-semibold">Definir Filtros</h3>

        <div className="flex flex-row gap-4 w-full">
          <div className="mt-4 w-full">
            <label htmlFor="start-date" className="block text-sm font-medium">
              Data de Início
            </label>
            <input
              type="date"
              id="start-date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="mt-4 w-full">
            <label htmlFor="end-date" className="block text-sm font-medium">
              Data de Fim
            </label>
            <input
              type="date"
              id="end-date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium">Selecione os Usuários</h4>
          <div className="mt-2 flex flex-col gap-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                />
                {user.name} ({user.email})
              </label>
            ))}
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        {/* Botões de ação */}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={() => onClose(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            Exportar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportCsvModal;
