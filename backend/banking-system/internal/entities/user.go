package entities

import "time"

type User struct {
	UserID      uint      `json:"user_id" gorm:"primaryKey"`
	IDNumber    string    `json:"id_no" gorm:"unique"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	BirthDay    time.Time `json:"birth_day"`
	Address     string    `json:"address"`
	PhoneNumber string    `json:"phone_no" gorm:"unique"`
	Email       string    `json:"email" gorm:"unique"`
	Username    string    `json:"username" gorm:"unique"`
	Password    string    `json:"password"`
	NumberOfAcc int       `json:"number_of_acc"`
	Accounts    []Account `gorm:"foreignKey:UserID"`
}
