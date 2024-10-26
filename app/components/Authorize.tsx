import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

const Authorize = ({
  children,
  props,
}: {
  children: React.ReactNode;
  props: { permission?: string };
}): JSX.Element => {
  const router = useRouter();
  const { authenticated, hasPermission } = useAuth(
    props.permission ? [props.permission] : undefined
  );
  if (!authenticated) {
    router.push("/auth/login");
    return <p>Você não está autenticado. Por favor, faça login.</p>;
  }

  if (!hasPermission) {
    router.push("/access-denied");
    return <p>Você não tem permissão para acessar este conteúdo.</p>;
  }

  return <div>{children}</div>;
};

export default Authorize;
