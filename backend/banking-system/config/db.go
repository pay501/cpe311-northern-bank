package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
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

func InitDbGorm() *gorm.DB {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
		DryRun: false,
	})

	if err != nil {
		panic(fmt.Sprintf("❌ Failed to connect to DB: %v", err))
	}

	// Ping the database
	sqlDB, err := DB.DB()
	if err != nil {
		panic(fmt.Sprintf("❌ Failed to get DB instance: %v", err))
	}

	if err := sqlDB.Ping(); err != nil {
		panic(fmt.Sprintf("❌ Database ping failed: %v", err))
	}

	fmt.Println("✅ Database connected successfully!")
	return DB
}

func InitDbSql() *sql.DB {
	dsn := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	DB, err := sql.Open("postgres", dsn)

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
