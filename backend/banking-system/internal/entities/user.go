package entities

import "time"

type User struct {
	ID          uint          `json:"user_id" gorm:"primaryKey"`
	IDNumber    string        `json:"id_no" gorm:"unique"`
	FirstName   string        `json:"first_name"`
	LastName    string        `json:"last_name"`
	Gender      string        `json:"gender"`
	Role        string        `json:"role"`
	BirthDay    time.Time     `json:"birth_day"`
	Address     string        `json:"address"`
	PhoneNumber string        `json:"phone_no" gorm:"unique"`
	Email       string        `json:"email" gorm:"unique"`
	Username    string        `json:"username" gorm:"unique"`
	Password    string        `json:"password"`
	NumberOfAcc int           `json:"number_of_acc"`
	Accounts    []Account     `gorm:"foreignKey:ID"`
	Transaction []Transaction `json:"transaction" gorm:"foreignKey:FromUserID"`
	LoanHistory []LoanHistory `json:"loan_history" gorm:"foreignKey:ID"`
}
