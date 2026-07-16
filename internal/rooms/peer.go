package rooms

import "github.com/gorilla/websocket"

type Peer struct {
	ID string

	Conn *websocket.Conn
}