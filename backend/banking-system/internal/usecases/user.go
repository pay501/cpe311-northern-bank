package usecases

import (
	"northern-bank/internal/dto"
	"northern-bank/internal/entities"
)

type UserUsecase interface {
	Register(data *entities.User, balance float64) (*entities.Account, error)
	Login(data dto.LoginReq) (string, error)
	Transfer(data dto.TransferReq) (*entities.Transaction, error)
	Transactions(id int) ([]*dto.TransactionRes, error)
}
