package middleware

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func AdminMiddleware(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role != "admin" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied: Admins only",
		})
	}
	return c.Next()
}
