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

func (r *UserRepositoryDB) SelectUsers() ([]*entities.User, error) {
	rows, err := r.db.Query(select_users)
	if err != nil {
		return nil, err
	}

	users := []*entities.User{}
	for rows.Next() {
		user := entities.User{}
		err = rows.Scan(&user.ID, &user.FirstName, &user.Role, &user.Email)
		if err != nil {
			return nil, err
		}
		fmt.Printf("Print user from user_repo.go at line 30 User: %v", user)
		users = append(users, &user)
	}
	return users, nil
}

func (r *UserRepositoryDB) Save(user *entities.User) error {
	return nil
}

func (r *UserRepositoryDB) FindByEmail(email string) (*entities.User, error) {
	return nil, nil
}

func (r *UserRepositoryDB) TransferMoney(transferReq *entities.Transaction) (*entities.Transaction, error) {
	// Begin transaction
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	var senderBalance float64
	var senderAccId int64
	var senderId int64

	err = tx.QueryRow(`
        SELECT u.id, a.balance, a.acc_id
        FROM users u
        INNER JOIN accounts a ON u.id = a.user_id
        WHERE u.id = $1 and a.acc_no = $2;
		`, transferReq.FromUserID, transferReq.FromUserAccNo).Scan(&senderAccId, &senderBalance, &senderId)
	if err != nil {
		fmt.Printf("Error on user_repo.go at line 67: %v", err)
		return nil, err
	}

	if senderBalance < transferReq.Amount || transferReq.Amount <= 0 {
		fmt.Printf("senderBalace: %v, transfer amount: %v\n", senderBalance, transferReq.Amount)
		return nil, fmt.Errorf("insufficient funds")
	}

	var receiverId int64

	err = tx.QueryRow(`
        SELECT u.id
        FROM users u
        INNER JOIN accounts a ON u.id = a.user_id
        WHERE a.acc_no = $1 and a.bank_code = $2;
		`, transferReq.ToUserAccNo, transferReq.ToUserBankCode).Scan(&receiverId)
	if err != nil {
		fmt.Printf("Error on user_repo.go at line 85: %v", err)
		return nil, err
	}

	_, err = tx.Exec(`
		update accounts 
		set balance = balance - $1
		where acc_id = $2;
	`, transferReq.Amount, senderAccId)
	if err != nil {
		fmt.Printf("Error on user_repo.go at line 95: %v\n", err)
		return nil, err
	}

	_, err = tx.Exec(`
		update accounts 
		set balance = balance + $1
		where acc_no = $2 and bank_code = $3;
	`, transferReq.Amount, transferReq.ToUserAccNo, transferReq.ToUserBankCode)
	if err != nil {
		fmt.Printf("Error on user_repo.go at line 104: %v\n", err)
		return nil, err
	}

	_, err = tx.Exec(`
		insert into transactions (id, from_user_id, to_user_id, amount, created_at, from_user_acc_no, from_user_bank_code, to_user_acc_no, to_user_bank_code)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`, transferReq.ID, senderId, receiverId, transferReq.Amount, transferReq.CreatedAt, transferReq.FromUserAccNo, transferReq.FromUserBankCode, transferReq.ToUserAccNo, transferReq.ToUserBankCode)
	if err != nil {
		fmt.Printf("Error on user_repo.go at line 114: %v\n", err)
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return transferReq, nil
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
