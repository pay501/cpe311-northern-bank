package utils

import (
	"math/big"

	"github.com/google/uuid"
)

func GenerateUUIDAccountNumber() string {
	u := uuid.New()

	num := new(big.Int)
	num.SetBytes(u[:])

	accountNumber := num.Mod(num, big.NewInt(1e10)).String()

	for len(accountNumber) < 10 {
		accountNumber = "0" + accountNumber
	}

	return accountNumber
}
