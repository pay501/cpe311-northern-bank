import React from "react";
import { Account, User } from "../utils/types";
import CountUp from "react-countup";
import { CurrentDateTime } from "../utils/functions";
import { useOutletContext } from "react-router-dom";

type HomeProps = {
  userData: User | null;
  accounts: Account[];
};

const Home: React.FC = () => {
  // Get data from Layout.tsx
  const { userData, accounts } = useOutletContext<HomeProps>();
  console.log(accounts)
  return (
    <>
      {accounts.map((val: Account, key: number) => {
        return (
          <section className="p-8" key={key}>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">
                บัญชีที่ {key + 1}: เลขที่บัญชี {val.acc_no}
              </h3>
              <h3 className="text-xl font-bold mb-4">
                ยอดเงินที่ใช้ได้ทั้งหมด (บาท)
              </h3>
              <p className="text-2xl text-green-900 font-semibold">
                <CountUp
                  end={val.balance}
                  separator=","
                  decimal="."
                  decimals={2}
                  duration={0}
                />
              </p>
              <p className="text-sm text-gray-500">
                ข้อมูล ณ วันที่ {CurrentDateTime()}
              </p>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold">
                  Mr.{userData?.first_name + " " + userData?.last_name}
                </h4>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">ยอดเงินในบัญชี</p>
                    <p className="text-xl font-bold">
                      <CountUp
                        end={val.balance}
                        separator=","
                        decimal="."
                        decimals={2}
                        duration={0}
                      />
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">ยอดคงเหลือที่ใช้ได้</p>
                    <p className="text-xl font-bold">
                      <CountUp
                        end={val.balance}
                        separator=","
                        decimal="."
                        decimals={2}
                        duration={0}
                      />
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <a href="#" className="text-green-900 font-semibold">
                    ดูรายละเอียดบัญชีเพิ่มเติม &gt;
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default Home;
