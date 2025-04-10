export interface DecodedToken {
    exp: number;
    role: string;
    user_id: number;
}
export interface Account {
    acc_id: string;
    acc_no: string;
    balance: number;
    bank_code: string;
    user_id: number;
}

export interface LoanReqHistories {
    applicant_income: number
    coapplicant_income: number
    credit_history: number
    dependents: string
    education: string
    gender: string
    id: number
    loan_amount: number
    loan_amount_term: number
    married: string
    property_area: string
    result: null | number
    self_employed: string
    status: string
    user_id: number
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

export type TransactionType = {
    amount: number;
    created_at: string;
    from_user_acc_no: string;
    from_user_bank_code: string;
    from_user_id: number;
    id: string;
    to_user_acc_no: string;
    to_user_bank_code: string;
}

export interface RecieverData {
    AccID: string;
    AccNo: string;
    Balance: number;
    BankCode: string;
    FirstName: string;
    LastName: string;
    UserID: number;
}
