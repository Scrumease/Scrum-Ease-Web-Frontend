"use client";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

const AccessDeniedPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card bg-base-100 shadow-xl p-8">
        <div className="card-body text-center">
          <h1 className="text-4xl font-bold text-error mb-4">Acesso Negado</h1>
          <p className="text-lg mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            className="btn btn-primary gap-2"
            onClick={() => router.push("/")}
          >
            <FaHome className="text-lg" />
            Voltar para a Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
