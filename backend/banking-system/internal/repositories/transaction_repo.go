package repositories

import (
	"database/sql"
	"northern-bank/internal/dto"
)

type TransactoionRepositoryDB struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) TransactionRepository {
	return &TransactoionRepositoryDB{
		db: db,
	}
}

func (r *TransactoionRepositoryDB) SaveFirstTransaction(data dto.FirstTransactionReq) error {
	_, err := r.db.Exec(`
		insert into transactions (id, from_user_id, to_user_id, amount, created_at, from_user_acc_no, from_user_bank_code, to_user_acc_no, to_user_bank_code)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`, data.ID, data.FromUserID, data.ToUserID, data.Amount, data.CreatedAt, data.FromUserAccNo, data.FromUserBankCode, data.ToUserAccNo, data.ToUserBankCode)
	if err != nil {
		return err
	}
	return nil
}

func (r *TransactoionRepositoryDB) FindTransactionByUserId(id int) (res []*dto.TransactionRes, err error) {
	query := `
		SELECT id, from_user_id, amount, from_user_acc_no, from_user_bank_code, to_user_acc_no, to_user_bank_code, created_at 
		FROM transactions where from_user_id = $1;
	`
	rows, err := r.db.Query(query, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		transaction := &dto.TransactionRes{}

		err := rows.Scan(&transaction.ID, &transaction.FromUserID, &transaction.Amount, &transaction.FromUserAccNo, &transaction.FromUserBankCode, &transaction.ToUserAccNo, &transaction.ToUserBankCode, &transaction.CreatedAt)
		if err != nil {
			return nil, err
		}

		res = append(res, transaction)
	}

	return res, nil
}
