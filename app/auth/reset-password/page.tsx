"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { allTimezones } from "react-timezone-select";
import { ResetPasswordSchema, resetPasswordSchema } from "./form";
import { useToast } from "@/app/context/ToastContext";
import { services } from "@/app/services/services";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};

const Page = () => {
  const searchParams = useSearchParams();

  const params = {
    token: searchParams.get("token") ?? "",
    email: searchParams.get("email") ?? "",
    validity: searchParams.get("validity") ?? "",
  };

  return (
    <Form
      token={params.token}
      email={params.email}
      validity={params.validity}
    ></Form>
  );
};

export default Page;

const Form = ({
  token,
  email,
  validity,
}: {
  token: string;
  email: string;
  validity: string;
}) => {
  const [showPassword, setShowPassword] = useState<{
    [key: string]: { show: boolean };
  }>({
    password: { show: false },
  });
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      await services.authService.resetPassword(
        { ...data },
        { token, email, validity }
      );
      toast("Senha alterada com sucesso", "success");
      router.push("/auth/login");
    } catch (error: any) {
      toast(
        "Erro: " + (error.response?.data?.message ?? "Erro desconhecido"),
        "error"
      );
      console.error("Error resetting password:", error);
    }
  };

  const togglePasswordVisibility = (field: "password") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: { show: !prev[field].show },
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-fit shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title flex flex-row justify-center w-full">
            Resetar Senha
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Senha</span>
              </label>
              <div className="input input-bordered flex items-center gap-2">
                <input
                  type={showPassword.password.show ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="grow"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => {
                    togglePasswordVisibility("password");
                  }}
                >
                  {showPassword.password.show ? (
                    <BsEyeSlash className="h-6 w-6 text-gray-400" />
                  ) : (
                    <BsEye className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="form-control mt-4">
              <button className="btn btn-success text-white" type="submit">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
