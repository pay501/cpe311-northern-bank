package controllers

import (
	"fmt"
	"northern-bank/internal/dto"
	"northern-bank/internal/entities"
	"northern-bank/internal/usecases"
	"northern-bank/pkg"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type userHandler struct {
	userUsecase usecases.UserUsecase
}

func NewUserHandler(userUsecase usecases.UserUsecase) userHandler {
	return userHandler{userUsecase: userUsecase}
}

func (h *userHandler) Testing(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Go Clean Architecture's work now!",
	})
}

func (h *userHandler) Register(c *fiber.Ctx) error {

	balance := c.Query("balance", "")

	conBalance, err := strconv.ParseFloat(balance, 64)
	if err != nil {
		return handlerErr(c, fmt.Errorf("cannot convert balance"), fiber.StatusBadRequest)
	}

	if balance == "" || conBalance < 500 {
		return handlerErr(c, fmt.Errorf("balance must more than 500"), fiber.StatusBadRequest)
	}

	req_data := entities.User{}
	err = c.BodyParser(&req_data)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return handlerErr(c, err, fiber.StatusInternalServerError)
	}

	account, err := h.userUsecase.Register(&req_data, conBalance)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return handlerErr(c, err, fiber.StatusInternalServerError)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":     "register successful",
		"status code": fiber.StatusCreated,
		"account":     account,
	})
}

func (h *userHandler) Login(c *fiber.Ctx) error {
	var body_req dto.LoginReq
	if err := c.BodyParser(&body_req); err != nil {
		return handlerErr(c, err, fiber.StatusBadRequest)
	}

	res, err := h.userUsecase.Login(body_req)
	if err != nil {
		return handlerErr(c, err, fiber.StatusUnauthorized)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": res,
	})
}

func (h *userHandler) TransferMoney(c *fiber.Ctx) error {
	transfer_req := dto.TransferReq{}
	err := c.BodyParser(&transfer_req)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return c.JSON(fiber.Map{
			"message":     err.Error(),
			"status code": fiber.StatusBadRequest,
		})
	}

	transaction, err := h.userUsecase.Transfer(transfer_req)
	if err != nil {
		fmt.Printf("Error on %v => %v\n", pkg.GetCallerInfo(), err)
		return c.JSON(fiber.Map{
			"message":     err.Error(),
			"status code": fiber.StatusInternalServerError,
		})
	}

	return c.JSON(fiber.Map{
		"message":     "transfer successful",
		"status code": fiber.StatusOK,
		"transaction": transaction,
	})
}

func (h *userHandler) GetTransactions(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return handlerErr(c, fmt.Errorf("missing user ID"), fiber.StatusUnauthorized)
	}

	userIDInt, ok := userID.(float64)
	if !ok {
		return handlerErr(c, fmt.Errorf("invalid user ID format"), fiber.StatusUnauthorized)
	}

	transactions, err := h.userUsecase.Transactions(int(userIDInt))
	if err != nil {
		// if strings.Contains(err.Error(), "no transactios found")
		if err.Error() == "no transactions found" {
			return handlerErr(c, err, fiber.StatusNotFound)
		} else {
			return handlerErr(c, err, fiber.StatusInternalServerError)
		}
	}

	return c.JSON(fiber.Map{
		"result": transactions,
	})
}

func (h *userHandler) GetUserById(c *fiber.Ctx) error {
	userIdFromToken := c.Locals("user_id")
	userIdFromTokenInt, ok := userIdFromToken.(float64)
	fmt.Print(userIdFromToken)
	if !ok {
		return handlerErr(c, fmt.Errorf("cannot convert userIdFromToken"), fiber.StatusBadRequest)
	}

	userIdFromParam := c.Params("userId")
	userIdFromParamInt, err := strconv.ParseInt(userIdFromParam, 10, 64)
	if err != nil {
		return handlerErr(c, fmt.Errorf("cannot convert userIdFromParam"), fiber.StatusBadRequest)
	}

	if int(userIdFromParamInt) != int(userIdFromTokenInt) {
		return handlerErr(c, fmt.Errorf("unauthorized"), fiber.StatusUnauthorized)
	}

	user, err := h.userUsecase.SelectUserById(int(userIdFromParamInt), int(userIdFromTokenInt))
	if err != nil {
		return handlerErr(c, err, fiber.StatusInternalServerError)
	}
	return c.Status(200).JSON(fiber.Map{
		"user": user,
	})
}
