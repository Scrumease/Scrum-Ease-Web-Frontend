"use client";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { FaInfoCircle } from "react-icons/fa";
import { z } from "zod";
import { services } from "@/app/services/services";
import { useToast } from "@/app/context/ToastContext";
import { Role } from "@/app/interfaces/role/role.interface";
import useAuth from "@/app/hooks/useAuth";
import { PermissionsEnum } from "@/app/enums/permissions.enum";

const emailSchema = z.string().email();

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isValidToSend, setIsValidToSend] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("Usuário");
  const { hasPermission } = useAuth([PermissionsEnum.CREATE_ROLE]);

  const addToast = useToast();

  const handleInvite = async () => {
    let emailsUpdated = [...emails];
    if (emailInput != null && emailInput != "") {
      setEmails([...emails, emailInput]);
      emailsUpdated = [...emailsUpdated, emailInput];
    }
    try {
      await services.mailService.invite({
        tos: emailsUpdated,
        roleName: selectedRole,
      });
      addToast(
        `convites enviados para: ${emailsUpdated.join(", ")}`,
        "success"
      );
      setIsValidToSend(false);
      setEmails([]);
      onClose();
    } catch (error: any) {
      console.error(error);
      addToast("Erro ao convidar: " + error.response.data.message, "error");
    } finally {
      setEmailInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Verifica se foi digitada uma vírgula para adicionar um novo email
    if (value.endsWith(",")) {
      const newEmail = value.slice(0, -1).trim();
      validateAndAddEmail(newEmail);
    } else {
      setEmailInput(value);
      validateAndEnableButton(value);
    }
  };

  const validateAndEnableButton = (value: string) => {
    // Valida o email apenas se houver algum valor no input
    if (value.trim() === "") {
      setIsValidToSend(emails.length > 0);
    } else {
      validateEmail(value);
    }
  };

  const validateAndAddEmail = (newEmail: string) => {
    // Valida e adiciona o email se for válido
    const validationResult = emailSchema.safeParse(newEmail);

    if (validationResult.success) {
      setEmails([...emails, newEmail]);
      setEmailInput("");
      setEmailError("");
      setIsValidToSend(true);
    } else {
      setEmailError("Invalid email address");
      setIsValidToSend(false);
    }
  };

  const validateEmail = (value: string) => {
    const validationResult = emailSchema.safeParse(value);

    if (validationResult.success) {
      setIsValidToSend(true);
      setEmailError("");
    } else {
      setIsValidToSend(false);
      setEmailError("Invalid email address");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));

    // Verifica se ainda há emails válidos para determinar se o botão de enviar deve ser habilitado
    setIsValidToSend(
      emails.length > 1 ||
        (emails.length === 1 && emailSchema.safeParse(emails[0]).success)
    );
  };

  const fetchRoles = async () => {
    try {
      const roles = await services.roleService.getAll({ page: 1, limit: -1 });
      setRoles(roles.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  return (
    <Modal
      title="Convide um amigo"
      isOpen={isOpen}
      onClose={onClose}
      id="invite"
    >
      <div className="form-control">
        <select
          defaultValue={selectedRole}
          className="select select-bordered w-full max-w-xs"
          onChange={(event) => setSelectedRole(event.target.value)}
          disabled={roles.length === 0}
        >
          {roles.map((role) => (
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
          {roles.length === 0 && (
            <option value="Usuário" disabled>
              {selectedRole}
            </option>
          )}
        </select>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Email{" "}
            <div
              className="tooltip tooltip-right"
              data-tip="Separe por vírgula para adicionar mais de um email."
            >
              <FaInfoCircle />
            </div>
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={emailInput}
          onChange={handleInputChange}
          placeholder="Digite endereçoo endereço de email."
        />
        {emailError && (
          <p className="text-red-500 text-xs mt-1">{emailError}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 my-4">
        {emails.map((email, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded px-3 py-1 text-sm"
          >
            {email}
            <button
              className="ml-2 text-red-600"
              onClick={() => handleRemoveEmail(email)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="modal-action">
        <button
          className={`btn btn-primary ${
            !isValidToSend ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleInvite}
          disabled={!isValidToSend}
        >
          Enviar convite(s)
        </button>
      </div>
    </Modal>
  );
};

export default InviteModal;
