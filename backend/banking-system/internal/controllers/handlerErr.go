package controllers

import "github.com/gofiber/fiber/v2"

func handlerErr(c *fiber.Ctx, err error, statusCode int) error {
	c.Status(statusCode)
	return c.Status(statusCode).JSON(fiber.Map{
		"message":     err.Error(),
		"status code": statusCode,
	})
}
