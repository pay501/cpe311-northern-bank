import React, { useState } from "react";

const Login : React.FC  = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    // TODO: Add authentication logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-green-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Kasikorn_Bank.svg/1200px-Kasikorn_Bank.svg.png"
            alt="Northern Bank"
            className="w-32 mb-4"
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
