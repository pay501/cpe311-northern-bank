import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LoanReqHistories, User } from "../utils/types";

type LoanFromProps = {
  userData: User | null;
  jwtToken: string;
};
interface LoanFormData {
  Gender: string;
  Married: string;
  Dependents: number;
  Education: string;
  Self_Employed: string;
  Property_Area: string;
  ApplicantIncome: number;
  CoapplicantIncome: number;
  LoanAmount: number;
  Loan_Amount_Term: number;
}

const Loan: React.FC = () => {
  const { userData, jwtToken } = useOutletContext<LoanFromProps>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>({
    Gender: "",
    Married: "",
    Dependents: 0,
    Education: "",
    Self_Employed: "",
    Property_Area: "",
    ApplicantIncome: 0,
    CoapplicantIncome: 0,
    LoanAmount: 0,
    Loan_Amount_Term: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loanReqHistory, setLoanReqHistory] = useState<LoanReqHistories | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (userData && jwtToken) {
      fetchLoanReqHistory();
    }
  }, [userData, jwtToken]);

  const fetchLoanReqHistory = async () => {
    if (userData && jwtToken) {
      try {
        setIsLoading(true);
        setFetchError(null);
        const response = await axios.get(
          `http://localhost:8080/loan-request-histories/${userData.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setLoanReqHistory(response.data.result);
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          const axiosErr = error as AxiosError;
          if (axiosErr.response?.status === 404) {
            setLoanReqHistory(null);
            console.log("No loan request history found.");
          } else {
            console.error("Error fetching loan history:", axiosErr);
            setFetchError(`เกิดข้อผิดพลาดในการโหลดประวัติการยื่นกู้: ${axiosErr.message}`);
          }
        } else {
          console.error("An unexpected error occurred:", error);
          setFetchError("เกิดข้อผิดพลาดที่ไม่คาดคิดในการโหลดประวัติการยื่นกู้");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const isStep1Valid = () => {
    return (
      formData.Gender &&
      formData.Married &&
      formData.Dependents >= 0 &&
      formData.Education &&
      formData.Self_Employed &&
      formData.Property_Area
    );
  };

  const isStep2Valid = () => {
    return (
      formData.ApplicantIncome > 0 &&
      formData.CoapplicantIncome >= 0 &&
      formData.LoanAmount > 0 &&
      formData.Loan_Amount_Term > 0
    );
  };

  const loanRequestSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setSubmitError(null);
      await axios.post(
        `http://localhost:8000/loan-request/${userData?.user_id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      fetchLoanReqHistory();
      setFormData({
        Gender: "",
        Married: "",
        Dependents: 0,
        Education: "",
        Self_Employed: "",
        Property_Area: "",
        ApplicantIncome: 0,
        CoapplicantIncome: 0,
        LoanAmount: 0,
        Loan_Amount_Term: 0,
      });
      setStep(1);
    } catch (error) {
      console.error("Error submitting loan request:", error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setSubmitError(`เกิดข้อผิดพลาดในการส่งคำขอกู้: ${error.response?.data?.message || error.message}`);
      } else {
        setSubmitError("เกิดข้อผิดพลาดที่ไม่คาดคิดในการส่งคำขอกู้");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 m-6 bg-white rounded-lg shadow-md">
      {isLoading && <p>กำลังโหลดข้อมูล...</p>}
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      {submitError && <p className="text-red-500">{submitError}</p>}

      {loanReqHistory?.result === null && !isLoading && (
        <p>คำขอของท่านอยู่ในขั้นตอนรอการอนุมัติ</p>
      )}

      {loanReqHistory?.result === 1 && !isLoading && (
        <p>คำขอของท่านได้รับการอนุมัติแล้ว กรุณาชำระให้ตรงงวด</p>
      )}

      {loanReqHistory?.result === 0 && !isLoading && (
        <p>ขออภัยคำขอของท่านถูกปฏิเสธ</p>
      )}

      {!isLoading && loanReqHistory === null  && (
        <>
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Step 1: Personal Information
              </h2>
              <p className="text-lg font-semibold">เพศ</p>
              <label className="">
                <input
                  type="radio"
                  name="Gender"
                  value="Male"
                  checked={formData.Gender === "Male"}
                  onChange={handleChange}
                />
                &nbsp;ชาย
              </label>
              <label className="ml-8">
                <input
                  type="radio"
                  name="Gender"
                  value="Female"
                  checked={formData.Gender === "Female"}
                  onChange={handleChange}
                />
                &nbsp;หญิง
              </label>

              <p className="text-lg font-semibold mt-3">สถานะสมรส</p>
              <label>
                <input
                  type="radio"
                  name="Married"
                  value="Yes"
                  checked={formData.Married === "Yes"}
                  onChange={handleChange}
                />{" "}
                แต่งงานแล้ว
              </label>
              <label className="ml-8">
                <input
                  type="radio"
                  name="Married"
                  value="No"
                  checked={formData.Married === "No"}
                  onChange={handleChange}
                />{" "}
                โสด
              </label>

              <p className="text-lg font-semibold mt-3">จำนวนผู้ที่อยู่ในอุปการะ</p>
              <input
                type="number"
                min={0}
                name="Dependents"
                placeholder="จำนวนผู้ที่อยู่ในอุปการะ"
                onChange={handleChange}
                value={formData.Dependents}
                className="w-full mb-2 p-2 border rounded"
              />

              <p className="text-lg font-semibold mt-3">ระดับการศึกษา</p>
              <label>
                <input
                  type="radio"
                  name="Education"
                  value="Yes"
                  checked={formData.Education === "Yes"}
                  onChange={handleChange}
                />{" "}
                จบปริญญาตรี หริอสูงกว่า
              </label>
              <label className="ml-8">
                <input
                  type="radio"
                  name="Education"
                  value="No"
                  checked={formData.Education === "No"}
                  onChange={handleChange}
                />{" "}
                จบต่ำกว่าปริญญาตรี
              </label>

              <p className="text-lg font-semibold mt-3">ประกอบอาชีพอิสระ</p>
              <label>
                <input
                  type="radio"
                  name="Self_Employed"
                  value="Yes"
                  checked={formData.Self_Employed === "Yes"}
                  onChange={handleChange}
                />{" "}
                ใช่
              </label>
              <label className="ml-8">
                <input
                  type="radio"
                  name="Self_Employed"
                  value="No"
                  checked={formData.Self_Employed === "No"}
                  onChange={handleChange}
                />{" "}
                ไม่
              </label>

              <p className="text-lg font-semibold mt-3">พื้นที่อสังหาริมทรัพย์</p>
              <label>
                <input
                  type="radio"
                  name="Property_Area"
                  value="Urban"
                  checked={formData.Property_Area === "Urban"}
                  onChange={handleChange}
                />{" "}
                เมือง
              </label>
              <label className="ml-8">
                <input
                  type="radio"
                  name="Property_Area"
                  value="Semiurban"
                  checked={formData.Property_Area === "Semiurban"}
                  onChange={handleChange}
                />{" "}
                กึ่งเมือง
              </label>
              <label className="ml-8">
                <input
                  type="radio"
                  name="Property_Area"
                  value="Rural"
                  checked={formData.Property_Area === "Rural"}
                  onChange={handleChange}
                />{" "}
                ชนบท
              </label>
              <hr />
              <button
                onClick={() => isStep1Valid() && setStep(2)}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 mt-3"
                disabled={!isStep1Valid()}
              >
                ถัดไป
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Step 2: Loan Information
              </h2>
              <p className="text-lg font-semibold mt-3">รายได้ของผู้กู้</p>
              <input
                type="number"
                name="ApplicantIncome"
                placeholder="รายได้ของผู้กู้"
                onChange={handleChange}
                value={formData.ApplicantIncome}
                className="w-full mb-2 p-2 border rounded"
              />

              <p className="text-lg font-semibold mt-3">รายได้ของผู้กู้ร่วม</p>
              <input
                type="number"
                name="CoapplicantIncome"
                placeholder="รายได้ของผู้กู้ร่วม"
                onChange={handleChange}
                value={formData.CoapplicantIncome}
                className="w-full mb-2 p-2 border rounded"
              />

              <p className="text-lg font-semibold mt-3">จำนวนเงินกู้</p>
              <input
                type="number"
                name="LoanAmount"
                placeholder="จำนวนเงินกู้"
                onChange={handleChange}
                value={formData.LoanAmount}
                className="w-full mb-2 p-2 border rounded"
              />

              <p className="text-lg font-semibold mt-3">ระยะเวลาการกู้ (เดือน)</p>
              <input
                type="number"
                name="Loan_Amount_Term"
                placeholder="ระยะเวลาการกู้"
                onChange={handleChange}
                value={formData.Loan_Amount_Term}
                className="w-full mb-2 p-2 border rounded"
              />

              <button
                onClick={() => setStep(1)}
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={loanRequestSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                disabled={!isStep2Valid()}
              >
                ส่งข้อมูล
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Loan;