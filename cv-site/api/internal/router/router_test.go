package router_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/leventeblanar/gitar_oktatos_webpage/api/internal/router"
)

func TestRouterHealthz(t *testing.T) {

	r := router.NewRouter(nil)

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", w.Code)
	}
}
