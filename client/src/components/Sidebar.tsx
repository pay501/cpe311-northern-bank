import React from "react";
import { Link } from "react-router-dom";
import { User } from "../utils/types";
import logo from "../assets/northern bank logo.png";

type SidebarProps = {
  userData: User | null;
};

const adminSideBarLink = [
  {
    name: "สินเชื่อรออนุมัติ",
    path: "/loan-history",
  },
  {
    name: "ลงทะเบียน",
    path: "/create-user",
  },
];

const sideBarLink = [
  {
    name: "หน้าหลัก",
    path: "/",
  },
  {
    name: "สินเชื่อ",
    path: "/loan",
  },
  {
    name: "โอนเงิน",
    path: "/fundtransfer",
  },
  {
    name: "ประวัติรายการ",
    path: "/transfer-history",
  },
  {
    name: "ตั้งค่าบัญชี",
    path: "/settings",
  },
  {
    name: "ช่วยเหลือ",
    path: "/help",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ userData }) => {
  const pathName = window.location.pathname;

  return (
    <aside className="bg-green-600 text-white h-full">
      <div className="p-4 text-center border-b border-green-600">
        <h1 className="text-2xl font-bold pt-4">NORTHERN BANK</h1>
      </div>
      <div className="p-4 text-center">
        <img
          src={logo}
          alt=""
          width={96}
          height={96}
          className="rounded-full mx-auto"
        />
        <h2 className="mt-4 text-lg">
          {userData?.first_name} {userData?.last_name}
        </h2>
        {userData?.role === "user" && <p className="text-sm">บัญชีธุรกิจ</p>}
      </div>
      {userData?.role === "user" ? (
        sideBarLink.map((val: any, index: number) => {
          return (
            <Link
              to={val.path}
              className={
                pathName === val.path
                  ? `flex bg-green-700 pl-2 py-2 text-lg font-semibold`
                  : `flex bg-green-600 pl-2 py-2 text-lg font-semibold hover:bg-green-700 transition-colors duration-500 ease-in-out`
              }
              key={index}
            >
              {val.name}
            </Link>
          );
        })
      ) : (
        <div>
          {adminSideBarLink.map((val: any, index: number) => {
            return (
              <Link
                to={val.path}
                className={
                  pathName === val.path
                    ? `flex bg-green-700 pl-2 py-2 text-lg font-semibold`
                    : `flex bg-green-600 pl-2 py-2 text-lg font-semibold hover:bg-green-700 transition-colors duration-500 ease-in-out`
                }
                key={index}
              >
                {val.name}
              </Link>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
