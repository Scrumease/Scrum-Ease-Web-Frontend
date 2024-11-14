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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const newTenantSchema = z.object({
  name: z.string().min(3, { message: "Insira um nome válido" }),
  identifier: z.string().min(14, { message: "Identificador inválido" }),
});

type NewTenantSchema = z.infer<typeof newTenantSchema>;

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTenantModal: React.FC<NewTenantModalProps> = ({ isOpen, onClose }) => {
  const [isValidToSend, setIsValidToSend] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    ...form
  } = useForm<NewTenantSchema>({
    resolver: zodResolver(newTenantSchema),
  });

  const addToast = useToast();

  const handlerCreate = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await services.tenantService.create({
        name: form.getValues("name"),
        identifier: form.getValues("identifier"),
      });
      addToast("Organização criada com sucesso.", "success");
      setIsValidToSend(false);
      onClose();
      await services.authService.updateToken();
    } catch (error: any) {
      console.error(error);
      addToast(
        "Erro ao criar organização: " + error.response.data.message,
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Nova Organização"
      isOpen={isOpen}
      onClose={onClose}
      id="newTenant"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nome </span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register("name")}
          placeholder="Digite o nome da organização."
        />
        {errors && errors.name?.message && (
          <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">CPF/CNPJ </span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          {...register("identifier")}
          placeholder="Digite o cpf/cnpj da organização."
        />
        {errors && errors.identifier?.message && (
          <p className="text-red-500 text-xs mt-1">
            {errors.identifier?.message}
          </p>
        )}
      </div>
      <div className="modal-action">
        {submitting ? (
          <button className="btn btn-primary" disabled>
            Enviando...
          </button>
        ) : (
          <button
            className={`btn btn-primary ${
              isDirty && !isValid ? "disabled" : ""
            }`}
            onClick={handleSubmit(handlerCreate)}
            disabled={isDirty && !isValid}
          >
            Criar Organização
          </button>
        )}
      </div>
    </Modal>
  );
};

export default NewTenantModal;
