import React from "react";
import { DecodedToken, getUserInfoFromToken } from "../utils/token";

const UserIcon = ({
  decodedToken = null,
}: { decodedToken?: DecodedToken | null } = {}) => {
  const userInfo = decodedToken ?? getUserInfoFromToken();

  const getInitials = (name: string): string => {
    const words = name.split(" ");
    return words
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  const initials = getInitials(userInfo?.name ?? "Unknown");

  return (
    <>
      <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          <span className="text-xl">{initials}</span>
        </div>
      </div>
    </>
  );
};

export default UserIcon;
