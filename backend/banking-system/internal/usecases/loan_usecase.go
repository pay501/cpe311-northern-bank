package usecases

import (
	"northern-bank/internal/dto"
	"northern-bank/internal/repositories"
)

type LoanUsecaseDb struct {
	loanRepo repositories.LoanRepository
}

func NewLoanUsecase(loanRepo repositories.LoanRepository) *LoanUsecaseDb {
	return &LoanUsecaseDb{loanRepo: loanRepo}
}

func (u *LoanUsecaseDb) GetLoanHistories() ([]*dto.LoanHistoryRes, error) {
	loanHisteries, err := u.loanRepo.FindLoanHistories()
	if err != nil {
		return nil, err
	}
	return loanHisteries, nil
}
