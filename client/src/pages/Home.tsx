import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Account, User } from "../utils/types";
import CountUp from "react-countup";
import { CurrentDateTime } from "../utils/functions";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [userData, setUserdata] = useState<User>();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtToken");

    if (!jwtToken) {
      navigate("/authen");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(jwtToken);
      const extractedUserId = decodedToken.user_id;
      setUserId(extractedUserId);
      fetchUserData(extractedUserId, jwtToken);
      fetchBankInformation(extractedUserId, jwtToken);
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("jwtToken");
      navigate("/authen");
    }
  }, [navigate]);

  const fetchBankInformation = (id: string, token: string) => {
    axios
      .get(`http://localhost:8080/bank-information/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAccountData(response.data.accounts);
        console.log(response.data.accounts);
      })
      .catch((error) =>
        console.error("Error fetching bank information:", error)
      );
  };

  const fetchUserData = async (id: number, token: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserdata(response.data.user);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white">
        <div className="p-4 text-center border-b border-green-700">
          <h1 className="text-xl font-bold">NORTHERN BANK</h1>
        </div>
        <div className="p-4 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-gray-400"></div>
          <h2 className="mt-4 text-lg">
            {userData?.first_name +" "+ userData?.last_name}
          </h2>
          <p className="text-sm">บัญชีธุรกิจ</p>
        </div>
        <nav className="">
          <ul>
            <li className="px-4 py-2 hover:bg-green-700">
              <a href="#">โฮม</a>
            </li>
            <li className="px-4 py-2 hover:bg-green-700">
              <a href="#">สินเชื่อ</a>
            </li>
            <li className="px-4 py-2 hover:bg-green-700">
              <a href="#">โอนเงิน</a>
            </li>
            <li className="px-4 py-2 hover:bg-green-700">
              <a href="#">ประวัติรายการ</a>
            </li>
            <li className="px-4 py-2 hover:bg-green-700">
              <a href="#">ตั้งค่าบัญชี</a>
            </li>
            <li className="px-4 py-2 hover:bg-green-700">
              <a href="#">ช่วยเหลือ</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white p-4 shadow-md flex justify-between items-center">
          <h2 className="text-lg font-semibold">บัญชีธุรกิจ</h2>
          <div className="flex items-center space-x-4">
            <span>{userData?.first_name +" "+ userData?.last_name}</span>
            <button className="text-green-900">ไทย / English</button>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {accountData.map((val: Account, key: number) => {
          return (
            <section className="p-8" key={key}>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">
                  บัญชีที่ {key + 1}: เลขที่บัญชี {val.accNumber}
                </h3>
                <h3 className="text-xl font-bold mb-4">
                  ยอดเงินที่ใช้ได้ทั้งหมด (บาท)
                </h3>
                <p className="text-2xl text-green-900 font-semibold">
                  <CountUp
                    end={val.balance}
                    separator=","
                    decimal="."
                    decimals={2}
                    duration={0}
                  />
                </p>
                <p className="text-sm text-gray-500">
                  ข้อมูล ณ วันที่ {CurrentDateTime()}
                </p>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-bold">Mr.{userData?.first_name +" "+ userData?.last_name}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">ยอดเงินในบัญชี</p>
                      <p className="text-xl font-bold">
                        <CountUp
                          end={val.balance}
                          separator=","
                          decimal="."
                          decimals={2}
                          duration={0}
                        />
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">
                        ยอดคงเหลือที่ใช้ได้
                      </p>
                      <p className="text-xl font-bold">
                        <CountUp
                          end={val.balance}
                          separator=","
                          decimal="."
                          decimals={2}
                          duration={0}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <a href="#" className="text-green-900 font-semibold">
                      ดูรายละเอียดบัญชีเพิ่มเติม &gt;
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default Home;
