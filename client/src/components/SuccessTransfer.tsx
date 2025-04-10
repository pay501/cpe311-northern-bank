import React from "react";
import { CurrentDateTime, modifyAccountNumber, prepareBank } from "../utils/functions";
import { RecieverData, TransactionType, User } from "../utils/types";

interface SuccessTransferProps {
  transaction: TransactionType | null;
  onHomePage: () => void;
  senderInfo: User;
  recieverInfo: RecieverData;
}

const SuccessTransfer: React.FC<SuccessTransferProps> = ({
  transaction,
  onHomePage,
  senderInfo,
  recieverInfo
}) => {
  return (
    <div className="bg-white p-6 m-6 rounded-lg shadow-lg w-4/6 flex">
      <div className="flex w-[85%]">
        <div className="w-[100%] pr-6">
          <div className="">
            <h2 className="text-2xl font-bold mb-4">โอนเงิน</h2>
            <div className="border-l-4 border-green-500 pl-4 mb-6">
              <p className="text-green-600 text-xl font-bold">โอนเงินสำเร็จ</p>
              <p className="text-sm text-green-600">{CurrentDateTime()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">จาก:</p>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="bg-green-100 p-3 rounded-full">✅</div>
                  <div>
                    <p className="font-semibold">
                        {
                            senderInfo.first_name + " " + senderInfo.last_name
                        }
                    </p>
                    <p className="text-sm text-green-600">
                        {
                            prepareBank(transaction?.from_user_bank_code ?? null)
                        }
                    </p>
                    <p className="text-sm text-gray-500">
                        {
                            modifyAccountNumber(
                                transaction?.from_user_acc_no ?? null
                            )
                        }
                    </p>
                  </div>
                </div>
              </div>

              <div className=" ml-[35%]">
                <p className="font-semibold">ไปยัง:</p>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="bg-blue-100 p-3 rounded-full">🌊</div>
                  <div>
                    <p className="font-semibold">
                        {
                            recieverInfo.FirstName + " " + recieverInfo.LastName
                        }
                    </p>
                    <p className="text-sm text-green-600">
                        {
                            prepareBank(
                                transaction?.to_user_bank_code ?? null
                            )
                        }
                    </p>
                    <p className="text-sm text-gray-500">
                        {
                            modifyAccountNumber(
                                transaction?.to_user_acc_no ?? null
                            )
                        }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <table className="w-full text-sm mb-4">
              <tbody>
                <tr>
                  <td className="font-medium py-1">จำนวนเงิน</td>
                  <td className="text-right py-1">
                    {transaction?.amount} &nbsp;บาท
                  </td>
                </tr>
                <tr>
                  <td className="font-medium py-1">ค่าธรรมเนียม</td>
                  <td className="text-right py-1">0.00 บาท</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">วันที่เงินเข้าบัญชี</td>
                  <td className="text-right py-1">
                    {
                        (CurrentDateTime()).split(",")[0]
                    }
                  </td>
                </tr>
                <tr>
                  <td className="font-medium py-1">เลขที่รายการ</td>
                  <td className="text-right py-1">
                    {transaction?.id}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-3 mt-6 text-center gap-2 text-sm text-gray-700">
              <div>
                📄
                <p className="mt-1">E-slip</p>
              </div>
              <div>
                📌
                <p className="mt-1">เพิ่มรายการโปรด</p>
              </div>
              <div
                onClick={()=>{
                    onHomePage();
                }}
                className=" cursor-pointer"
              >
                🏠
                <p className="mt-1">กลับหน้าหลัก</p>
              </div>
            </div>
          </div>
        </div>

        {/*         <div className="w-1/3 border-l pl-6">
          <div className="text-gray-400">1 ทำรายการ</div>
          <div className="text-gray-400">2 ยืนยันการทำรายการ</div>
          <div className="text-green-600 font-bold">3 ขั้นตอนสำเร็จ</div>
        </div> */}
      </div>
    </div>
  );
};

export default SuccessTransfer;
