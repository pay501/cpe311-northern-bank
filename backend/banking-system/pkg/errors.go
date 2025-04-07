package pkg

import "github.com/gofiber/fiber/v2"

type AppError struct {
	Code    int
	Message string
}

func (e AppError) Error() string {
	return e.Message
}

func NewNotFoundError(msg string) error {
	return AppError{
		Code:    fiber.StatusNotFound,
		Message: msg,
	}
}
