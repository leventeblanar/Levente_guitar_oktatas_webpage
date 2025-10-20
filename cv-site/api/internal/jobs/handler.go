package jobs

import (
	"net/http"

	"github.com/go-chi/render"
)

type Handler struct {
	Store *Store
}

func NewHandler(store *Store) *Handler {
	return &Handler{Store: store}
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	if h.Store == nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "jobs store not configured"})
		return
	}

	jobs, err := h.Store.List(r.Context())
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": "failed to load jobs"})
		return
	}

	render.JSON(w, r, jobs)
}