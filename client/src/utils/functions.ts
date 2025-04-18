import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function CurrentDateTime(): string {
  const now = new Date()

  const day = now.getDate();
  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const month = monthNames[now.getMonth()];
  const year = now.getFullYear() + 543;
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes} น.`
}

export function DecodedJwtToken(jwtToken: string) {
  const decodedToken: any = jwtDecode(jwtToken);
  return decodedToken
}

export async function FetchUserData(userId: number, jwtToken: string) {
  try {
    const response = await axios.get(`http://localhost:8080/user/${userId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response
  } catch (error) {
    console.log("Error fetching user data:", error);
  }
}

export const prepareBank = (bankCode: string | null) => {
  if (bankCode === "SCB") {
    return `ธนาคารไทยพานิชย์`;
  } else if (bankCode === "NTHBANK") {
    return `ธนาคารนอร์ธเทิร์น`;
  } else if (bankCode === "KTB") {
    return `ธนาคารกรุงไทย`;
  }
};

export const modifyAccountNumber = (accountNumber: string | null) => {
  // 467-3-35180-0
  return `${accountNumber?.slice(0, 3)}-${accountNumber?.slice(
    3,
    4
  )}-${accountNumber?.slice(4, 9)}-${accountNumber?.slice(-1)}`;
};