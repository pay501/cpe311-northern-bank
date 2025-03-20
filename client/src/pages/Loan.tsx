import React, { useState } from "react";

interface LoanFormData {
  Gender: string;
  Married: string;
  Dependents: string;
  Education: string;
  Self_Employed: string;
  Property_Area: string;
  ApplicantIncome: string;
  CoapplicantIncome: string;
  LoanAmount: string;
  Loan_Amount_Term: string;
}

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>({
    Gender: "",
    Married: "",
    Dependents: "",
    Education: "",
    Self_Employed: "",
    Property_Area: "",
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isStep1Valid = () => {
    return (
      formData.Gender &&
      formData.Married &&
      formData.Dependents &&
      formData.Education &&
      formData.Self_Employed &&
      formData.Property_Area
    );
  };

  const isStep2Valid = () => {
    return (
      formData.ApplicantIncome &&
      formData.CoapplicantIncome &&
      formData.LoanAmount &&
      formData.Loan_Amount_Term
    );
  };

  return (
    <div className="max-w-md p-6 m-6 bg-white rounded-lg shadow-md">
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Step 1: Personal Information</h2>
          <input type="text" name="Gender" placeholder="Gender" onChange={handleChange} value={formData.Gender} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="Married" placeholder="Married" onChange={handleChange} value={formData.Married} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="Dependents" placeholder="Dependents" onChange={handleChange} value={formData.Dependents} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="Education" placeholder="Education" onChange={handleChange} value={formData.Education} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="Self_Employed" placeholder="Self Employed" onChange={handleChange} value={formData.Self_Employed} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="Property_Area" placeholder="Property Area" onChange={handleChange} value={formData.Property_Area} className="w-full mb-2 p-2 border rounded" />
          <button onClick={() => isStep1Valid() && setStep(2)} className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300" disabled={!isStep1Valid()}>
            ถัดไป
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 p-6 m-6">Step 2: Loan Information</h2>
          <input type="text" name="ApplicantIncome" placeholder="Applicant Income" onChange={handleChange} value={formData.ApplicantIncome} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="CoapplicantIncome" placeholder="Coapplicant Income" onChange={handleChange} value={formData.CoapplicantIncome} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="LoanAmount" placeholder="Loan Amount" onChange={handleChange} value={formData.LoanAmount} className="w-full mb-2 p-2 border rounded" />
          <input type="text" name="Loan_Amount_Term" placeholder="Loan Amount Term" onChange={handleChange} value={formData.Loan_Amount_Term} className="w-full mb-2 p-2 border rounded" />
          <button onClick={() => setStep(1)} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
            ย้อนกลับ
          </button>
          <button onClick={() => alert(JSON.stringify(formData, null, 2))} className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300" disabled={!isStep2Valid()}>
            ส่งข้อมูล
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
