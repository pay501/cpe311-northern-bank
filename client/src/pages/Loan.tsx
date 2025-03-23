import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User } from "../utils/types";

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

const MultiStepForm: React.FC = () => {
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

  const {userData, jwtToken} = useOutletContext<LoanFromProps>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const loanRequestSubmit = async(e: any)=>{
    e.preventDefault();
    try{
      const response = await axios.post(`http://localhost:8000/loan-request/${userData?.user_id}`, formData,{
        headers:{Authorization: `Bearer ${jwtToken}`}
      })
      
      console.log(response.data)
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="max-w-md p-6 m-6 bg-white rounded-lg shadow-md">
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Step 1: Personal Information</h2>
          <p>เพศ</p>
          <label><input type="radio" name="Gender" value="Male" onChange={handleChange} /> ชาย</label>
          <label><input type="radio" name="Gender" value="Female" onChange={handleChange} /> หญิง</label>
          
          <p>สถานะสมรส</p>
          <label><input type="radio" name="Married" value="Yes" onChange={handleChange} /> แต่งงานแล้ว</label>
          <label><input type="radio" name="Married" value="No" onChange={handleChange} /> โสด</label>
          
          <p>จำนวนผู้ที่อยู่ในอุปการะ</p>
          <input type="text" name="Dependents" placeholder="จำนวนผู้ที่อยู่ในอุปการะ" onChange={handleChange} value={formData.Dependents} className="w-full mb-2 p-2 border rounded" />
          
          <p>ระดับการศึกษา</p>
          <label><input type="radio" name="Education" value="Yes" onChange={handleChange} /> จบปริญญาตรี หริอสูงกว่า</label>
          <label><input type="radio" name="Education" value="No" onChange={handleChange} /> จบต่ำกว่าปริญญาตรี</label>
          
          <p>ประกอบอาชีพอิสระ</p>
          <label><input type="radio" name="Self_Employed" value="Yes" onChange={handleChange} /> ใช่</label>
          <label><input type="radio" name="Self_Employed" value="No" onChange={handleChange} /> ไม่</label>
          
          <p>พื้นที่อสังหาริมทรัพย์</p>
          <label><input type="radio" name="Property_Area" value="Urban" onChange={handleChange} /> เมือง</label>
          <label><input type="radio" name="Property_Area" value="Semiurban" onChange={handleChange} /> กึ่งเมือง</label>
          <label><input type="radio" name="Property_Area" value="Rural" onChange={handleChange} /> ชนบท</label>
          
          <button onClick={() => isStep1Valid() && setStep(2)} className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300" disabled={!isStep1Valid()}>
            ถัดไป
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 p-6 m-6">Step 2: Loan Information</h2>
          <p>รายได้ของผู้กู้</p>
          <input type="number" name="ApplicantIncome" placeholder="รายได้ของผู้กู้" onChange={handleChange} value={formData.ApplicantIncome} className="w-full mb-2 p-2 border rounded" />

          <p>รายได้ของผู้กู้ร่วม</p>
          <input type="number" name="CoapplicantIncome" placeholder="รายได้ของผู้กู้ร่วม" onChange={handleChange} value={formData.CoapplicantIncome} className="w-full mb-2 p-2 border rounded" />

          <p>จำนวนเงินกู้</p>
          <input type="number" name="LoanAmount" placeholder="จำนวนเงินกู้" onChange={handleChange} value={formData.LoanAmount} className="w-full mb-2 p-2 border rounded" />

          <p>ระยะเวลาการกู้</p>
          <input type="number" name="Loan_Amount_Term" placeholder="ระยะเวลาการกู้" onChange={handleChange} value={formData.Loan_Amount_Term} className="w-full mb-2 p-2 border rounded" />
          
          <button onClick={() => setStep(1)} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
            ย้อนกลับ
          </button>
          <button onClick={loanRequestSubmit} className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300" disabled={!isStep2Valid()}>
            ส่งข้อมูล
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
