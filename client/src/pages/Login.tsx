   import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DecodedToken } from "../utils/types";
import { DecodedJwtToken, FetchUserData } from "../utils/functions";     
import logo from "../assets/northern bank logo.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8080/login`, {
        email: username,
        password: password,
      });

      if (response.status === 200) {
        const jwtToken = response.data.token;
        sessionStorage.setItem("jwtToken", jwtToken);

        const decodedToken: DecodedToken = DecodedJwtToken(jwtToken);
        const userResponse = await FetchUserData(
          decodedToken.user_id,
          jwtToken
        );

        if (userResponse?.data?.user) {
          const user = userResponse.data.user;

          if (user.role === "user") {
            navigate("/");
          } else {
            navigate("/loan-history");
          }
        } else {
          console.error("User not found in response");
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Check if err is an AxiosError
        const axiosError = err as AxiosError; // Type assertion
        if (axiosError.response && axiosError.response.status === 401) {
          alert("Unauthorized");
        } else {
          console.log("Error ==> ", axiosError);
          alert("There is something error, Please Check log.");
        }
      } else {
        // Handle other types of errors
        console.log("An unexpected error occurred:", err);
        alert("An unexpected error occurred. Check the console.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-green-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Northern Bank"
            className="w-32 mb-4 rounded-full"
          />
        </div>

        <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
          บริการด้านการเงิน Northern Bank
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="รหัสผู้ใช้งาน"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-4 text-center">
          <button className="text-green-500 font-medium hover:underline">
            🔑 ลืมรหัสผู้ใช้งาน / รหัสผ่าน
          </button>
        </div>

        <div className="mt-2 text-center">
          <button className="text-green-500 font-medium hover:underline">
            🔓 ปลดล็อครหัสผู้ใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
