package dto

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
