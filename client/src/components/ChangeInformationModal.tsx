// components/ChangePhoneModal.tsx
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newPhone: string;
  datafiedlToChange: {
    fiedlToChange: string;
    topic: string;
    title: string;
    moreDetail: string;
  };
  setNewInformation: (val: string) => void;
  isDataBlank: boolean;
  setIsDataBlank: (val: boolean) => void;
  dataDuplicateInformation: {
    isDuplicate: boolean;
    text: string;
  };
  setIsDuplicate: (val: boolean) => void;
  dataBadRequestInfo: {
    isBadRequest: boolean;
    text: string;
  };
  setIsBadRequest: (val: boolean) => void;
};

const ChangeInformationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  newPhone,
  datafiedlToChange,
  setNewInformation,
  isDataBlank,
  setIsDataBlank,
  dataDuplicateInformation,
  setIsDuplicate,
  dataBadRequestInfo,
  setIsBadRequest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        <button
          className="absolute top-3 right-4 text-gray-600 text-xl"
          onClick={() => {
            onClose();
            setIsDataBlank(false);
            setIsDuplicate(false);
            setIsBadRequest(false);
          }}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">{datafiedlToChange.topic}</h2>
        <label className="block mb-2">{datafiedlToChange.title}</label>
        <input
          type="text"
          value={newPhone}
          onChange={(e) => setNewInformation(e.target.value)}
          placeholder="กรอกข้อมูล"
          className="w-full border px-4 py-2 rounded mb-4"
        />

        {isDataBlank && <p className="text-rose-600">กรุณากรอกข้อมูล</p>}
        {dataDuplicateInformation.isDuplicate && (
          <p className="text-red-600">{dataDuplicateInformation.text}</p>
        )}
        {dataBadRequestInfo.isBadRequest && (
          <p className="text-red-600">{dataBadRequestInfo.text}</p>
        )}
        <p className="text-green-600 font-semibold">
          {datafiedlToChange.moreDetail}
        </p>
        {/* <ul className="text-sm text-gray-600 mt-2 space-y-1 list-decimal ml-5">
          <li>
            เบอร์ที่ต้องการเปลี่ยนจะต้องเป็นเบอร์ที่สมัครบริการ K PLUS แล้วเท่านั้น
          </li>
          <li>
            ต้องมีข้อมูลส่วนตัวตรงกับที่ K PLUS มีในระบบ
          </li>
          <li>
            หากไม่สามารถยืนยันตัวตนได้ จะไม่สามารถเปลี่ยนเบอร์ได้
          </li>
          <li>
            การเปลี่ยนเบอร์จะมีผลกับทุกบัญชีที่อยู่ในบัญชีผู้ใช้นี้
          </li>
        </ul> */}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              onClose();
              setNewInformation("");
              setIsDataBlank(false);
              setIsDuplicate(false);
              setIsBadRequest(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              onConfirm();
              setNewInformation("");
            }}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeInformationModal;
