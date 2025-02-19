package usecases

import (
	"northern-bank/internal/entities"
	"northern-bank/internal/repositories"
)

type UserUsecaseDb struct {
	userRepo repositories.UserRepository
}

func NewUserUsecase(userRepo repositories.UserRepository) *UserUsecaseDb {
	return &UserUsecaseDb{userRepo: userRepo}
}

func (u *UserUsecaseDb) Register(*entities.User) error {
	return nil
}

func (u *UserUsecaseDb) Login(LoginReq) (*entities.User, error) {
	return nil, nil
}
