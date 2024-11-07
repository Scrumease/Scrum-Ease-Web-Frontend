"use client";
import { HiMenu } from "react-icons/hi";
import ThemeController from "./ThemeController";
import UserIcon from "./UserIcon";
import NavbarItems from "./navbar/NavbarItems";
import { getUserInfoFromToken } from "../utils/token";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const userInfo = getUserInfoFromToken();
  const { theme } = useContext(ThemeContext);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <HiMenu />
        </label>
      </div>
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost normal-case text-xl">
          {theme === "light" ? (
            <Image
              src="/logo/logo-gray-no-background.svg"
              width={120}
              height={50}
              alt="ScrumEase"
            />
          ) : (
            <Image
              src="/logo/logo-colored-no-background.svg"
              width={120}
              height={50}
              alt="ScrumEase"
            />
          )}
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ThemeController />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button">
            <UserIcon decodedToken={userInfo} />
          </div>
          <NavbarItems decodedToken={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
