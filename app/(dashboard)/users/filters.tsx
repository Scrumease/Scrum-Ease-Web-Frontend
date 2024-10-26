import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const filterSchema = z.object({
  search: z
    .string()
    .max(50, "Busca pode ter no máximo 50 caracteres"),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const Filters = ({
  onSubmit,
}: {
  onSubmit: (data: FilterFormValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
  });

  return (
    <div className="mx-2 w-full">
      <h3 className="text-lg mb-4 w-full">Usuários</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-control flex flex-row gap-4 w-full"
      >
        <div className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Buscar..."
            className="input input-bordered w-full"
            {...register("search")}
          />
          {errors.search && (
            <span className="text-red-500">{errors.search.message}</span>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>
    </div>
  );
};

export default Filters;
