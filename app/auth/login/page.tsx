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

const loginSchema = z.object({
  email: z.string().email({ message: "Insira um email válido" }),
  password: z
    .string()
    .min(6, { message: "A Senha deve ter no mínimo 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const addToast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await services.authService.login(data);
      addToast("Login realizado com sucesso", "success");
      router.push("/");
    } catch (error: any) {
      addToast(
        "Erro ao realizar login: " +
          (error.response?.data?.message ?? "Erro desconhecido"),
        "error"
      );
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
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
            <div className="form-control mb-4">
              <label className="label" htmlFor={"password"}>
                <span className="label-text">Senha</span>
              </label>
              <div className="input input-bordered flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entre com sua senha"
                  className="grow"
                  {...register("password")}
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? (
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
            <div className="flex justify-end w-full pb-4">
              <Link
                className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                href={"/auth/recovery"}
              >
                Esqueceu a senha?{" "}
              </Link>
            </div>
            <div className="flex justify-end w-full">
              <Link
                className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                href={"/auth/register"}
              >
                Novo por aqui? Crie sua organização{" "}
              </Link>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-success text-white" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
