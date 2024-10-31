"use client";
import { PermissionsEnum } from "@/app/enums/permissions.enum";
import useAuth from "@/app/hooks/useAuth";
import { DecodedToken } from "@/app/utils/token";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";
import { FaHome, FaUserAlt } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { GoArchive } from "react-icons/go";
import { GrUserWorker } from "react-icons/gr";

const SidebarItems = ({
  decodedToken = null,
}: { decodedToken?: DecodedToken | null } = {}) => {
  const routers = CreateRouter({
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: FaHome,
      },
      {
        label: "Usuários",
        href: "/users",
        permission: PermissionsEnum.LIST_USERS,
        icon: FaUserAlt,
      },
      {
        label: "Cargos",
        href: "/roles",
        permission: PermissionsEnum.VIEW_ROLE,
        icon: GrUserWorker,
      },
      {
        label: "Projetos",
        permission: PermissionsEnum.VIEW_PROJECT,
        href: "/projects",
        icon: GoArchive,
      },
      {
        label: "Dailys",
        href: "/dailys",
        icon: FaCalendarCheck,
      },
    ],
  });
  return (
    <ul className="menu min-h-full p-4 w-80 bg-base-100 text-base-content">
      {routers.map((router, index) => (
        <div key={index}>{router}</div>
      ))}
    </ul>
  );
};

interface CreateRouterProps {
  label: string;
  href: string;
  permission?: string;
  icon?: IconType;
  nested?: {
    items: CreateRouterProps[];
  };
}

const CreateRouter = ({
  items,
}: {
  items: CreateRouterProps[];
}): JSX.Element[] => {
  return items.map((item, index) => {
    return <CreateItem key={index} item={item} />;
  });
};

const CreateItem = ({ item }: { item: CreateRouterProps }): JSX.Element => {
  const { hasPermission } = useAuth(item.permission ? [item.permission] : []);
  if (item.permission && !hasPermission) return <></>;

  if (item.nested) {
    const items = CreateRouter({ items: item.nested.items });
    if (items.every((e) => e.type == React.Fragment)) return <></>;
    else {
      return (
        <div className="collapse collapse-arrow border-none bg-base-200 border">
          <input type="checkbox" />
          <div className="collapse-title text-md font-medium">{item.label}</div>
          <div className="collapse-content">
            {items.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      );
    }
  }
  return (
    <li className="mb-2">
      <Link href={item.href} className="justify-between font-medium">
        <div className="font-medium">{item.label}</div>
        {item.icon && <item.icon />}
      </Link>
    </li>
  );
};

export default SidebarItems;
