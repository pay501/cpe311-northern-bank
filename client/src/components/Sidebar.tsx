import React from "react";
import { Link } from "react-router-dom";
import { User } from "../utils/types";
import logo from "../assets/northern bank logo.png";
import transferIcon from "../assets/transfer-horizontal-svgrepo-com.svg";
import loanIcon from "../assets/loan-interest-time-value-of-money-effective-svgrepo-com.svg"
import helpIcon from "../assets/help-circle-svgrepo-com.svg"
import transactionIcon from "../assets/account-check-person-profile-user-group-svgrepo-com.svg"
import settingIcon from "../assets/setting-svgrepo-com.svg"
import homeIcon from "../assets/account-balance-cash-svgrepo-com.svg"

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
    icon: homeIcon
  },
  {
    name: "สินเชื่อ",
    path: "/loan",
    icon: loanIcon
  },
  {
    name: "โอนเงิน",
    path: "/fundtransfer",
    icon: transferIcon,
  },
  {
    name: "ประวัติรายการ",
    path: "/transfer-history",
    icon: transactionIcon,
  },
  {
    name: "ตั้งค่าบัญชี",
    path: "/settings",
    icon: settingIcon,
  },
  {
    name: "ช่วยเหลือ",
    path: "/help",
    icon: helpIcon,
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
                  ? `flex bg-green-700 pl-2 py-2 text-lg font-semibold border-l-[6px] border-white`
                  : `flex bg-green-600 pl-2 py-2 text-lg font-semibold hover:bg-green-700 transition-colors duration-500 border-l-[6px] border-green-600  ease-in-out hover:border-l-[6px] hover:border-white`
              }
              key={index}
            >
              <img
                src={val.icon}
                alt={val.name}
                width={28}
                height={28}
                className=" border-2 rounded-full"
              />

              <p className="ml-2">
                {val.name}
              </p>
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
                    ? `flex items-center gap-2 bg-green-700 px-4 py-2 text-lg font-semibold border-l-4 border-white`
                    : `flex items-center gap-2 bg-green-600 px-4 py-2 text-lg font-semibold hover:bg-green-700 transition-colors duration-300`
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
