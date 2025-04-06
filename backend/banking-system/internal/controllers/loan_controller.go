package controllers

import (
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
