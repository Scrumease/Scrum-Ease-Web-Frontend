import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfoFromToken } from "../utils/token";

const useAuth = (requiredPermissions: string[] = []) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);

  const checkPermissions = useCallback(() => {
    const userInfo = getUserInfoFromToken();
    if (!userInfo) {
      setAuthenticated(false);
      setHasPermission(false);
      router.push("/auth/login");
      return;
    }

    const { role } = userInfo.currentTenant;

    const hasPermission = () => {
      if (requiredPermissions.length === 0) return true;
      if (!role || !role.permissions) return false;
      return role.permissions.some((permission) =>
        requiredPermissions.includes(permission)
      );
    };

    const authenticated = () => {
      return !!userInfo.exp && userInfo.exp >= Date.now() / 1000;
    };
    setAuthenticated(authenticated());
    setHasPermission(hasPermission());
  }, [router, requiredPermissions]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return { authenticated, hasPermission };
};

export default useAuth;
