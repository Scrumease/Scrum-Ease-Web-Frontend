"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/app/context/ToastContext";
import Link from "next/link";
import { services } from "@/app/services/services";
import { useRouter } from "next/navigation";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { useState } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import { TIMEZONES } from "@/app/utils/timezone";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};

const registerSchema = z
  .object({
    tenantName: z.string().min(1, { message: "Tenant name is required" }),
    tenantIdentifier: z.string().min(1, { message: "CPF/CNPJ is required" }),
    adminName: z.string().min(1, { message: "Admin name is required" }),
    adminEmail: z.string().email({ message: "Invalid email address" }),
    timezone: z.object({ value: z.string(), offset: z.number().optional() }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const addToast = useToast();
  const [showPassword, setShowPassword] = useState<{
    [key: string]: { show: boolean };
  }>({
    password: { show: false },
    confirmPassword: { show: false },
  });

  const [options] = useState<{ label: string; value: number }[]>(
    TIMEZONES.map((timezone, index) => {
      return {
        label: timezone.text,
        value: index,
      };
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: { show: !prev[field].show },
    }));
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await services.authService.register({ ...data });
      addToast("Registrado com sucesso", "success");
      router.push("/auth/login");
    } catch (error: any) {
      addToast("Erro ao registrar: " + error.response.data.message, "error");
      console.error("Error registering:", error);
    }
  };

  const parseTimezone = (index: number | string) => {
    if (typeof index === "string") {
      index = parseInt(index);
    }
    const timezone = TIMEZONES[index];
    return {
      value: timezone.utc[0],
      offset: timezone.offset,
    };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-fit shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title flex flex-row justify-center w-full">
            Registrar organização
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-semibold mb-4">
              Detalhes da Organização
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Nome da Organização</span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o Nome da Organização"
                  className="input input-bordered w-full"
                  {...register("tenantName")}
                />
                {errors.tenantName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tenantName.message}
                  </p>
                )}
              </div>
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">CPF/CNPJ</span>
                </label>
                <input
                  type="text"
                  placeholder="xxx.xxx.xxx-xx"
                  className="input input-bordered w-full"
                  {...register("tenantIdentifier")}
                />
                {errors.tenantIdentifier && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tenantIdentifier.message}
                  </p>
                )}
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-4">
              Detalhes do Administrador
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Nome do Administrador</span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o Nome do Administrador"
                  className="input input-bordered w-full"
                  {...register("adminName")}
                />
                {errors.adminName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.adminName.message}
                  </p>
                )}
              </div>
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Email do Administrador</span>
                </label>
                <input
                  type="email"
                  placeholder="Digite o Email do Administrador"
                  className="input input-bordered w-full"
                  {...register("adminEmail")}
                />
                {errors.adminEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.adminEmail.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="form-control mb-4 w-full">
                <label className="label" htmlFor={"password"}>
                  <span className="label-text">Senha</span>
                </label>
                <div className="input input-bordered flex items-center gap-2">
                  <input
                    type={showPassword.password.show ? "text" : "password"}
                    placeholder="Digite sua Senha"
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
                <label className="label" htmlFor={"password"}>
                  <span className="label-text">Confirmar Senha</span>
                </label>
                <div className="input input-bordered flex items-center gap-2">
                  <input
                    type={
                      showPassword.confirmPassword.show ? "text" : "password"
                    }
                    placeholder="Confirme sua Senha"
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
            </div>
            <h2 className="text-lg font-semibold mb-4">
              Detalhes da Localização
            </h2>

            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Fuso Horário</span>
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
                Registrar
              </button>
            </div>
            <div className="flex justify-end w-full mt-2">
              <Link
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href={"/auth/login"}
              >
                Já tem uma conta? Faça o login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
