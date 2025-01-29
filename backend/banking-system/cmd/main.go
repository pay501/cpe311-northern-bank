package main

import (
	"fmt"
	"log"
	"northern-bank/internal/entities"
	"os"
	"time"

	_ "github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	host     = "localhost"     // or the Docker service name if running in another container
	port     = 5432            // default PostgreSQL port
	user     = "admin"         // as defined in docker-compose.yml
	password = "password"      // as defined in docker-compose.yml
	dbname   = "northern-bank" // as defined in docker-compose.yml
)

var DB *gorm.DB

func main() {
	dsn := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
		DryRun: true,
	})

	if err != nil {
		panic(err)
	}

	DB.AutoMigrate(&entities.User{})
	DB.AutoMigrate(&entities.Account{})

	mockData()

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
}

var newLogger = logger.New(
	log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
	logger.Config{
		SlowThreshold: time.Second, // Slow SQL threshold
		LogLevel:      logger.Info, // Log level
		Colorful:      true,        // Disable color
	},
)

func mockData() {
	users := []entities.User{
		{UserID: 1, IDNumber: "123456789", FirstName: "Alice", LastName: "Smith", BirthDay: parseDate("13/05/04"), Address: "123 Main St", PhoneNumber: "0987654321", Email: "alice@gmail.com", Username: "alice", Password: "password123", NumberOfAcc: 1},
		{UserID: 2, IDNumber: "987654321", FirstName: "Bob", LastName: "Brown", BirthDay: parseDate("25/08/90"), Address: "456 High St", PhoneNumber: "0912345678", Email: "bob@gmail.com", Username: "bob", Password: "password456", NumberOfAcc: 2},
		{UserID: 3, IDNumber: "567890123", FirstName: "Charlie", LastName: "Johnson", BirthDay: parseDate("10/11/85"), Address: "789 Park Ave", PhoneNumber: "0923456789", Email: "charlie@gmail.com", Username: "charlie", Password: "password789", NumberOfAcc: 1},
	}

	for _, user := range users {
		result := DB.Create(&user)

		if result.Error != nil {
			log.Println("❌ Failed to insert user:", user.Username, result.Error)
		} else {
			log.Println("✅ Inserted user:", user.Username)
		}
	}

	accounts := []entities.Account{
		{AccID: 1, AccNo: "0673178839", BankCode: "KBANK", Balance: 500.00, UserID: 1},
		{AccID: 2, AccNo: "1234567890", BankCode: "SCB", Balance: 1500.00, UserID: 2},
		{AccID: 3, AccNo: "9876543210", BankCode: "BBL", Balance: 750.00, UserID: 2},
		{AccID: 4, AccNo: "5678901234", BankCode: "TMB", Balance: 2000.00, UserID: 3},
	}

	for _, account := range accounts {
		result := DB.Create(&account)
		if result.Error != nil {
			log.Println("❌ Failed to insert account:", account.AccNo, result.Error)
		} else {
			log.Println("✅ Inserted account:", account.AccNo)
		}
	}
}

func parseDate(inputDate string) time.Time {
	parsedDate, err := time.Parse("02/01/06", inputDate)
	if err != nil {
		log.Fatalf("❌ Failed to parse date: %v", err)
	}
	return parsedDate
}
