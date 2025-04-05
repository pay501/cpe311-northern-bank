import React from "react";
import { User } from "../utils/types";

type HeaderProps = {
  userData: User | null;
};

const Header: React.FC<HeaderProps> = ({ userData }) => {
  return (
    <header className="bg-white p-4 shadow-md flex justify-between items-center">
      {
        userData?.role === "user" ? (
          <h2 className="text-lg font-semibold">บัญชีธุรกิจ</h2>
        ) : (
          <h2 className="text-lg font-semibold">แอดมิน</h2>
        )
      }
      <div className="flex items-center space-x-4">
        <span>{userData?.first_name} {userData?.last_name}</span>
        <button className="text-green-900">ไทย / English</button>
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;
