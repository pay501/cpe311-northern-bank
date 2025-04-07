package usecases

import (
	"database/sql"
	"northern-bank/internal/dto"
	"northern-bank/internal/repositories"
	"northern-bank/pkg"
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

func (u *LoanUsecaseDb) GetLoanHistoryByUserId(userId int) (*dto.LoanHistoryRes, error) {
	result, err := u.loanRepo.FindLoanHistoriesByUserId(userId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, pkg.NewNotFoundError("loan not found")
		}
	}

	return result, nil
}

func (u *LoanUsecaseDb) UpdateLoanResult(result int, id int) error {
	err := u.loanRepo.UpdateLoanResult(result, id)
	if err != nil {
		return err
	}
	return nil
}
