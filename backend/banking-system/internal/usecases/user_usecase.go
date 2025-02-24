package usecases

import (
	"northern-bank/internal/entities"
	"northern-bank/internal/repositories"
	"time"

	"github.com/google/uuid"
)

type UserUsecaseDb struct {
	userRepo repositories.UserRepository
}

func NewUserUsecase(userRepo repositories.UserRepository) *UserUsecaseDb {
	return &UserUsecaseDb{userRepo: userRepo}
}

func (u *UserUsecaseDb) Register(data *entities.User) error {
	return nil
}

func (u *UserUsecaseDb) Login(data LoginReq) (*entities.User, error) {
	return nil, nil
}

func (u *UserUsecaseDb) GetUsers() ([]*entities.User, error) {
	users, err := u.userRepo.SelectUsers()
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (u *UserUsecaseDb) Transfer(req_data TransferReq) (*entities.Transaction, error) {
	id := uuid.New().String()
	id = "tst" + id

	transfer_data := entities.Transaction{
		ID:               id,
		FromUserID:       req_data.FromUserId,
		Amount:           req_data.Amount,
		CreatedAt:        time.Now(),
		FromUserAccNo:    req_data.FromUserAccNo,
		FromUserBankCode: req_data.FromUserBankCode,
		ToUserAccNo:      req_data.ToUserAccNo,
		ToUserBankCode:   req_data.ToUserBankCode,
	}

	trasaction, err := u.userRepo.TransferMoney(&transfer_data)
	if err != nil {
		return nil, err
	}

	return trasaction, nil
}
