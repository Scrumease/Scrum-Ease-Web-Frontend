"use client";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({ theme: "light", changeTheme: (theme: string) => {} })

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
  }, []);

  if (!isMounted) return <>Carregando...</>;

  const changeTheme = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
