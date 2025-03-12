package main

import (
	"log"
	"northern-bank/config"
	"northern-bank/internal/controllers"
	"northern-bank/internal/repositories"
	"northern-bank/internal/usecases"
	"northern-bank/middleware"

	_ "github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

//var DB *gorm.DB

func main() {
	DB := config.InitDbSql()
	/* 	DB = config.InitDbGorm()

	   	if err := DB.AutoMigrate(&entities.User{}, &entities.Account{}, &entities.Transaction{}, &entities.LoanHistory{}); err != nil {
	   		log.Fatalf("❌ AutoMigrate failed: %v", err)
	   	}

	   	fmt.Println("✅ Tables migrated successfully!")

	   	mockData() */

	userRepo := repositories.NewUserRepository(DB)
	accountRepo := repositories.NewAccountRepository(DB)
	transactionRepo := repositories.NewTransactionRepository(DB)

	userUsecase := usecases.NewUserUsecase(userRepo, accountRepo, transactionRepo)
	accountUsecase := usecases.NewAccountUsecase(accountRepo)

	userController := controllers.NewUserHandler(userUsecase)
	accountController := controllers.NewAccountHandler(&accountUsecase)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173/",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type, Authorization",
		AllowCredentials: true,
	}))

	app.Get("/test", userController.Testing)
	app.Post("/register", userController.Register)
	app.Post("/login", userController.Login)

	app.Get("/check-session", middleware.AuthMiddleware, func(c *fiber.Ctx) error {
		log.Println("Received request to /check-session")
		// ...
		return c.SendString("Session is valid")
	})

	app.Get("/user/:userId", middleware.AuthMiddleware, userController.GetUserById)
	app.Get("/bank-information/:id", middleware.AuthMiddleware, accountController.GetAccountByUserId)
	app.Post("/transfer", middleware.AuthMiddleware, userController.TransferMoney)
	app.Get("/transactions", middleware.AuthMiddleware, userController.GetTransactions)

	if err := app.Listen(":8080"); err != nil {
		log.Fatal(err)
	}

	//! test here
}

/* func mockData() {
	// Clean up existing data
	DB.Exec("DELETE FROM transactions")
	DB.Exec("DELETE FROM accounts")
	DB.Exec("DELETE FROM users")

	// Insert users
	users := []entities.User{
		{IDNumber: "123456789", FirstName: "Alice", LastName: "Smith", Gender: "Female", BirthDay: parseDate("13/05/04"), Address: "123 Main St", PhoneNumber: "0987654321", Email: "alice@gmail.com", Username: "alice", Password: "password123", NumberOfAcc: 1},
		{IDNumber: "987654321", FirstName: "Bob", LastName: "Brown", Gender: "Male", BirthDay: parseDate("25/08/90"), Address: "456 High St", PhoneNumber: "0912345678", Email: "bob@gmail.com", Username: "bob", Password: "password456", NumberOfAcc: 2},
		{IDNumber: "567890123", FirstName: "Charlie", LastName: "Johnson", Gender: "Male", BirthDay: parseDate("10/11/85"), Address: "789 Park Ave", PhoneNumber: "0923456789", Email: "charlie@gmail.com", Username: "charlie", Password: "password789", NumberOfAcc: 1},
	}

	for idx, user := range users {
		if user.Role == "" {
			user.Role = "user"
		}
		result := DB.Create(&user)
		if result.Error != nil {
			log.Fatalf("❌ Failed to insert user: %v", result.Error)
		} else {
			log.Printf("✅ Inserted user: %s with ID: %d\n", user.Username, user.ID)
			users[idx].ID = user.ID
		}
	}

	// Insert accounts using generated user IDs
	accounts := []entities.Account{
		{AccNo: "0673178839", BankCode: "KBANK", Balance: 500.00, UserID: users[0].ID},
		{AccNo: "1234567890", BankCode: "SCB", Balance: 1500.00, UserID: users[1].ID},
		{AccNo: "9876543210", BankCode: "BBL", Balance: 750.00, UserID: users[1].ID},
		{AccNo: "5678901234", BankCode: "TMB", Balance: 2000.00, UserID: users[2].ID},
	}

	for _, account := range accounts {
		result := DB.Create(&account)
		if result.Error != nil {
			log.Fatalf("❌ Failed to insert account: %v", result.Error)
		} else {
			log.Printf("✅ Inserted account: %s\n", account.AccNo)
		}
	}
}

func parseDate(inputDate string) time.Time {
	parsedDate, err := time.Parse("02/01/06", inputDate)
	if err != nil {
		log.Fatalf("❌ Failed to parse date: %v", err)
	}
	return parsedDate
} */
