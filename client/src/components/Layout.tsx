import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Outlet } from "react-router-dom";
import { Account, User } from "../utils/types";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [userData, setUserData] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [jwtToken, setJwtToken] = useState<string>("")

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtToken");

    if (!jwtToken) {
      navigate("/authen");
      return;
    }
    setJwtToken(jwtToken)

    try {
      const decodedToken: any = jwtDecode(jwtToken);
      const userId = decodedToken.user_id;

      fetchUserData(userId, jwtToken);
      fetchBankInformation(userId, jwtToken);
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("jwtToken");
      navigate("/authen");
    }
  }, [navigate, currentPath]);

  const fetchUserData = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.user);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const fetchBankInformation = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/bank-information/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data.accounts);
    } catch (error) {
      console.log("Error fetching bank information:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Fixed with Full Height */}
      <aside className="w-[15%] fixed h-screen">
        <Sidebar userData={userData}/>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        
        <header className="fixed w-[85%] ml-[290px] ">
          <Header userData={userData} />
        </header>

        <main className="overflow-auto mt-16 ml-[290px] min-h-screen bg-gray-100">
          {/* Pass props to child components */}
          <Outlet context={{ userData, accounts, jwtToken, fetchUserData, fetchBankInformation }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
