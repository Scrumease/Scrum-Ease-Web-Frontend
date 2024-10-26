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
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().min(1, { message: "State is required" }),
    city: z.string().min(1, { message: "City is required" }),
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
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

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
      addToast("Registration successful", "success");
      router.push("/auth/login");
    } catch (error: any) {
      addToast("Error registering: " + error.response.data.message, "error");
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-fit shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title flex flex-row justify-center w-full">
            Tenant Registration
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-semibold mb-4">Tenant Details</h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Tenant Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the tenant name"
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
                  placeholder="Enter the tenant's owner CPF/CNPJ"
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
              Administrator Details
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text">Admin Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the admin's name"
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
                  <span className="label-text">Admin Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter the admin's email"
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
                  <span className="label-text">Password</span>
                </label>
                <div className="input input-bordered flex items-center gap-2">
                  <input
                    type={showPassword.password.show ? "text" : "password"}
                    placeholder="Enter your password"
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
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="input input-bordered flex items-center gap-2">
                  <input
                    type={
                      showPassword.confirmPassword.show ? "text" : "password"
                    }
                    placeholder="Enter your password"
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
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
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
                Register
              </button>
            </div>
            <div className="flex justify-end w-full mt-2">
              <Link
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href={"/auth/login"}
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
