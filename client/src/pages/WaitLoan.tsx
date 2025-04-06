import axios from "axios";
import { useEffect, useState } from "react";
import { LoanReqHistories } from "../utils/types";
import React from "react";

const WaitLoan = () => {
  const [loanReqHistories, setLoanReqHistories] = useState<LoanReqHistories[]>(
    []
  );
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  const fetchLoanReqHistories = async () => {
    const response = await axios.get(
      `http://localhost:8080/loan-request-histories`
    );
    setLoanReqHistories(response.data.result);
  };

  useEffect(() => {
    fetchLoanReqHistories();
  }, []);

  const updateResult = async (id: number, newResult: number) => {
    try {
      const response = await axios.patch(`http://localhost:8080/loan-request-histories/${id}`, {
        result: newResult,
      });
      console.log(response.data)
      // อัปเดต UI โดยไม่ต้อง fetch ใหม่ทั้งก้อน
      setLoanReqHistories((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, result: newResult } : item
        )
      );
    } catch (err) {
      console.error("Error updating result:", err);
      alert("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  return (
    <div>
      {loanReqHistories.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white font-sans">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-green-600 text-white text-left">
              <tr>
                <th className="px-4 py-3">Loan Request ID</th>
                <th className="px-4 py-3">Status (Prediction)</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Applicant Income</th>
                <th className="px-4 py-3">Coapplicant Income</th>
                <th className="px-4 py-3">Loan Amount</th>
                <th className="px-4 py-3">Loan Amount Term</th>
              </tr>
            </thead>
            <tbody>
              {loanReqHistories.map((val, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="border-t"
                    onMouseEnter={() => setHoveredRowId(val.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
                    <td className="px-4 py-2 whitespace-nowrap underline">
                      {val.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.status}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.result == null ? "Waiting" : 
                      (<p>
                        {val.result == 1 ? "Accepted":"Rejected"}
                      </p>)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.applicant_income}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.coapplicant_income}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.loan_amount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {val.loan_amount_term}
                    </td>
                  </tr>

                  {hoveredRowId === val.id && (
                    <tr
                      className="bg-gray-50 text-sm text-gray-600"
                      onMouseEnter={() => setHoveredRowId(val.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <td colSpan={7} className="px-4 py-3">
                        📌 <strong>รายละเอียดเพิ่มเติมของ ID ที่ {val.id}:</strong>
                        <br />
                        Gender: {val.gender} <br />
                        Married: {val.married} <br />
                        Education: {val.education} <br />
                        Self Employed: {val.self_employed} <br />
                        Property Area: {val.property_area}<br />
                        Credit: {val.credit_history}
                        <br />
                        <button
                          onClick={() => updateResult(val.id, 1)}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        >
                          ✔️ อนุมัติ
                        </button>
                        <button
                          onClick={() => updateResult(val.id, 0)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          ❌ ปฏิเสธ
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WaitLoan;
