package controllers

import (
	"northern-bank/internal/usecases"

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
