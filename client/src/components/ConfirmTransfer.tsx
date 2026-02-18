import React from "react";
import { Account, RecieverData, User } from "../utils/types";
import { CurrentDateTime, modifyAccountNumber, prepareBank } from "../utils/functions";
import CountUp from "react-countup";

interface confirmTransferProps {
  step: number;
  amount: number;
  senderInfo: {
    userData: User;
    account: Account;
  };
  recieverData: RecieverData | null;
  onConfirm: () => void;
  onBack: (val: number) => void;
}

const ConfirmTransfer: React.FC<confirmTransferProps> = ({
  step,
  amount,
  senderInfo,
  recieverData,
  onConfirm,
  onBack,
}) => {
  const maskSenderAccountNumber = (accNo: string) => {
    return `xxx-xx-${accNo.slice(5, 9)}-x`;
  };



  return (
    <div className="bg-white p-6 m-6 rounded-lg shadow-lg w-4/6 flex">
      {step == 2 && (
        <div className="flex">
          <div className="w-[75%] pr-6">
            <h2 className="text-xl font-bold mb-2">ยืนยันการทำรายการ</h2>
            <p className="text-right text-sm text-gray-500 mb-4">
              วันที่ทำรายการ:{" "}
              <span className="font-medium">{CurrentDateTime()}</span>
            </p>

            {/* From - To Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* From */}
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-1">จาก:</p>
                <p className="font-bold">
                  {senderInfo.userData.first_name +
                    " " +
                    senderInfo.userData.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {maskSenderAccountNumber(senderInfo.account.acc_no)}
                </p>
              </div>

              {/* To */}
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-1">ไปยัง:</p>
                <p className="font-bold">
                  {recieverData?.FirstName + " " + recieverData?.LastName}
                </p>
                <p className="text-sm text-green-600">
                  {prepareBank(recieverData?.BankCode ?? null)}
                </p>
                <p className="text-sm text-gray-500">
                  {modifyAccountNumber(recieverData?.AccNo ?? null)}
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  ⚠ กรุณาตรวจสอบข้อมูล ระวังมิจฉาชีพหลอก หรือโอนผิดบัญชี!
                </p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="text-sm text-gray-800 space-y-2 mb-6">
              <p>
                จำนวนเงิน:{" "}
                <span className="float-right font-medium">
                  <CountUp end={amount} decimal="." decimals={2} duration={0} />{" "}
                  &nbsp; บาท
                </span>
              </p>
              <p>
                ค่าธรรมเนียม:{" "}
                <span className="float-right font-medium">0.00 บาท</span>
              </p>
              <p>
                วันที่หักบัญชี:{" "}
                <span className="float-right font-medium">
                  {CurrentDateTime().split(",")[0]}
                </span>
              </p>
              <p>
                วันที่เงินเข้าบัญชี:{" "}
                <span className="float-right font-medium">
                  {CurrentDateTime().split(",")[0]}
                </span>
              </p>
              <p>
                ผู้สร้างรายการ:{" "}
                <span className="float-right font-medium">
                  {senderInfo.userData.first_name +
                    " " +
                    senderInfo.userData.last_name}
                </span>
              </p>
              <p>
                ประเภท:{" "}
                <span className="float-right font-medium">😊 อื่นๆ</span>
              </p>
            </div>

            {/* OTP Section */}
            {/* <div className="border-t pt-4 mt-4">
            <p className="font-medium mb-2">รหัส SMS-OTP</p>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-500">
                กรุณาระบุรหัส SMS-OTP เพื่อยืนยันการทำรายการ
              </p>
              <span className="text-xs text-gray-400">
                รหัสอ้างอิง: <span className="font-bold text-black">ETPZ</span>
              </span>
            </div>
            <input
              type="text"
              placeholder="กรอกรหัส OTP"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button className="text-green-600 text-sm underline">
              ขอรหัสอีกครั้ง
            </button>
          </div> */}

            {/* Note */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 text-sm mt-4">
              <p>
                📌 ระวังมิจฉาชีพหลอก
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => {
                  onBack(1);
                }}
              >
                ยกเลิก
              </button>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={()=>{
                  onConfirm();
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>

          <div className="w-1/3 border-l pl-6">
            <div className="text-gray-400">1 ทำรายการ</div>
            <div className="text-green-600 font-bold">2 ยืนยันการทำรายการ</div>
            <div className="text-gray-400">3 ขั้นตอนสำเร็จ</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmTransfer;
