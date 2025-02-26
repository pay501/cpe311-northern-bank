package repositories

import (
	"northern-bank/internal/dto"
)

type TransactionRepository interface {
	FindTransactionByUserId(id int) (res []*dto.TransactionRes, err error)
	SaveFirstTransaction(data dto.FirstTransactionReq) error
}
