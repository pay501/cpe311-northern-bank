package repositories

import (
	"northern-bank/internal/dto"
	"northern-bank/internal/entities"
)

type UserRepository interface {
	Save(user *entities.User) (int, error)
	UpdateEmail(data *dto.UpdateUserCredentialReq) (*dto.UpdateUserCredentialRes, error)
	UpdatePhoneNumber(data *dto.UpdateUserCredentialReq) (*dto.UpdateUserCredentialRes, error)
	UpdatePassword(data *dto.UpdateUserCredentialReq) error
	FindByEmail(email string) (*entities.User, error)
	FindUserByEmailOrUsername(data string) (map[string]interface{}, error)
	FindTransactionByUserId(id int) ([]*entities.Transaction, error)
	TransferMoney(transferReq *entities.Transaction) (*entities.Transaction, error)
	SelectUsers() ([]*entities.User, error)
	CheckDuplicateIDNumber(idNumber string) (bool, error)
	CheckDuplicatePhoneNumber(phoneNumber string) (bool, error)
	CheckDuplicateEmail(email string) (bool, error)
	CheckDuplicateUsername(username string) (bool, error)
	CheckAllDuplicates(user *entities.User) (string, error)
}
