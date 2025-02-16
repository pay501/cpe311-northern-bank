package main

import (
	"fmt"
	"log"
	_ "log"
	"northern-bank/config"
	"northern-bank/internal/entities"
	_ "northern-bank/internal/entities"
	"northern-bank/internal/repositories"
	"northern-bank/internal/usecases"
	_ "time"

	_ "github.com/gin-gonic/gin"
	_ "gorm.io/gorm"
)

// var DB *gorm.DB

func main() {
	DB := config.InitDbSql()
	userRepo := repositories.NewUserRepository(DB)
	_ = usecases.NewUserUsecase(userRepo)
	/* 	DB.AutoMigrate(&entities.User{})
	   	DB.AutoMigrate(&entities.Account{})
	   	DB.AutoMigrate(&entities.Transaction{})
	   	DB.AutoMigrate(&entities.LoanHistory{})

	   	mockData() */

	/* r := gin.Default()

	// Route: GET /
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to Gin!",
		})
	})

	// Start the server with error handling
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	} */
	var users []*entities.User

	rows, err := DB.Query(`select first_Name from users;`)
	if err != nil {
		log.Panicln("Error with select users", err)
	}
	for rows.Next() {
		user := &entities.User{}
		err = rows.Scan(&user.FirstName)
		if err != nil {
			log.Panicln("Error with rows scan", err)
		}
		users = append(users, user)
	}
	for _, v := range users {
		fmt.Println(v.FirstName)
	}

}

/* func mockData() {
	users := []entities.User{
		{ID: 1, IDNumber: "123456789", FirstName: "Alice", LastName: "Smith", Gender: "Female", BirthDay: parseDate("13/05/04"), Address: "123 Main St", PhoneNumber: "0987654321", Email: "alice@gmail.com", Username: "alice", Password: "password123", NumberOfAcc: 1},
		{ID: 2, IDNumber: "987654321", FirstName: "Bob", LastName: "Brown", Gender: "Male", BirthDay: parseDate("25/08/90"), Address: "456 High St", PhoneNumber: "0912345678", Email: "bob@gmail.com", Username: "bob", Password: "password456", NumberOfAcc: 2},
		{ID: 3, IDNumber: "567890123", FirstName: "Charlie", LastName: "Johnson", Gender: "Male", BirthDay: parseDate("10/11/85"), Address: "789 Park Ave", PhoneNumber: "0923456789", Email: "charlie@gmail.com", Username: "charlie", Password: "password789", NumberOfAcc: 1},
	}

	for _, user := range users {
		if user.Role == "" {
			user.Role = "user"
		} else {
			user.Role = "admin"
		}
		result := DB.Create(&user)

		if result.Error != nil {
			log.Println("❌ Failed to insert user:", user.Username, result.Error)
		} else {
			log.Println("✅ Inserted user:", user.Username)
		}
	}

	accounts := []entities.Account{
		{ID: 1, AccNo: "0673178839", BankCode: "KBANK", Balance: 500.00, UserID: 1},
		{ID: 2, AccNo: "1234567890", BankCode: "SCB", Balance: 1500.00, UserID: 2},
		{ID: 3, AccNo: "9876543210", BankCode: "BBL", Balance: 750.00, UserID: 2},
		{ID: 4, AccNo: "5678901234", BankCode: "TMB", Balance: 2000.00, UserID: 3},
	}

	for _, account := range accounts {
		result := DB.Create(&account)
		if result.Error != nil {
			log.Println("❌ Failed to insert account:", account.AccNo, result.Error)
		} else {
			log.Println("✅ Inserted account:", account.AccNo)
		}
	}

	transactions := []entities.Transaction{
		{ID: "abc123", FromUserID: 1, ToUserID: 3, Amount: 500, FromUserAccNo: "0673178839", FromUserBankCode: "KBANK", ToUserAccNo: "5678901234", ToUserBankCode: "TMB"},
	}

	for _, transaction := range transactions {
		reault := DB.Create(&transaction)
		if reault.Error != nil {
			log.Println("❌ Failed to insert account:", reault.Error)
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
