import { useToast } from "@/app/context/ToastContext";
import useAuth from "@/app/hooks/useAuth";
import { services } from "@/app/services/services";
import { DecodedToken } from "@/app/utils/token";
import { useRouter } from "next/navigation";
import { FaCog, FaCopy, FaEnvelope } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import InviteModal from "../modais/invite";
import { useState } from "react";
import Link from "next/link";
import { PermissionsEnum } from "@/app/enums/permissions.enum";

const NavbarItems = ({
  decodedToken = null,
}: { decodedToken?: DecodedToken | null } = {}) => {
  // TODO: mudar --> so mostrar se a conta for do dono da organização
  const { hasPermission } = useAuth([PermissionsEnum.INTEGRATE_ORGANIZATION]);
  const addtoast = useToast();

  const copyToClipboard = () => {
    if (decodedToken?.currentTenant.tenantId) {
      navigator.clipboard.writeText(decodedToken.currentTenant.tenantId);
      addtoast(
        "ID da organização copiado para a área de transferência!",
        "success"
      );
    }
  };

  return (
    <div
      className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      tabIndex={0}
    >
      {hasPermission && (
        <span className="p-3 flex flex-row text-xs text-gray-400">
          <button
            onClick={copyToClipboard}
            className="flex items-center w-full justify-between space-x-2"
          >
            <span>Copiar ID da Organização</span>
            <FaCopy />
          </button>
        </span>
      )}
      <ul>
        <ProfileButton />
        <SettingsButton />
        <InviteButton />
        <LogoutButton />
      </ul>
    </div>
  );
};

const LogoutButton = () => {
  const router = useRouter();
  const addToast = useToast();
  const logout = async () => {
    try {
      await services.authService.logout();
      router.push("/auth/login");
    } catch (error: any) {
      addToast(
        "Erro ao realizar login: " + error.response.data.message,
        "error"
      );
    }
  };
  return (
    <li>
      <a onClick={logout} className="justify-between">
        Sair
        <IoMdExit />
      </a>
    </li>
  );
};

const SettingsButton = () => {
  const { hasPermission } = useAuth([PermissionsEnum.VIEW_CONFIGS]);
  if (!hasPermission) return <></>;
  return (
    <li>
      <Link className="justify-between" href={"/configs"}>
        Configurações
        <FaCog />
      </Link>
    </li>
  );
};

const ProfileButton = () => {
  return (
    <li>
      <Link className="justify-between" href={"/profile"}>
        Perfil
        <IoPerson />
      </Link>
    </li>
  );
};

const InviteButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasPermission } = useAuth(["INVITE_USERS"]);
  if (!hasPermission) return <></>;
  return (
    <li>
      <a className="justify-between" onClick={() => setIsModalOpen(true)}>
        Convidar
        <FaEnvelope />
        <InviteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </a>
    </li>
  );
};

export default NavbarItems;
