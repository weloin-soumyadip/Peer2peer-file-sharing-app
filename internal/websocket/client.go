package websocket

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	PeerID string
	RoomID string
	
	Conn *websocket.Conn
	Send chan Message
}

func (c *Client) ReadPump() {
	defer c.Conn.Close()

	for {
		var msg Message

		if err := c.Conn.ReadJSON(&msg); err != nil {
			break
		}

		// forward later
	}
}

func (c *Client) WritePump() {
	defer c.Conn.Close()

	for msg := range c.Send {
		if err := c.Conn.WriteJSON(msg); err != nil {
			return
		}
	}
}