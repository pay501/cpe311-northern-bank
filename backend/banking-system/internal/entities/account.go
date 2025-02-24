package entities

type Account struct {
	AccID    uint    `gorm:"primaryKey" json:"acc_id"`
	AccNo    string  `gorm:"size:20" json:"acc_no"`
	BankCode string  `gorm:"size:10" json:"bank_code"`
	Balance  float64 `json:"balance"`
	UserID   uint    `json:"user_id"`
	/* 	User     User    `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user"` */
}
