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
  const { userData, accounts, jwtToken } = useOutletContext<TransactionProps>();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [filtered, setFiltered] = useState<TransactionType[]>([]);

  const [searchAcc, setSearchAcc] = useState("");
  const [bankFilter, setBankFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [typeFilter, setTypeFilter] = useState("ทั้งหมด");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (userData && jwtToken) {
      fetchTransactionHistory(userData.user_id, jwtToken);
    }
  }, [userData, jwtToken]);

  const fetchTransactionHistory = async (userId: number, jwtToken: string) => {
    try {
      const response = await axios.get("http://localhost:8080/transactions", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setTransactions(response.data.result);
      setFiltered(response.data.result);
    } catch (error: any) {
      console.error("Error fetching transaction history:", error.response?.data || error.message);
    }
  };

  const filterTransactions = () => {
    let result = [...transactions];

    if (searchAcc.trim() !== "") {
      result = result.filter((t) => t.to_user_acc_no.includes(searchAcc));
    }

    if (bankFilter !== "ทั้งหมด") {
      result = result.filter((t) => t.to_user_bank_code === bankFilter);
    }

    if (statusFilter !== "ทั้งหมด") {
      result = result.filter((t) => statusFilter === "สำเร็จ"); // สมมุติว่าใช้แค่ "สำเร็จ"
    }

    if (typeFilter !== "ทั้งหมด") {
      result = result.filter(() => typeFilter === "โอนเงินบัญชีอื่น"); // สมมุติว่า type เดียว
    }

    if (startDate) {
      result = result.filter((t) => new Date(t.created_at) >= new Date(startDate));
    }

    if (endDate) {
      result = result.filter((t) => new Date(t.created_at) <= new Date(endDate));
    }

    setFiltered(result);
    setCurrentPage(1); // reset page
  };

  const resetFilters = () => {
    setSearchAcc("");
    setBankFilter("ทั้งหมด");
    setStatusFilter("ทั้งหมด");
    setTypeFilter("ทั้งหมด");
    setStartDate("");
    setEndDate("");
    setFiltered(transactions);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-2xl font-bold mb-4">ประวัติทำรายการ</h1>

      {/* Filter Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow mb-6">
        <div>
          <label className="text-sm">วันที่ทำรายการ</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-sm">จนถึงวันที่</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-sm">ค้นหาบัญชีปลายทาง</label>
          <input type="text" value={searchAcc} onChange={(e) => setSearchAcc(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="text-sm">เลือกธนาคาร</label>
          <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)} className="w-full border rounded px-2 py-1">
            <option>ทั้งหมด</option>
            <option value="KBANK">กสิกรไทย</option>
            <option value="SCB">ไทยพาณิชย์</option>
            <option value="KTB">กรุงไทย</option>
          </select>
        </div>
        <div>
          <label className="text-sm">สถานะรายการ</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border rounded px-2 py-1">
            <option>ทั้งหมด</option>
            <option>สำเร็จ</option>
          </select>
        </div>
        <div>
          <label className="text-sm">ประเภทรายการ</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full border rounded px-2 py-1">
            <option>ทั้งหมด</option>
            <option>โอนเงินบัญชีอื่น</option>
          </select>
        </div>
        <div className="col-span-2 flex gap-4 mt-auto">
          <button onClick={filterTransactions} className="bg-gray-700 text-white px-4 py-2 rounded">
            🔍 ค้นหา
          </button>
          <button onClick={resetFilters} className="bg-white border px-4 py-2 rounded text-gray-700">
            🗑️ ล้างข้อมูล
          </button>
        </div>
      </div>

      {/* Table Section */}
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
            {currentTransactions.map((val, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 whitespace-nowrap">
                  {val.created_at.split("T")[0]}
                  <br />
                  <span className="text-xs text-gray-500">{val.created_at.split("T")[1].split(".")[0]}</span>
                </td>
                <td className="px-4 py-2">{val.created_at.split("T")[0]}</td>
                <td className="px-4 py-2">โอนเงินบัญชีอื่น</td>
                <td className="px-4 py-2">{val.from_user_acc_no} {val.from_user_bank_code}</td>
                <td className="px-4 py-2">{val.to_user_acc_no} {val.to_user_bank_code}</td>
                <td className="px-4 py-2 text-right">
                  {val.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-2 text-green-600 font-bold">สำเร็จ</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <p className="text-sm">
            รายการที่ {indexOfFirst + 1} - {Math.min(indexOfLast, filtered.length)} จาก {filtered.length} รายการ
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded border disabled:opacity-30"
            >
              ◀
            </button>
            <span className="px-3 py-1">{currentPage}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded border disabled:opacity-30"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
