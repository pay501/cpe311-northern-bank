import React, { useState } from "react";
import ChangeInformationModal from "../components/ChangeInformationModal";
import axios, { AxiosError } from "axios";
import { useOutletContext } from "react-router-dom";
import { User } from "../utils/types";

interface SettingsProps {
  userData: User | null;
  jwtToken: string;
  fetchUserData: (userId: number, jwtToken: string) => Promise<void>;
}

const Settings: React.FC = () => {
  const { userData, jwtToken, fetchUserData } =
    useOutletContext<SettingsProps>();
  const [activeTab, setActiveTab] = useState("personal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInformation, setNewInformation] = useState<string>("");
  const [isDataBlank, setIsDataBlank] = useState(false);
  const [fiedlToChange, setfiedlToChange] = useState<string>("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isBadRequest, setIsBadRequest] = useState(false);

  const maskPhone = (phone: string | null) => {
    return `XXX-XXX-${phone?.slice(-4)}`;
  };

  const maskEmail = (email: string | null) => {
    if (!email || !email.includes("@")) return "อีเมลไม่ถูกต้อง";

    const [local, domain] = email.split("@");
    return `${local.slice(0, 4).toUpperCase()}XXXXX@${domain.toUpperCase()}`;
  };

  const handleConfirm = async () => {
    if (userData && jwtToken && newInformation) {
      try {
        if (fiedlToChange === "email") {
          await axios.put(
            `http://localhost:8080/user/${userData.user_id}?field=email`,
            {
              email: newInformation,
            },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          await fetchUserData(userData.user_id, jwtToken);
          setIsModalOpen(false);
        } else if (fiedlToChange === "phone") {
          await axios.put(
            `http://localhost:8080/user/${userData.user_id}?field=phone`,
            {
              phone_number: newInformation,
            },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          await fetchUserData(userData.user_id, jwtToken);
          setIsModalOpen(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError;
          if (err.response?.status === 409) {
            setIsDuplicate(true);
          } else if(err.response?.status === 400){
            setIsBadRequest(true);
          }
        }
      }
    } else {
      setIsDataBlank(true);
    }
  };

  return (
    <div className="p-6 max-w-xl pl-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">ตั้งค่า</h2>

      <div className="bg-white rounded-lg shadow p-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4 space-x-4">
          <button
            className={`pb-2 border-b-2 font-semibold ${
              activeTab === "personal"
                ? "border-green-500 text-green-500"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("personal");
            }}
          >
            ข้อมูลส่วนบุคคล
          </button>
          <button
            className={`pb-2 border-b-2 font-semibold ${
              activeTab === "security"
                ? "border-green-500 text-green-500"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("security")}
          >
            ความปลอดภัย
          </button>
          {/*           <button
            className={`pb-2 border-b-2 font-semibold ${
              activeTab === "linked"
                ? "border-green-500 text-green-500"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("linked")}
          >
            รวมบัญชีผู้ใช้งาน
          </button> */}
        </div>

        {/* Content */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            {/* Phone */}
            <div>
              <p className="text-gray-500 text-sm">เบอร์โทรศัพท์</p>
              <p className="text-gray-800 font-medium">
                {maskPhone(userData?.phone_number ?? null)}
              </p>
              <button
                className="text-green-600 font-semibold mt-1 hover:underline"
                onClick={() => {
                  setIsModalOpen(true);
                  setfiedlToChange("phone");
                }}
              >
                เปลี่ยนเบอร์โทรศัพท์มือถือ &rsaquo;
              </button>
            </div>

            <hr />

            {/* Email */}
            <div>
              <p className="text-gray-500 text-sm">อีเมล</p>
              <p className="text-gray-800 font-medium">
                {maskEmail(userData?.email ?? null)}
              </p>
              <button
                className="text-green-600 font-semibold mt-1 hover:underline"
                onClick={() => {
                  setIsModalOpen(true);
                  setfiedlToChange("email");
                }}
              >
                เปลี่ยนอีเมล &rsaquo;
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && <p>📌 ความปลอดภัย (ยังไม่ใส่เนื้อหา)</p>}
        {activeTab === "linked" && (
          <p>📌 รวมบัญชีผู้ใช้งาน (ยังไม่ใส่เนื้อหา)</p>
        )}
      </div>

      {fiedlToChange === "phone" ? (
        <ChangeInformationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          newPhone={newInformation}
          setNewInformation={setNewInformation}
          isDataBlank={isDataBlank}
          setIsDataBlank={setIsDataBlank}
          dataDuplicateInformation={{
            isDuplicate,
            text: "เบอร์โทรนี้มีคนใช้แล้ว",
          }}
          setIsDuplicate={setIsDuplicate}
          dataBadRequestInfo={{
            isBadRequest,
            text:"รูบแบบเบอร์โทรศัพท์ไม่ถูกต้อง"
          }}
          setIsBadRequest={setIsBadRequest}
          datafiedlToChange={{
            fiedlToChange,
            topic: "เปลี่ยนเบอร์โทร",
            title: "กรุณากรอกเบอร์ใหม่ของคุณ",
            moreDetail: "เราจะส่ง OTP ไปยังเบอร์ใหม่เพื่อยืนยันตัวตน",
          }}
        />
      ) : (
        <ChangeInformationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          newPhone={newInformation}
          setNewInformation={setNewInformation}
          isDataBlank={isDataBlank}
          setIsDataBlank={setIsDataBlank}
          dataDuplicateInformation={{
            isDuplicate,
            text: "อีเมลล์นี้มีคนใช้แล้ว",
          }}
          setIsDuplicate={setIsDuplicate}
          dataBadRequestInfo={{
            isBadRequest,
            text:"รูบแบบอีเมลล์ไม่ถูกต้อง"
          }}
          setIsBadRequest={setIsBadRequest}
          datafiedlToChange={{
            fiedlToChange,
            topic: "เปลี่ยนอีเมล",
            title: "กรุณากรอกอีเมลใหม่ของคุณ",
            moreDetail: "เราจะส่ง OTP ไปยังอีเมลใหม่เพื่อยืนยันตัวตน",
          }}
        />
      )}
    </div>
  );
};

export default Settings;
