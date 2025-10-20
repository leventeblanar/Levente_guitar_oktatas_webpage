package jobs

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
)

// --------------------------
//		STRUCTS
// --------------------------
type Store struct {
	db *sql.DB
}

type JobRecord struct {
	ID			int
	Company		string
	Position	string
	FromDate	string
	ToDate		string
	Bullet1		string
	Bullet2		string
	Bullet3		string
	Bullet4		string
	Bullet5		string
	Tag1		string
	Tag2		string
	Tag3		string
	Tag4		string
	Tag5		string
}

// --------------------------
//		HELPERS
// --------------------------

func collectNonEmpty(values ...string) []string {
	var out []string
	for _, v := range values {
		v = strings.TrimSpace(v)
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}



const listQuery =	`
	SELECT
		id,
		company,
		position,
		from_date,
		to_date,
		COALESCE(bullet_1, ''),
		COALESCE(bullet_2, ''),
		COALESCE(bullet_3, ''),
		COALESCE(bullet_4, ''),
		COALESCE(bullet_5, ''),
		COALESCE(tag_1, ''),
		COALESCE(tag_2, ''),
		COALESCE(tag_3, ''),
		COALESCE(tag_4, ''),
		COALESCE(tag_5, '')
	FROM jobs
	ORDER BY id DESC;
`




func (s *Store) List(ctx context.Context) ([]Job, error) {
	rows, err := s.db.QueryContext(ctx, listQuery)
	if err != nil {
		return nil, fmt.Errorf("query jobs: %w", err)
	}
	defer rows.Close()

	var jobs []Job
	for rows.Next() {
		var rec JobRecord
		if err := rows.Scan(
			&rec.ID,
			&rec.Company,
			&rec.Position,
			&rec.FromDate,
			&rec.ToDate,
			&rec.Bullet1,
			&rec.Bullet2,
			&rec.Bullet3,
			&rec.Bullet4,
			&rec.Bullet5,
			&rec.Tag1,
			&rec.Tag2,
			&rec.Tag3,
			&rec.Tag4,
			&rec.Tag5,
		); err != nil {
			return nil, fmt.Errorf("scan job row: %w", err)
		}
		jobs = append(jobs, rec.toJob())
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate job rows: %w", err)
	}

	return jobs, nil
}

func (r JobRecord) toJob() Job {
	bullets := collectNonEmpty(r.Bullet1, r.Bullet2, r.Bullet3, r.Bullet4, r.Bullet5)
	tags := collectNonEmpty(r.Tag1, r.Tag2, r.Tag3, r.Tag4, r.Tag5)

	period := strings.TrimSpace(strings.Join(collectNonEmpty(r.FromDate, r.ToDate), " - "))
	if period == "" {
		period = strings.TrimSpace(r.FromDate + r.ToDate)
	}

	job := Job {
		ID: 		r.ID,
		Company: 	r.Company,
		Position: 	r.Position,
		Period: 	period,	
		Bullets: 	bullets,
	}
	if len(tags) > 0 {
		job.Tags = tags
	}

	return job
}