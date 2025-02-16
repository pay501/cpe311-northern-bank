package repositories

import (
	"database/sql"
	"fmt"
	"northern-bank/internal/entities"
)

type UserRepositoryDB struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &UserRepositoryDB{db: db}
}

func (r *UserRepositoryDB) Save(user *entities.User) error {
	return nil
}

func (r *UserRepositoryDB) FindByEmail(email string) (*entities.User, error) {
	return nil, nil
}

func (r *UserRepositoryDB) FindTransactionByUserId(id int) ([]*entities.Transaction, error) {
	rows, err := r.db.Query(select_transactions, id)
	if err != nil {
		return nil, err
	}

	var transactions []*entities.Transaction

	for rows.Next() {
		transaction := &entities.Transaction{}
		err := rows.Scan(&transaction)
		if err != nil {
			return nil, err
		}

		transactions = append(transactions, transaction)
	}
	fmt.Println(transactions)
	return transactions, nil
}
