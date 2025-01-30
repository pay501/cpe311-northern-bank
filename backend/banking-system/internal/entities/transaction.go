package entities

import "time"

type Transaction struct {
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
