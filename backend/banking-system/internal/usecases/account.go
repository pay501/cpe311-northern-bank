package usecases

import "northern-bank/internal/entities"

type AccountUsecase interface {
	GetAccountByUserId(id int) ([]*entities.Account, error)
}
