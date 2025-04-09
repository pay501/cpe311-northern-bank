package repositories

import (
	"database/sql"
	"fmt"
	"northern-bank/internal/dto"
	"northern-bank/internal/entities"
	"northern-bank/pkg"
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

func (r *UserRepositoryDB) FindUserById(userId int, userIdFromToken int) (*entities.User, error) {
	user := &entities.User{}

	query := `SELECT id, id_number, first_name, last_name, gender, role, birth_day, address, phone_number, email, number_of_acc FROM users WHERE id = $1;`
	row := r.db.QueryRow(query, userId)

	err := row.Scan(&user.ID, &user.IDNumber, &user.FirstName, &user.LastName, &user.Gender, &user.Role, &user.BirthDay, &user.Address, &user.PhoneNumber, &user.Email, &user.NumberOfAcc)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepositoryDB) Save(req_data *entities.User) (int, error) {
	var insertedId int
	err := r.db.QueryRow(`
		insert into users (id_number, first_name, last_name, birth_day, address, phone_number, email, username, password, number_of_acc, gender, role)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		returning id;
	`, req_data.IDNumber, req_data.FirstName, req_data.LastName, req_data.BirthDay, req_data.Address, req_data.PhoneNumber, req_data.Email, req_data.Username, req_data.Password, req_data.NumberOfAcc, req_data.Gender, req_data.Role).Scan(&insertedId)
	if err != nil {
		return 0, err
	}

	return insertedId, nil
}

// ! I used map method || can be use dto method as well (create dto folder)
func (r *UserRepositoryDB) FindUserByEmailOrUsername(data string) (map[string]interface{}, error) {
	var id int
	var first_name, last_name, email, role, password string

	query := `select id, first_name, last_name, email, role, password from users where email = $1 or username = $1;`
	row := r.db.QueryRow(query, data)
	err := row.Scan(&id, &first_name, &last_name, &email, &role, &password)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("No user found with email or username: %s\n", data)
			return nil, fmt.Errorf("no user found with email or username")
		}
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return nil, err
	}

	user := map[string]interface{}{
		"id":         id,
		"first_name": first_name,
		"last_name":  last_name,
		"email":      email,
		"role":       role,
		"password":   password,
	}

	return user, nil
}

func (r *UserRepositoryDB) FindByEmail(email string) (*entities.User, error) {
	return nil, nil
}

func (r *UserRepositoryDB) UpdateEmail(data *dto.UpdateUserInformation, userId int) (*dto.UpdateUserCredentialRes, error) {
	query := `update users set email = $1 where id = $2;`
	_, err := r.db.Exec(query, data.Email, userId)
	if err != nil {
		return nil, err
	}

	res := dto.UpdateUserCredentialRes{
		Id:         userId,
		Credential: *data.Email,
	}

	return &res, nil
}

func (r *UserRepositoryDB) UpdatePhoneNumber(data *dto.UpdateUserInformation, userId int) (*dto.UpdateUserCredentialRes, error) {

	query := `update users set phone_number = $1 where id = $2;`
	_, err := r.db.Exec(query, data.PhoneNumber, userId)
	if err != nil {
		return nil, err
	}

	res := dto.UpdateUserCredentialRes{
		Id:         userId,
		Credential: *data.PhoneNumber,
	}

	return &res, nil
}

func (r *UserRepositoryDB) UpdatePassword(data *dto.UpdateUserInformation, userId int) error {
	/* 	query := `update users set password = $1 where id = $2;`
	   	_, err := r.db.Exec(query, data.Credential, data.Id)
	   	if err != nil {
	   		return err
	   	} */
	return nil
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
		`, transferReq.FromUserID, transferReq.FromUserAccNo).Scan(&senderId, &senderBalance, &senderAccId)
	if err != nil {
		pkg.GetCallerInfo()
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
		pkg.GetCallerInfo()
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

	var senderExists, receiverExists bool

	// ตรวจสอบ senderId
	err = tx.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, senderId).Scan(&senderExists)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("error checking sender existence: %v", err)
	}

	// ตรวจสอบ receiverId
	err = tx.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, receiverId).Scan(&receiverExists)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("error checking receiver existence: %v", err)
	}

	// ถ้าไม่พบ sender หรือ receiver
	if !receiverExists {
		tx.Rollback()
		return nil, fmt.Errorf("receiver does not exist")
	}
	if !senderExists {
		tx.Rollback()
		return nil, fmt.Errorf("sender does not exist")
	}

	_, err = tx.Exec(`
		insert into transactions (id, from_user_id, to_user_id, amount, created_at, from_user_acc_no, from_user_bank_code, to_user_acc_no, to_user_bank_code)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`, transferReq.ID, senderId, receiverId, transferReq.Amount, transferReq.CreatedAt, transferReq.FromUserAccNo, transferReq.FromUserBankCode, transferReq.ToUserAccNo, transferReq.ToUserBankCode)
	if err != nil {
		pkg.GetCallerInfo()
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	transferRes := &entities.Transaction{
		ID:               transferReq.ID,
		FromUserID:       int(senderId),
		ToUserID:         int(receiverId),
		Amount:           transferReq.Amount,
		FromUserAccNo:    transferReq.FromUserAccNo,
		FromUserBankCode: transferReq.FromUserBankCode,
		ToUserAccNo:      transferReq.ToUserAccNo,
		ToUserBankCode:   transferReq.ToUserBankCode,
	}

	return transferRes, nil
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

func (r *UserRepositoryDB) CheckDuplicateIDNumber(idNumber string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE id_number = $1)"
	err := r.db.QueryRow(query, idNumber).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error checking IDNumber: %v", err)
	}
	return exists, nil
}

func (r *UserRepositoryDB) CheckDuplicatePhoneNumber(phoneNumber string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE phone_number = $1)"
	err := r.db.QueryRow(query, phoneNumber).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error checking PhoneNumber: %v", err)
	}
	return exists, nil
}

func (r *UserRepositoryDB) CheckDuplicateEmail(email string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)"
	err := r.db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error checking Email: %v", err)
	}
	return exists, nil
}

func (r *UserRepositoryDB) CheckDuplicateUsername(username string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)"
	err := r.db.QueryRow(query, username).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error checking Username: %v", err)
	}
	return exists, nil
}

func (r *UserRepositoryDB) CheckAllDuplicates(user *entities.User) (string, error) {
	if exists, err := r.CheckDuplicateIDNumber(user.IDNumber); err != nil {
		return "", err
	} else if exists {
		return "IDNumber is duplicated", nil
	}

	if exists, err := r.CheckDuplicatePhoneNumber(user.PhoneNumber); err != nil {
		return "", err
	} else if exists {
		return "PhoneNumber is duplicated", nil
	}

	if exists, err := r.CheckDuplicateEmail(user.Email); err != nil {
		return "", err
	} else if exists {
		return "Email is duplicated", nil
	}

	if exists, err := r.CheckDuplicateUsername(user.Username); err != nil {
		return "", err
	} else if exists {
		return "Username is duplicated", nil
	}

	return "", nil // No duplicates found
}
