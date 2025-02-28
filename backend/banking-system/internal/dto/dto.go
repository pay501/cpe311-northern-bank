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
