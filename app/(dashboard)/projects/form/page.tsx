"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import { services } from "@/app/services/services";
import { User } from "@/app/interfaces/user/user.interface";
import { FaTimes, FaCheck } from "react-icons/fa";
import Select from "react-select";
import Authorize from "@/app/components/Authorize";
import { PermissionsEnum } from "@/app/enums/permissions.enum";
import { selectStyle } from "@/app/components/ui/select.style";

const projectSchema = z.object({
  name: z.string().min(1, "O nome do projeto é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  users: z.array(z.string()),
});
type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectFormPage = ({ params }: { params: { id: string } }) => {
  const props = {
    permission: PermissionsEnum.CREATE_PROJECT,
  };
  return (
    <>
      <Authorize props={props}>
        <Form params={params} />
      </Authorize>
    </>
  );
};

const Form = ({ params }: { params: { id: string } }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    ...form
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const addToast = useToast();

  const loadProjectData = async (projectId: string) => {
    setIsLoading(true);
    try {
      const project = await services.projectService.getProjectById(projectId);
      reset({
        name: project.name,
        description: project.description,
        users: project.users as string[],
      });
      setIsEditing(true);
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      addToast("Erro ao carregar projeto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await services.userService.getAll({
          page: 1,
          limit: -1,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
        addToast("Erro ao buscar membros", "error");
      }
    };

    fetchUsers();
    if (params.id) loadProjectData(params.id);
  }, [params.id]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);
    try {
      await services.projectService.create(data);
      addToast("Projeto criado com sucesso!", "success");
      router.push("/projects");
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      addToast("Erro ao salvar projeto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const setUsersForm = (
    selectedOptions: { label: string; value: string }[]
  ) => {
    setValue(
      "users",
      selectedOptions.map((option) => option.value)
    );
    form.trigger("users");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title">
            {isEditing ? "Editar Projeto" : "Criar Projeto"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nome do Projeto</span>
              </label>
              <input
                type="text"
                {...register("name")}
                className="input input-bordered"
                placeholder="Nome do projeto"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Descrição do Projeto</span>
              </label>
              <textarea
                {...register("description")}
                className="textarea textarea-bordered"
                placeholder="Descrição do projeto"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Membros do Projeto</span>
              </label>
              <Select
                isMulti
                styles={selectStyle}
                name="users"
                options={users.map((user) => ({
                  value: user._id,
                  label: `${user.name} (${user.email})`,
                }))}
                value={users
                  .filter((user) => form.getValues("users")?.includes(user._id))
                  .map((user) => ({
                    value: user._id,
                    label: `${user.name} (${user.email})`,
                  }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) =>
                  setUsersForm(e as { label: string; value: string }[])
                }
              />
              {errors.users && (
                <span className="text-red-500 text-sm">
                  {errors.users.message}
                </span>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="btn btn-outline btn-error"
                onClick={() => router.push("/projects")}
              >
                <FaTimes className="mr-2" /> Cancelar
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              >
                {isEditing ? "Salvar Alterações" : "Criar Projeto"}
                {!isLoading && <FaCheck className="ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormPage;
