package usecases

import (
	"northern-bank/internal/entities"
	"northern-bank/internal/repositories"
)

type AccountUsecaseDb struct {
	accountRepo repositories.AccountRepository
}

func NewAccountUsecase(accountRepo repositories.AccountRepository) AccountUsecaseDb {
	return AccountUsecaseDb{accountRepo: accountRepo}
}

func (u *AccountUsecaseDb) GetAccountByUserId(id int) ([]*entities.Account, error) {
	accounts, err := u.accountRepo.FindAccountByUserId(id)
	if err != nil {
		return nil, err
	}
	return accounts, nil
}
