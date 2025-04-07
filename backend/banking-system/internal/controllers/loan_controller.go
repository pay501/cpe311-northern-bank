package controllers

import (
	"fmt"
	"northern-bank/internal/usecases"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type LoanHandler struct {
	loanUsecase usecases.LoanUsecase
}

func NewLoanHandler(loanUsecase usecases.LoanUsecase) *LoanHandler {
	return &LoanHandler{loanUsecase: loanUsecase}
}

func (h *LoanHandler) GetLoanReqHistories(c *fiber.Ctx) error {
	loanReqHistories, err := h.loanUsecase.GetLoanHistories()
	if err != nil {
		return handlerErr(c, err, fiber.StatusInternalServerError)
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"result": loanReqHistories,
	})
}

func (h *LoanHandler) GetLoanReqHistoryByUserId(c *fiber.Ctx) error {
	userIdFromParam := c.Params("id")
	intUserIdFromParam, err := strconv.ParseInt(userIdFromParam, 10, 64)
	if err != nil {
		return handlerErr(c, err, 400)
	}

	userIdFromToken := c.Locals("user_id")
	intUserIdFromToken, ok := userIdFromToken.(float64)
	if !ok {
		fmt.Println(intUserIdFromToken)
		return handlerErr(c, fmt.Errorf("invalid user ID from token"), 400)
	}

	if intUserIdFromParam != int64(intUserIdFromToken) {
		return handlerErr(c, fmt.Errorf("unauthorized access"), 401)
	}

	result, err := h.loanUsecase.GetLoanHistoryByUserId(int(intUserIdFromParam))
	if err != nil {
		return handlerErrs(c, err)
	}

	return c.Status(200).JSON(fiber.Map{
		"result": result,
	})
}

func (h *LoanHandler) UpdateLoanResult(c *fiber.Ctx) error {
	id := c.Params("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Id"})
	}

	var body struct {
		Result int `json:"result"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid body"})
	}

	err = h.loanUsecase.UpdateLoanResult(body.Result, int(idInt))
	if err != nil {
		return handlerErr(c, err, fiber.StatusInternalServerError)
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"result": "updated",
	})
}
