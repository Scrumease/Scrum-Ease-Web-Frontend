"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import { FaInfoCircle } from "react-icons/fa";
import { ZodSchema } from "zod";
import { useToast } from "@/app/context/ToastContext";

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: {
    name: string;
    label: string;
    placeholder?: string;
    validationSchema: ZodSchema;
    showTooltip: boolean;
    type?: string;
    className?: {
      container?:string
      label?:string
      input?:string 
    };
    options?: { value: string; label: string }[];
  }[];
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  gridColumns: {
    base: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
  gridColumns,
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const addToast = useToast();

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    validateField(name, type === "checkbox" ? checked : value);
  };

  const validateField = (name: string, value: any) => {
    const field = fields.find((f) => f.name === name);
    if (field) {
      const validationResult = field.validationSchema.safeParse(value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: validationResult.success ? "" : "Invalid input",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const validationResult = field.validationSchema.safeParse(
        formValues[field.name]
      );
      if (!validationResult.success) {
        isValid = false;
        newErrors[field.name] = "Invalid input";
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
        addToast(initialValues ? "Mudanças salvas com sucesso" : "Item criado com sucesso", "success");
        onClose();
      } catch (error: any) {
        console.error(error);
        addToast(
          "Erro ao salvar as modificações: " + error.response.data.message,
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose} id="create-edit">
      <form className="flex flex-col justify-center items-center">
        <div
          className={`w-full grid grid-cols-${gridColumns.base} sm:grid-cols-${gridColumns.sm} md:grid-cols-${gridColumns.md} lg:grid-cols-${gridColumns.lg} xl:grid-cols-${gridColumns.xl} gap-4`}
        >
          {fields.map((field) => (
            <div key={field.name} className={field.className?.container + ' form-control'}>
              {field.type !== "checkbox" && (
                <label className="label">
                  <span className="label-text">
                    {field.label}{" "}
                    {field.showTooltip && (
                      <div
                        className="tooltip tooltip-right"
                        data-tip="Field tooltip"
                      >
                        <FaInfoCircle />
                      </div>
                    )}
                  </span>
                </label>
              )}
              {field.type === "checkbox" ? (
                <div className="flex items-center">
                  <input
                    className={field.className?.input || ""}
                    type="checkbox"
                    name={field.name}
                    checked={formValues[field.name] || false}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={field.name} className="ml-2">
                    {field.label}
                  </label>
                </div>
              ) : field.type === "select" && field.options ? (
                <select
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={handleInputChange}
                  className={(field.className?.input || "") + ' input input-bordered'}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  className={(field.className?.input || "") + ' input input-bordered'}
                  value={formValues[field.name] || ""}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                />
              )}
              {formErrors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="modal-action">
          <button
            type="button"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {"Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEditModal;
