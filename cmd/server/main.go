package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"

	"Peer2peer-file-sharing-app/internal/handlers"
)

func main() {
	r := chi.NewRouter()

	// Serve static files from public directory
	r.Handle("/static/*", http.StripPrefix("/static/",
		http.FileServer(http.Dir("web/static"))))

	r.Get("/", handlers.Home)

	log.Println("Server started on :8080")

	http.ListenAndServe(":8080", r)
}