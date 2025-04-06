import React, { useState } from "react";
import { Account, User } from "../utils/types";
import { useOutletContext } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";

type HomeProps = {
  userData: User | null;
  accounts: Account[];
  jwtToken: string;
};

const Transfer: React.FC = () => {
  const { userData, accounts, jwtToken } = useOutletContext<HomeProps>();
  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("KBANK");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [transferType, setTransferType] = useState("ทันที (ตลอด 24 ชั่วโมง)");
  const [note, setNote] = useState("");

  const Transfer = async () => {
    if (!userData || accounts.length === 0) {
      console.log("Accounts data is missing!");
      return;
    }

    const payload = {
      from_user_id: userData?.user_id,
      from_user_acc_no: accounts[0]?.acc_no,
      from_user_bank_code: accounts[0]?.bank_code,
      to_user_acc_no: toAccountNumber,
      to_user_bank_code: bankCode,
      amount: parseFloat(amount),
    };
  
    try {
      const response = await axios.post("http://localhost:8080/transfer", payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
  
      console.log("Transfer Success:", response.data);
    } catch (error) {
      console.error("Transfer Error:", error);
    }
  };
  

  return (
    <div className="flex min-h-screen">
      {accounts.length === 0 ? (
        <p className="text-2xl font-bold">Loading...</p>
      ) : (
        <div className="bg-white p-6 m-6 rounded-lg shadow-lg w-4/6 flex">
          {/* Left Side */}
          <div className="w-2/3 pr-6">
            <h2 className="text-2xl font-bold mb-4">โอนเงิน</h2>
            <div className="border p-4 rounded-lg mb-4">
              <label className="block font-medium mb-1">จาก :</label>
              <div className="flex items-center justify-between border p-3 rounded-md">
                {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Kasikorn_Bank.svg/1200px-Kasikorn_Bank.svg.png" 
                alt="bank-logo" className="w-8 h-8 mr-2" /> */}
                <span>
                  Mr.{userData?.first_name + " " + userData?.last_name}
                </span>
                <div className="text-right">
                  ยอดเงินที่ใช้ได้:{" "}
                  <CountUp
                    end={accounts[0].balance}
                    duration={0}
                    separator=","
                    decimal="."
                    decimals={2}
                  />{" "}
                  บาท
                </div>
              </div>
            </div>

            {/* Recipient Bank */}
            <div className="mb-3">
              <label className="block font-medium mb-1">ไปยังบัญชีธนาคาร</label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="KBANK">
                  ธนาคารกสิกรไทย
                </option>
                <option value="KTB">
                  ธนาคารกรุงไทย
                </option>
                <option value="SCB">
                  ธนาคารไทยพาณิชย์
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">เลขบัญชี</label>
              <input
                type="text"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="XXX-X-XXXXX-X"
              />
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">จำนวนเงิน (บาท)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="0.00"
              />
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">ประเภทการโอน</label>
              <select
                value={transferType}
                onChange={(e) => setTransferType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="ทันที (ตลอด 24 ชั่วโมง)">
                  ทันที (ตลอด 24 ชั่วโมง)
                </option>
                <option value="โอนล่วงหน้า">โอนล่วงหน้า</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">บันทึกช่วยจำ</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="อื่นๆ"
              />
            </div>

            <div className="flex justify-between">
              <button className="bg-gray-600 text-white py-2 px-6 rounded-md">
                ล้างข้อมูล
              </button>
              <button
                className="bg-green-500 text-white py-2 px-6 rounded-md"
                onClick={Transfer}
              >
                ต่อไป
              </button>
            </div>
          </div>

          {/* Right Side - Steps */}
          <div className="w-1/3 border-l pl-6">
            <div className="text-green-600 font-bold">1 ทำรายการ</div>
            <div className="text-gray-400">2 ยืนยันการทำรายการ</div>
            <div className="text-gray-400">3 ขั้นตอนสำเร็จ</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;
