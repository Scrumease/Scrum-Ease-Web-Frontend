"use client";
import { HiMenu } from "react-icons/hi";
import ThemeController from "./ThemeController";
import UserIcon from "./UserIcon";
import NavbarItems from "./navbar/NavbarItems";
import { getUserInfoFromToken } from "../utils/token";
import Link from "next/link";

const Navbar = () => {
  const userInfo = getUserInfoFromToken();

  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <HiMenu />
        </label>
      </div>
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost normal-case text-xl">Dashboard</Link>
      </div>
      <div className="flex-none gap-2">
        <ThemeController />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button">
            <UserIcon decodedToken={userInfo}/>
          </div>
          <NavbarItems decodedToken={userInfo}/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;


