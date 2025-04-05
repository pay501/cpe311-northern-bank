import { useEffect, useState } from "react";
import {DecodedToken, User } from "../utils/types";
import { useNavigate } from "react-router-dom";
import { DecodedJwtToken, FetchUserData } from "../utils/functions";


const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id_number: "",
    first_name: "",
    last_name: "",
    gender: "",
    birth_day: "",
    address: "",
    phone_number: "",
    email: "",
    username: "",
    password: "",
  });

  const fetchData = async () => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken || jwtToken === "") {
      navigate("/authen");
      return;
    }

    const decodedToken: DecodedToken = DecodedJwtToken(jwtToken);
    console.log(decodedToken);

    const response = await FetchUserData(decodedToken.user_id, jwtToken);
    if (response?.data?.user) {
      console.log("Fetched User:", response.data.user);
      setUserData(response.data.user)
    }
  };

  useEffect(() => {
    fetchData()
    if(userData != null){
      if(userData.role !== "admin"){
        navigate("/authen")
      }
    }
  }, [userData]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Submitting Data:", formData);
    alert("สมัครสมาชิกสำเร็จ!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-green-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/6">
        <div className="flex p-5">
          <div className="w-1/2">
            {step === 1 && (
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold">
                  Welcome, <br />
                  I hope you're happy
                  <br />
                  <p className="pt-1">with Northern Bank</p>
                </h2>

                <p className="pt-5 font-medium">
                  Enter your name and
                  <br />
                  identification number
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold">Bacis information</h2>
                <p className="pt-5">
                  Enter your birthday, gender <br />
                  and address
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold">Contact informations</h2>
                <p className="pt-5">
                  Enter your Phone Number <br />
                  and Email Address
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold">Authentication</h2>
                <p className="pt-5">
                  Create Username
                  <br />
                  and Password
                </p>
              </div>
            )}
          </div>

          <div className="w-1/2">
            {step === 1 && (
              <div>
                <input
                  type="text"
                  name="id_number"
                  placeholder="หมายเลขประจำตัว"
                  value={formData.id_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <input
                  type="text"
                  name="first_name"
                  placeholder="ชื่อจริง"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="นามสกุล"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <button
                  onClick={nextStep}
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  ถัดไป
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                >
                  <option value="">เลือกเพศ</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่นๆ</option>
                </select>
                <input
                  type="date"
                  name="birth_day"
                  value={formData.birth_day}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="ที่อยู่"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="bg-gray-300 text-black p-2 rounded"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="เบอร์โทรศัพท์"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="อีเมล"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="bg-gray-300 text-black p-2 rounded"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="ชื่อผู้ใช้"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="รหัสผ่าน"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="bg-gray-300 text-black p-2 rounded"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    สมัครสมาชิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
