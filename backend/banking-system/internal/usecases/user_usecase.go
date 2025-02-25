package usecases

import (
	"errors"
	"fmt"
	"math/big"
	"northern-bank/internal/dto"
	"northern-bank/internal/entities"
	"northern-bank/internal/repositories"
	"northern-bank/internal/utils"
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
	}
	req_data.Password = string(hashedPassword)

	if req_data.Role == "" {
		req_data.Role = "user"
	}
	//todo save user data
	savedId, err := u.userRepo.Save(req_data)
	if err != nil {
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
		return nil, err
	}

	return account, nil
}

func (u *UserUsecaseDb) Login(data dto.LoginReq) (string, error) {
	user, err := u.userRepo.FindUserByEmailOrUsername(data.Email)
	if err != nil {
		return "", fmt.Errorf("invalid email/username or password")
	}

	password := user["password"].(string)
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(data.Password))
	if err != nil {
		return "", fmt.Errorf("invalid email/username or password")
	}

	userIdInt, ok := user["id"].(int)
	if !ok {
		fmt.Printf("Error on %v => %v", pkg.GetCallerInfo(), err)
		return "", err
	}

	userId := uint(userIdInt)
	user_role := user["role"].(string)
	token, err := utils.GenerateJWT(userId, user_role)
	if err != nil {
		fmt.Printf("Error on %v => %v", pkg.GetCallerInfo(), err)
		return "", fmt.Errorf("failed to generate token: %v", err)
	}

	return token, nil
}

func (u *UserUsecaseDb) Transfer(req_data dto.TransferReq) (*entities.Transaction, error) {
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
