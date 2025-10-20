package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/db"
	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/router"
)

func main() {

	_ = godotenv.Load()

	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	dbConn, err := db.Open()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	r := router.NewRouter(dbConn)

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Server running on http://localhost%s", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
