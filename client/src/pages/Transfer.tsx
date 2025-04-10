import React, { useEffect, useState } from "react";
import { Account, RecieverData, TransactionType, User } from "../utils/types";
import { useNavigate, useOutletContext } from "react-router-dom";
import CountUp from "react-countup";
import axios, { AxiosError } from "axios";
import ConfirmTransfer from "../components/ConfirmTransfer";
import SuccessTransfer from "../components/SuccessTransfer";

type HomeProps = {
  userData: User | null;
  accounts: Account[];
  jwtToken: string;
  fetchBankInformation: (userId: string, token: string) => void;
  fetchUserData: (userId: string, token: string) => void;
};

const Transfer: React.FC = () => {
  const { userData, accounts, jwtToken, fetchBankInformation, fetchUserData } =
    useOutletContext<HomeProps>();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [toBankcode, settoBankcode] = useState("KBANK");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [transferType, setTransferType] = useState("ทันที (ตลอด 24 ชั่วโมง)");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<number>(1);
  const [recieverData, setRecieverData] = useState<RecieverData | null>(null);
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    setIsNotFound(false);
  }, [toAccountNumber, toBankcode]);

  const isValid = () => {
    return (
      toAccountNumber !== "" &&
      toAccountNumber.length === 10 &&
      parseFloat(amount) > 0
    );
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // กรองเฉพาะตัวเลขและจุดทศนิยม
    value = value.replace(/[^0-9.]/g, "");

    // จำกัดให้มีจุดทศนิยมแค่ 1 จุด
    value = value.replace(/(\..*?)\..*/g, "$1");

    if (value.includes(".")) {
      const [intPart, decimalPart] = value.split(".");
      value = intPart + "." + decimalPart.slice(0, 2);
    }

    setAmount(value);
  };

  const checkReciever = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/transfer-check`,
        {
          account_number: toAccountNumber,
          bank_code: toBankcode,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setRecieverData(response.data.result);
      setStep(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        if (err.response?.status === 400) {
          console.log(err.response.data);
        } else if (err.response?.status === 404) {
          setIsNotFound(true);
        }
      }
    }
  };

  const backToHomePage = () => {
    navigate("/");
  };

  const resetForm = () => {
    setAmount("");
    settoBankcode("KBANK");
    setToAccountNumber("");
    setTransferType("ทันที (ตลอด 24 ชั่วโมง)");
    setNote("");
    setStep(1);
  };

  const TransferRequest = async () => {
    if (!userData || accounts.length === 0) {
      console.log("Accounts data is missing!");
      return;
    }

    const payload = {
      from_user_id: userData.user_id,
      from_user_acc_no: accounts[0].acc_no,
      from_user_bank_code: accounts[0].bank_code,
      to_user_acc_no: toAccountNumber,
      to_user_bank_code: toBankcode,
      amount: parseFloat(amount),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/transfer",
        payload,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      fetchBankInformation(String(userData.user_id), jwtToken);
      fetchUserData(String(userData.user_id), jwtToken);

      if (response.status === 200) {
        setTransaction(response.data.transaction);
        resetForm();
        setStep(3);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Transfer Error:", error);
    }
  };

  if (!userData || accounts.length === 0) {
    return <p className="text-2xl font-bold">Loading...</p>;
  }

  return (
    <div className="min-h-screen">
      {step === 1 && (
        <div className="bg-white p-6 m-6 rounded-lg shadow-lg w-4/6 flex">
          <div className="w-[75%] pr-6">
            <h2 className="text-2xl font-bold mb-4">โอนเงิน</h2>
            <div className="border p-4 rounded-lg mb-4">
              <label className="block font-medium mb-1">จาก :</label>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <span>Mr.{userData.first_name + " " + userData.last_name}</span>
                <div className="text-right">
                  ยอดเงินที่ใช้ได้:
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

            <div className="mb-3">
              <label className="block font-medium mb-1">ไปยังบัญชีธนาคาร</label>
              <select
                value={toBankcode}
                onChange={(e) => settoBankcode(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="KBANK">ธนาคารกสิกรไทย</option>
                <option value="KTB">ธนาคารกรุงไทย</option>
                <option value="SCB">ธนาคารไทยพาณิชย์</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">เลขบัญชี</label>
              <input
                type="text"
                value={toAccountNumber}
                onChange={(e) =>
                  setToAccountNumber(e.target.value.replace(/\D/g, ""))
                }
                className="w-full p-2 border rounded-md"
                placeholder="XXX-X-XXXXX-X"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {isNotFound && (
                <p className="text-red-600">ไม่พบเลขที่บัญชีนี้</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-1">จำนวนเงิน (บาท)</label>
              <input
                type="text"
                value={amount}
                onChange={onAmountChange}
                inputMode="decimal"
                pattern="^\\d*\\.?\\d*$"
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
              <button
                className="bg-gray-600 text-white py-2 px-6 rounded-md"
                onClick={resetForm}
              >
                ล้างข้อมูล
              </button>
              <button
                className={`${
                  isValid() ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
                } text-white py-2 px-6 rounded-md`}
                disabled={!isValid()}
                onClick={checkReciever}
              >
                ต่อไป
              </button>
            </div>
          </div>

          <div className="w-1/3 border-l pl-6">
            <div className="text-green-600 font-bold">1 ทำรายการ</div>
            <div className="text-gray-400">2 ยืนยันการทำรายการ</div>
            <div className="text-gray-400">3 ขั้นตอนสำเร็จ</div>
          </div>
        </div>
      )}

      {step === 2 && userData && recieverData && (
        <ConfirmTransfer
          step={step}
          amount={parseFloat(amount)}
          senderInfo={{ userData, account: accounts[0] }}
          recieverData={recieverData}
          onConfirm={TransferRequest}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && userData && recieverData && transaction && (
        <SuccessTransfer
          senderInfo={userData}
          recieverInfo={recieverData}
          transaction={transaction}
          onHomePage={backToHomePage}
        />
      )}
    </div>
  );
};

export default Transfer;
