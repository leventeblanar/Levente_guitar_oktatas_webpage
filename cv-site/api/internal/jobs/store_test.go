package jobs_test

import (
	"context"
	"database/sql"
	"os"
	"testing"

	internaldb "github.com/leventeblanar/gitar_oktatos_webpage/api/internal/db"
	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/jobs"
)

// openTestDB bekonfigurálja a környezetet és megnyitja a DB kapcsolatot.
func openTestDB(t *testing.T) *sql.DB {
	t.Helper()

	setDefault := func(key, fallback string) {
		if os.Getenv(key) == "" {
			os.Setenv(key, fallback)
		}
	}
	setDefault("DB_HOST", "localhost")
	setDefault("DB_PORT", "5432")
	setDefault("DB_USER", "leventeblanar")
	setDefault("DB_PASSWORD", "Brutal.shred01")
	setDefault("DB_NAME", "cvsite")

	conn, err := internaldb.Open()
	if err != nil {
		t.Fatalf("failed to open db connection: %v", err)
	}
	return conn
}

func TestStoreList_ReturnsInsertedJob(t *testing.T) {
	db := openTestDB(t)
	t.Cleanup(func() { db.Close() })

	ctx := context.Background()

	// Tisztítás ugyanazzal a kulccsal, hogy ne maradjon szemét adat.
	const company = "Test Company – integration"
	_, _ = db.ExecContext(ctx, `DELETE FROM jobs WHERE company = $1`, company)

	var insertedID int
	err := db.QueryRowContext(ctx, `
		INSERT INTO jobs (
			company, position, from_date, to_date,
			bullet_1, bullet_2,
			tag_1, tag_2
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`,
		company,
		"Backend Developer",
		"2024 Jan",
		"2024 Oct",
		"Built REST APIs in Go",
		"Maintained PostgreSQL schema",
		"Go",
		"Postgres",
	).Scan(&insertedID)
	if err != nil {
		t.Fatalf("insert job failed (ellenőrizd a mezőneveket!): %v", err)
	}

	t.Cleanup(func() {
		_, _ = db.ExecContext(ctx, `DELETE FROM jobs WHERE id = $1`, insertedID)
	})

	store := jobs.NewStore(db)
	records, err := store.List(ctx)
	if err != nil {
		t.Fatalf("store.List returned error: %v", err)
	}

	var found *jobs.Job
	for i := range records {
		if records[i].ID == insertedID {
			found = &records[i]
			break
		}
	}

	if found == nil {
		t.Fatalf("inserted job (id=%d) nem került vissza a lekérdezésben", insertedID)
	}
	if found.Company != company {
		t.Errorf("company mismatch: got %q, want %q", found.Company, company)
	}
	if found.Position != "Backend Developer" {
		t.Errorf("position mismatch: got %q, want %q", found.Position, "Backend Developer")
	}
	if found.Period != "2024 Jan - 2024 Oct" {
		t.Errorf("period mismatch: got %q", found.Period)
	}
	if len(found.Bullets) != 2 {
		t.Fatalf("expected 2 bullets, got %d", len(found.Bullets))
	}
	if found.Bullets[0] != "Built REST APIs in Go" {
		t.Errorf("bullet[0] mismatch: got %q", found.Bullets[0])
	}
}
