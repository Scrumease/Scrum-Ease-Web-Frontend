"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "Senha atual deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmNewPassword: z.string().min(6, "Confirmação da nova senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas novas devem coincidir",
  path: ["confirmNewPassword"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface ChangePasswordFormProps {
  onSubmit: (data: PasswordChangeFormValues) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Trocar Senha</h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-primary mb-4"
        >
          {isEditing ? "Cancelar" : "Alterar Senha"}
        </button>
        {isEditing && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">Senha Atual:</label>
                <div className="relative">
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        className="input input-bordered w-full pr-10"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-500">{errors.currentPassword.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">Nova Senha:</label>
                <div className="relative">
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        className="input input-bordered w-full pr-10"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">Confirmar Nova Senha:</label>
                <div className="relative">
                  <Controller
                    name="confirmNewPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={showConfirmNewPassword ? "text" : "password"}
                        className="input input-bordered w-full pr-10"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmNewPassword && <p className="text-red-500">{errors.confirmNewPassword.message}</p>}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">Trocar Senha</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordForm;
