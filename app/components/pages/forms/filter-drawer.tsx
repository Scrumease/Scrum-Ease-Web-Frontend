import { useState } from "react";
import { z } from "zod";

const filterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean(),
});

type FilterForm = z.infer<typeof filterSchema>;

const FilterDrawer = ({
  handleFormFields,
}: {
  handleFormFields: (formData: FilterForm) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FilterForm>({
    search: "",
    isActive: true,
  });

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendForm = () => {
    try {
      const validatedData = filterSchema.parse(formState);
      handleFormFields(validatedData);
      setIsOpen(false);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="w-full p-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Abrir Filtros
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-base-100 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={toggleDrawer}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
          >
            X
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium">
              Busca
            </label>
            <input
              id="search"
              name="search"
              type="text"
              value={formState.search}
              onChange={handleChange}
              className="px-4 py-2 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Digite para buscar..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="isActive" className="flex items-center space-x-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formState.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
              />
              <span className="text-sm font-medium">Projetos Ativos</span>
            </label>
          </div>

          <button onClick={sendForm} className="btn btn-primary w-full mt-4">
            Buscar
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export default FilterDrawer;
