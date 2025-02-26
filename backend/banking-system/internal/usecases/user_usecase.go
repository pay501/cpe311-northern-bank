package usecases

import (
	"errors"
	"fmt"
	"math/big"
	"northern-bank/internal/entities"
	"northern-bank/internal/repositories"
	"northern-bank/pkg"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecaseDb struct {
	userRepo    repositories.UserRepository
	accountRepo repositories.AccountRepository
}

func NewUserUsecase(userRepo repositories.UserRepository, accountRepo repositories.AccountRepository) *UserUsecaseDb {
	return &UserUsecaseDb{
		userRepo:    userRepo,
		accountRepo: accountRepo,
	}
}

func (u *UserUsecaseDb) Register(req_data *entities.User, balance float64) (*entities.Account, error) {
	//todo Check Duplicate data
	isDataDuplicated, err := u.userRepo.CheckAllDuplicates(req_data)
	if err != nil {
		return nil, err
	}
	if isDataDuplicated != "" {
		return nil, errors.New(isDataDuplicated)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req_data.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
	}
	req_data.Password = string(hashedPassword)

	if req_data.Role == "" {
		req_data.Role = "user"
	}
	//todo save user data
	savedId, err := u.userRepo.Save(req_data)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return nil, err
	}

	//todo account
	acc_data := entities.Account{
		UserID:   uint(savedId),
		AccNo:    generateUUIDAccountNumber(),
		BankCode: "NTHBANK",
		Balance:  balance,
	}

	account, err := u.accountRepo.CreateAccount(&acc_data)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return nil, err
	}

	return account, nil
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

func generateUUIDAccountNumber() string {
	u := uuid.New()

	num := new(big.Int)
	num.SetBytes(u[:])

	accountNumber := num.Mod(num, big.NewInt(1e10)).String()

	for len(accountNumber) < 10 {
		accountNumber = "0" + accountNumber
	}

	return accountNumber
}
