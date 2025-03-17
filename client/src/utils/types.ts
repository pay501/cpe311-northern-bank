export interface Account {
    acc_id: string;
    acc_no: string;
    balance: number;
    bank_code: string;
    user_id: number;
}

export type User = {
    Accounts: null;
    address: string;
    birth_day: string;
    email: string;
    first_name: string;
    gender: string;
    id_number: string;
    last_name: string;
    loan_history: null;
    number_of_acc: number;
    password: string;
    phone_number: string;
    role: string;
    transaction: null;
    user_id: number;
    username: string;
}
