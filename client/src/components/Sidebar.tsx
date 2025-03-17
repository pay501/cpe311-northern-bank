import React from "react";
import { Link } from "react-router-dom";
import { User } from "../utils/types";

type SidebarProps = {
  userData: User | null;
};

const Sidebar: React.FC<SidebarProps> = ({ userData }) => {
  return (
    <aside className="w-64 bg-green-600 text-white h-full">
      <div className="p-4 text-center border-b border-green-600">
        <h1 className="text-xl font-bold">NORTHERN BANK</h1>
      </div>
      <div className="p-4 text-center">
        <div className="h-20 w-20 mx-auto rounded-full bg-gray-400"></div>
        <h2 className="mt-4 text-lg">{userData?.first_name} {userData?.last_name}</h2>
        <p className="text-sm">บัญชีธุรกิจ</p>
      </div>
      <nav>
        <ul className="overflow-y-auto">
          <li className="px-4 py-2 hover:bg-green-700">
            <Link to="/">โฮม</Link>
          </li>
          <li className="px-4 py-2 hover:bg-green-700">
            <Link to="/loan">สินเชื่อ</Link>
          </li>
          <li className="px-4 py-2 hover:bg-green-700">
            <Link to="/transfer">โอนเงิน</Link>
          </li>
          <li className="px-4 py-2 hover:bg-green-700">
            <Link to="/history">ประวัติรายการ</Link>
          </li>
          <li className="px-4 py-2 hover:bg-green-700">
            <Link to="/settings">ตั้งค่าบัญชี</Link>
          </li>
          <li className="px-4 py-2 hover:bg-green-700">
            <Link to="/help">ช่วยเหลือ</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
