package templates

import (
	"bytes"
	"html/template"
	"net/http"
)

var tmpl = template.Must(
	template.ParseGlob("web/templates/*.html"),
) 

func Render(w http.ResponseWriter, name string, data any) {
	var buf bytes.Buffer
	err := tmpl.ExecuteTemplate(&buf, name, data)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.Write(buf.Bytes())
}