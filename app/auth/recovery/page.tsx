"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { services } from "@/app/services/services";
import { useToast } from "@/app/context/ToastContext";
import Link from "next/link";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useRouter } from "next/navigation";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Insira um email válido" }),
});

type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
  const router = useRouter();
  const addToast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordSchema) => {
    try {
      await services.authService.forgotPassword(data);
      addToast("Um email foi enviado para você", "success");
      router.push("/");
    } catch (error: any) {
      addToast(
        "Erro: " + (error.response?.data?.message ?? "Erro desconhecido"),
        "error"
      );
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title">Recuperar Senha</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Entre com seu email"
                className="input input-bordered"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex justify-end w-full">
              <Link
                className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                href={"/auth/login"}
              >
                Voltar para o login{" "}
              </Link>
            </div>
            <div className="form-control mt-6">
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

export default ForgetPassword;
