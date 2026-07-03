package templates

import (
	"html/template"
	"net/http"
)

var tmpl = template.Must(
	template.ParseGlob("web/templates/*.html"),
) 

func Render(w http.ResponseWriter, name string, data any) {
	err := tmpl.ExecuteTemplate(w, name, data)

	if err != nil {
		http.Error(w, err.Error(), 500)

		return
	}
}