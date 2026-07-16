package websocket

import "encoding/json"

type Message struct {
	Type string 			`json:"type"`
	From string 			`json:"from"`
	Data json.RawMessage	`json:"data"`
}