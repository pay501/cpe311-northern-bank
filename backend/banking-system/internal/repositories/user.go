package repositories

import "northern-bank/internal/entities"

type UserRepository interface {
	Save(user *entities.User) error
	FindByEmail(email string) (*entities.User, error)
	FindTransactionByUserId(id int) ([]*entities.Transaction, error)
}
