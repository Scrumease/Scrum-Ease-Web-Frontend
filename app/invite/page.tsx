"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { services } from "../services/services";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CompleteRegistrationFormValues,
  completeRegistrationSchema,
} from "./form";
import { useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useToast } from "../context/ToastContext";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};

const Page = () => {
  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const router = useRouter();
  const addToast = useToast();

  const [newUser, setNewUser] = useState<boolean>(false);

  const params = {
    token: searchParams.get("token") ?? "",
    email: searchParams.get("email") ?? "",
    tenantId: searchParams.get("tenant") ?? "",
  };

  const validateToken = async (token: string) => {
    try {
      const response = await services.authService.checkInviteToken({
        token,
        email: params.email,
        tenantId: params.tenantId,
      });

      if (!response.newUser) {
        await services.authService.completeRegistrationRegisteredUser({
          tenantId: params.tenantId,
          email: params.email,
        });
        addToast(
          "Organização adicionada, redirecionando para login",
          "success"
        );
        redirect("/auth/login");
      }

      setNewUser(response.newUser);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  };

  useEffect(() => {
    const decodedToken = decodeURIComponent(params.token);
    validateToken(decodedToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  useEffect(() => {
    if (isValid === false) {
      addToast("Token inválido", "error");
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, router]);

  if (isValid === null) {
    return <div>Loading...</div>;
  } else if (!newUser) {
    return <div></div>;
  }

  return <Form email={params.email} tenantId={params.tenantId}></Form>;
};

export default Page;

const Form = ({ email, tenantId }: { email: string; tenantId: string }) => {
  const [showPassword, setShowPassword] = useState<{
    [key: string]: { show: boolean };
  }>({
    password: { show: false },
    confirmPassword: { show: false },
  });
  const router = useRouter();
  const [organization, setOrganization] = useState<any>(null);
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompleteRegistrationFormValues>({
    resolver: zodResolver(completeRegistrationSchema),
  });

  const onSubmit = async (data: CompleteRegistrationFormValues) => {
    try {
      await services.authService.completeRegistration(data, { tenantId });
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error completing registration:", error);
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: { show: !prev[field].show },
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-fit shadow-xl">
        <div className="card-body">
          <h1 className="card-title flex flex-row justify-center w-full">
            Completar Registro
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Nome</span>
              </label>
              <input
                type="text"
                placeholder="Digite seu nome"
                className="input input-bordered w-full"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                placeholder="Digite seu email"
                className="input input-bordered w-full"
                {...register("email")}
                readOnly
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
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
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Confirmar Senha</span>
              </label>
              <div className="input input-bordered flex items-center gap-2">
                <input
                  type={showPassword.confirmPassword.show ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  className="grow"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => {
                    togglePasswordVisibility("confirmPassword");
                  }}
                >
                  {showPassword.confirmPassword.show ? (
                    <BsEyeSlash className="h-6 w-6 text-gray-400" />
                  ) : (
                    <BsEye className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <h2 className="text-lg font-semibold mb-4">Location Details</h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Country</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your country"
                  className="input input-bordered w-full"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">State</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your state"
                  className="input input-bordered w-full"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  className="input input-bordered w-full"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Timezone</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) =>
                  setValue("timezone", parseTimezone(e.currentTarget.value))
                }
              >
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.timezone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.timezone.message}
                </p>
              )}
            </div>
            <div className="form-control mt-4">
              <button className="btn btn-success text-white" type="submit">
                Completar Cadastro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
