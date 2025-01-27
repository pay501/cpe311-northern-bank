package entities

import "time"

type User struct {
	UserID      int       `json:"user_id"`
	IDNumber    string    `json:"id_no"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	BirthDay    time.Time `json:"birth_day"`
	Address     string    `json:"address"`
	PhoneNumber string    `json:"phone_no"`
	Email       string    `json:"email"`
	Username    string    `json:"username"`
	Password    string    `json:"password"`
	NumberOfAcc int       `json:"number_of_acc"`
}
