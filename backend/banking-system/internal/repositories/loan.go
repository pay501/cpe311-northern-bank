package repositories

import "northern-bank/internal/dto"

type LoanRepository interface {
	FindLoanHistories() ([]*dto.LoanHistoryRes, error)
}
