import React from 'react';

const BusinessAccount: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white">
        <div className="p-4 text-center border-b border-green-700">
          <h1 className="text-xl font-bold">NORTHERN BANK</h1>
        </div>
        <div className="p-4 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-gray-400"></div>
          <h2 className="mt-4 text-lg">Jack Dawson</h2>
          <p className="text-sm">บัญชีธุรกิจ</p>
        </div>
        <nav className="">
          <ul>
            <li className="px-4 py-2 hover:bg-green-700"><a href="#">โฮม</a></li>
            <li className="px-4 py-2 hover:bg-green-700"><a href="#">สินเชื่อ</a></li>
            <li className="px-4 py-2 hover:bg-green-700"><a href="#">โอนเงิน</a></li>
            <li className="px-4 py-2 hover:bg-green-700"><a href="#">ประวัติรายการ</a></li>
            <li className="px-4 py-2 hover:bg-green-700"><a href="#">ตั้งค่าบัญชี</a></li>
            <li className="px-4 py-2 hover:bg-green-700"><a href="#">ช่วยเหลือ</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white p-4 shadow-md flex justify-between items-center">
          <h2 className="text-lg font-semibold">บัญชีธุรกิจ</h2>
          <div className="flex items-center space-x-4">
            <span>Jack Dawson</span>
            <button className="text-green-900">ไทย / English</button>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        <section className="p-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">ยอดเงินที่ใช้ได้ทั้งหมด (บาท)</h3>
            <p className="text-2xl text-green-900 font-semibold">0.00</p>
            <p className="text-sm text-gray-500">ข้อมูล ณ วันที่ 10 ม.ค. 2568, 11:11 น.</p>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-bold">Mr. Jack Dawson</h4>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">ยอดเงินในบัญชี</p>
                  <p className="text-xl font-bold">0.00</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">ยอดคงเหลือที่ใช้ได้</p>
                  <p className="text-xl font-bold">0.00</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <a href="#" className="text-green-900 font-semibold">ดูรายละเอียดบัญชีเพิ่มเติม &gt;</a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default BusinessAccount;
 