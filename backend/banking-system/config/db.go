package config

import (
	"fmt"
	"log"
	"os"
	"time"

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

func InitDB() *gorm.DB {
	dsn := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
		DryRun: true,
	})

	if err != nil {
		panic(err)
	}
	return DB
}

var newLogger = logger.New(
	log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
	logger.Config{
		SlowThreshold: time.Second, // Slow SQL threshold
		LogLevel:      logger.Info, // Log level
		Colorful:      true,        // Disable color
	},
)
