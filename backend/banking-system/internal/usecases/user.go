package usecases

import "northern-bank/internal/entities"

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserUsecase interface {
	Register(*entities.User) error
	Login(LoginReq) (*entities.User, error)
}
