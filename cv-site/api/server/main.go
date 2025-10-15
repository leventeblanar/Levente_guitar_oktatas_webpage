package main

import (
	"fmt"
	"log"
	"os"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/router"
)

func main() {

	_ = godotenv.Load()

	port := os.Getenv("API_PORT")
}