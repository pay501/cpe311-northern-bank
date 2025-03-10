package controllers

import (
	"fmt"
	"northern-bank/internal/usecases"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type accountHandler struct {
	accountUsecase usecases.AccountUsecase
}

func NewAccountHandler(accountUsecase usecases.AccountUsecase) accountHandler {
	return accountHandler{accountUsecase: accountUsecase}
}

func (h *accountHandler) GetAccountByUserId(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return handlerErr(c, fmt.Errorf("cannot convert id"), fiber.StatusBadRequest)
	}

	idFromToken := c.Locals("user_id")

	var userID int
	switch v := idFromToken.(type) {
	case int:
		userID = v
	case float64:
		userID = int(v)
	case string:
		parsedID, err := strconv.Atoi(v)
		if err != nil {
			return handlerErr(c, fmt.Errorf("invalid user ID"), fiber.StatusUnauthorized)
		}
		userID = parsedID
	default:
		return handlerErr(c, fmt.Errorf("invalid user ID type"), fiber.StatusUnauthorized)
	}
	if userID != int(id) {
		return handlerErr(c, fmt.Errorf("unauthorized"), fiber.StatusUnauthorized)
	}

	accounts, err := h.accountUsecase.GetAccountByUserId(int(id))
	if err != nil {
		return handlerErr(c, err, fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"accounts": accounts,
	})
}
