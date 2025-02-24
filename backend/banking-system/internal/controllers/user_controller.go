package controllers

import (
	"fmt"
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

	return c.JSON(fiber.Map{
		"message":     "register successful",
		"status code": fiber.StatusCreated,
		"account":     account,
	})
}

func (h *userHandler) Login(c *fiber.Ctx) error {
	return nil
}

func (h *userHandler) TransferMoney(c *fiber.Ctx) error {
	transfer_req := usecases.TransferReq{}
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
