package dto

type UpdateUserInformation struct {
	PhoneNumber *string `json:"phone_number" validate:"omitempty,len=10,numeric"`
	Email       *string `json:"email" validate:"omitempty,email"`
}

type CheckRecieverAccountReq struct {
	AccountNumber string `json:"account_number" validate:"required,len=10,numeric"`
	BankCode      string `json:"bank_code" validate:"required"`
}

type AccountWithOwner struct {
	AccID     string
	AccNo     string
	BankCode  string
	Balance   float64
	UserID    int
	FirstName string
	LastName  string
}
