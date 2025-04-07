package controllers

import (
	"northern-bank/pkg"

	"github.com/gofiber/fiber/v2"
)

func handlerErr(c *fiber.Ctx, err error, statusCode int) error {
	c.Status(statusCode)
	return c.Status(statusCode).JSON(fiber.Map{
		"message":     err.Error(),
		"status code": statusCode,
	})
}

func handlerErrs(c *fiber.Ctx, err error) error {
	switch e := err.(type) {
	case pkg.AppError:
		return c.Status(e.Code).JSON(fiber.Map{
			"error": e.Message,
		})
	case error:
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": e.Error(),
		})
	}

	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": err,
	})
}
