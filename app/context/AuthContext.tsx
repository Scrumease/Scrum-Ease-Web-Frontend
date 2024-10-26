import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfoFromToken } from "../utils/token";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }:{children: React.ReactNode }): React.JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    const userInfo = getUserInfoFromToken();

    if (!userInfo) {
      router.push("/auth/login");
      return;
    }
  }, []);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
