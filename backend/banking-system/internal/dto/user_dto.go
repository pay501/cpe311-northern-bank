package dto

type UpdateUserInformation struct {
	PhoneNumber *string `json:"phone_number" validate:"omitempty,len=10,numeric"`
	Email       *string `json:"email" validate:"omitempty,email"`
}
