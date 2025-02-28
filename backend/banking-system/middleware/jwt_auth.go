package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("secretKey")

func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")

	//todo เช็คว่ามี Authorization Header
	if authHeader == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing Authorization header",
		})
	}

	//todo แยก Bearer <token>
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid Authorization header format",
		})
	}

	tokenString := parts[1]

	//todo check jwt token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"]
		role := claims["role"]
		exp := int64(claims["exp"].(float64))

		if time.Now().Unix() > exp {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Token has expired",
			})
		}

		c.Locals("user_id", userID)
		c.Locals("role", role)

		return c.Next()
	}

	return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
		"error": "Invalid token claims",
	})
}
