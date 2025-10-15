package db_test

import (
	"os"
	"testing"

	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/db"
)

func TestDbConnection(t *testing.T) {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "leventeblanar")
	os.Setenv("DB_PASSWORD", "Brutal.shred01")
	os.Setenv("DB_NAME", "cvsite")

	conn, err := db.Open()
	if err != nil {
		t.Fatalf("Failed to connect to db: %v", err)
	}
	defer conn.Close()

	t.Log("Successfully connected to db.")
}