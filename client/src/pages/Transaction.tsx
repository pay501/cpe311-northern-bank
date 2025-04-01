import { useOutletContext } from "react-router-dom";
import { Account, TransactionType, User } from "../utils/types";
import axios from "axios";
import { useEffect, useState } from "react";

type TransactionProps = {
  userData: User | null;
  accounts: Account[];
  jwtToken: string;
};
const Transaction = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const { userData, accounts, jwtToken } = useOutletContext<TransactionProps>();

  useEffect(() => {
    if (userData && jwtToken) {
      fetchTransactionHistory(userData.user_id, jwtToken);
    }
  }, [userData, jwtToken]);

  const fetchTransactionHistory = async (userId: number, jwtToken: string) => {
    try {
      if (!jwtToken || typeof jwtToken !== "string") {
        throw new Error("Invalid token");
      }

      const response = await axios.get("http://localhost:8080/transactions", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setTransactions(response.data.result);
    } catch (error: any) {
      console.error(
        "Error fetching transaction history:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      {!userData || !jwtToken ? (
        <div>Loading</div>
      ) : (
        <div className="p-6 bg-gray-100 min-h-screen font-sans">
          <h1 className="text-2xl font-bold mb-6">ประวัติทำรายการ</h1>

          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-green-600 text-white text-left">
                <tr>
                  <th className="px-4 py-3">วันที่ทำรายการ</th>
                  <th className="px-4 py-3">วันที่เงินเข้าบัญชี</th>
                  <th className="px-4 py-3">รายการ</th>
                  <th className="px-4 py-3">จากบัญชี</th>
                  <th className="px-4 py-3">บัญชีปลายทาง / พร้อมเพย์</th>
                  <th className="px-4 py-3 text-right">จำนวนเงิน (บาท)</th>
                  <th className="px-4 py-3">สถานะรายการ</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((val: TransactionType, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.created_at}
                      <br />
                      <span className="text-xs text-gray-500">
                        {val.created_at}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.created_at}
                    </td>
                    <td className="px-4 py-2">โอนเงินบัญชีอื่น</td>
                    <td className="px-4 py-2">{val.from_user_acc_no}</td>
                    <td className="px-4 py-2 whitespace-pre-wrap">
                      {val.to_user_acc_no}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {val.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2 text-green-600 font-bold">
                      สำเร็จ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
