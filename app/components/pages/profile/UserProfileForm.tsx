"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/interfaces/user/user.interface";
import { FaCopy } from "react-icons/fa";
import { services } from "@/app/services/services";

const userProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  user: { name: string; email: string };  
  defaultValues: UserProfileFormValues;
  onSubmit: (data: UserProfileFormValues) => void;
}

const generateToken = async () => {
 return await services.integrationTokenService.generateToken(); 
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({ defaultValues, onSubmit, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
  });

  const copyToClipboard = async () => {
    const token = await generateToken();
    navigator.clipboard.writeText(token).then(() => {
      alert("Token copiado para a área de transferência!");
    }).catch(err => {
      console.error("Erro ao copiar para a área de transferência: ", err);
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl p-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Informações do Usuário</h2>
        <div className="flex items-center">
              <label className="w-full font-sm text-gray-500">Copiar token de integração:</label>
              <button
                type="button"
                onClick={async () => await copyToClipboard()}
                title="Copiar Token"
              >
                <FaCopy className="text-gray-500"/>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-36 font-semibold">Email:</label>
              <span className="flex-1 text-gray-400">{user.email}</span>
            </div>
            <div className="flex items-center flex-col gap-2">
              <label className="w-full font-semibold">Nome:</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`input input-bordered w-full ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
                    disabled={!isEditing}
                  />
                )}
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              {isEditing ? (
                <>
                  <button type="submit" className="btn btn-primary">Salvar</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">Cancelar</button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="btn btn-primary">Editar</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
