package dto

import (
	"time"
)

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type TransferReq struct {
	FromUserId       int     `json:"from_user_id"`
	FromUserAccNo    string  `json:"from_user_acc_no"`
	FromUserBankCode string  `json:"from_user_bank_code"`
	ToUserAccNo      string  `json:"to_user_acc_no"`
	ToUserBankCode   string  `json:"to_user_bank_code"`
	Amount           float64 `json:"amount"`
}

type UpdateUserCredentialReq struct {
	Id         int    `json:"user_id"`
	Credential string `json:"credential"`
}

type UpdateUserCredentialRes struct {
	Id         int    `json:"user_id"`
	Credential string `json:"credential"`
}

type FirstTransactionReq struct {
	ID               string    `json:"id" gorm:"primaryKey"`
	FromUserID       int       `json:"from_user_id" gorm:"foreignKey:ID"`
	ToUserID         int       `json:"to_user_id"`
	Amount           float64   `json:"amount" gorm:"ืnot null"`
	FromUserAccNo    string    `json:"from_user_acc_no"`
	FromUserBankCode string    `json:"from_user_bank_code"`
	ToUserAccNo      string    `json:"to_user_acc_no"`
	ToUserBankCode   string    `json:"to_user_bank_code"`
	CreatedAt        time.Time `json:"created_at"`
}

type TransactionRes struct {
	ID               string    `json:"id" gorm:"primaryKey"`
	FromUserID       int       `json:"from_user_id" gorm:"foreignKey:ID"`
	Amount           float64   `json:"amount" gorm:"ืnot null"`
	FromUserAccNo    string    `json:"from_user_acc_no"`
	FromUserBankCode string    `json:"from_user_bank_code"`
	ToUserAccNo      string    `json:"to_user_acc_no"`
	ToUserBankCode   string    `json:"to_user_bank_code"`
	CreatedAt        time.Time `json:"created_at"`
}

type LoanHistoryRes struct {
	ID                int     `json:"id"`
	Status            string  `json:"status"`
	Gender            string  `json:"gender"`
	Married           string  `json:"married"`
	Dependents        string  `json:"dependents"`
	Education         string  `json:"education"`
	SelfEmployed      string  `json:"self_employed"`
	ApplicantIncome   float64 `json:"applicant_income"`
	CoapplicantIncome float64 `json:"coapplicant_income"`
	LoanAmount        float64 `json:"loan_amount"`
	LoanAmountTerm    float64 `json:"loan_amount_term"`
	PropertyArea      string  `json:"property_area"`
	UserID            int     `json:"user_id"`
	Result            *string `json:"result"`
	CreditHistory     float64 `json:"credit_history"`
}
