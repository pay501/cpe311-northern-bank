package repositories

import (
	"northern-bank/internal/dto"
)

type LoanRepository interface {
	FindLoanHistories() ([]*dto.LoanHistoryRes, error)
	FindLoanHistoriesByUserId(userId int) (*dto.LoanHistoryRes, error)
	UpdateLoanResult(result int, id int) error
}
