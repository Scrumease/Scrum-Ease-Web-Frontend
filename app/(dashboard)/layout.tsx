"use client";
import React from "react";
import Navbar from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { AuthProvider } from "../context/AuthContext";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="drawer drawer-mobile min-h-full">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col p-4 bg-base-200 min-h-screen">
            {children}
          </div>
          <Sidebar />
        </div>
      </div>
    </AuthProvider>
  );
};

export default layout;
