package router_test

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/router"
)

func TestRouterHealthz(t *testing.T) {

	r := router.NewRouter()

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		log.Fatalf("expected 200 OK, got %d", w.Code)
	}
}