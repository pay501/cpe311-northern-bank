package controllers

import (
	"fmt"
	"northern-bank/internal/usecases"

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

func (h *userHandler) Login(c *fiber.Ctx) error {
	return nil
}

func (h *userHandler) TransferMoney(c *fiber.Ctx) error {
	transfer_req := usecases.TransferReq{}
	err := c.BodyParser(&transfer_req)
	if err != nil {
		fmt.Printf("Error on user_controller.go at line 31: %v", err)
		return c.JSON(fiber.Map{
			"message":     "bad request",
			"status code": fiber.StatusBadRequest,
		})
	}

	transaction, err := h.userUsecase.Transfer(transfer_req)
	if err != nil {
		fmt.Printf("Error on user_controller.go at line 39: %v \n", err)
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
