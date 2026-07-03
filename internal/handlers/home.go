package handlers

import (
    "net/http"
    "Peer2peer-file-sharing-app/internal/templates"
)

// Home handles request for the home page
func Home(w http.ResponseWriter, r *http.Request) {
    templates.Render(w, "home.html", nil)
}
