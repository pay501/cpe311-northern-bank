package repositories

import "northern-bank/internal/entities"

type AccountRepository interface {
	CreateAccount(acc_req *entities.Account) (*entities.Account, error)
}
