import React from "react";
import { User } from "../utils/types";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  userData: User | null;
};

const Header: React.FC<HeaderProps> = ({ userData }) => {
  
  const navigate = useNavigate()
  
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
        <button 
          className="bg-red-500 opacity-80 px-2 py-1 rounded-lg text-white font-mono
           hover:bg-red-500 hover:opacity-100"
          onClick={()=>{
            sessionStorage.removeItem("jwtToken");
            navigate("/authen")
          }}
        >
          logout
        </button>
      </div>
    </header>
  );
};

export default Header;
