package entities

type LoanHistory struct {
	ID                int     `json:"id" gorm:"primaryKey"`
	Status            string  `json:"status"`
	Gnnder            string  `json:"gender"`
	Married           string  `json:"married"`
	Dependents        int     `json:"dependents"`
	Education         string  `json:"education"`
	SelfEmploy        string  `json:"self_employ"`
	ApplicantIncome   float64 `json:"applicant_income"`
	CoapplicantIncome float64 `json:"coapplicant_income"`
	LoanAmount        float64 `json:"loan_amount"`
	LoanAmountTerm    int     `json:"loan_amount_term"`
	CreditHistory     int     `json:"credit_history"`
	PropertyArea      string  `json:"property_area"`
	UserID            int     `json:"user_id" gorm:"foreignKey:ID"`
}
