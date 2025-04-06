package repositories

import (
	"database/sql"
	"northern-bank/internal/dto"
)

type LoanRepositoryDB struct {
	db *sql.DB
}

func NewLoanRepository(db *sql.DB) *LoanRepositoryDB {
	return &LoanRepositoryDB{db: db}
}

func (r *LoanRepositoryDB) FindLoanHistories() ([]*dto.LoanHistoryRes, error) {
	query := `SELECT id, status, gender, married, dependents, education, self_employed, applicant_income, coapplicant_income, loan_amount, loan_amount_term, property_area, user_id, result, credit_history FROM loan_histories;`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var loanHistories []*dto.LoanHistoryRes

	for rows.Next() {
		loan := &dto.LoanHistoryRes{}
		err := rows.Scan(
			&loan.ID,
			&loan.Status,
			&loan.Gender,
			&loan.Married,
			&loan.Dependents,
			&loan.Education,
			&loan.SelfEmployed,
			&loan.ApplicantIncome,
			&loan.CoapplicantIncome,
			&loan.LoanAmount,
			&loan.LoanAmountTerm,
			&loan.PropertyArea,
			&loan.UserID,
			&loan.Result,
			&loan.CreditHistory,
		)
		if err != nil {
			return nil, err
		}
		loanHistories = append(loanHistories, loan)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return loanHistories, nil
}

func (r *LoanRepositoryDB) UpdateLoanResult(result int, id int) error {
	query := `UPDATE loan_histories SET result=$1 WHERE id=$2;`
	_, err := r.db.Exec(query, result, id)
	if err != nil {
		return err
	}
	return nil
}
