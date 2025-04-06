package usecases

import "northern-bank/internal/dto"

type LoanUsecase interface {
	GetLoanHistories() ([]*dto.LoanHistoryRes, error)
	UpdateLoanResult(result int, id int) error
}
