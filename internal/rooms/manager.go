package rooms

import (
	"sync"
	"time"
	"github.com/google/uuid"
)

type Manager struct {
	mu sync.RWMutex

	rooms map[string]*Room
}

func NewManager () *Manager {
	return &Manager{
		rooms: make(map[string]*Room),
	}
}

// create room
func (m *Manager) CreateRoom() *Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	id := uuid.NewString()[:8]

	room := &Room{
		ID: id,
		CreatedAt: time.Now(),
		Peers: make(map[string]*Peer),
	}

	m.rooms[id] = room

	return room
}

// get room
func (m *Manager) GetRoom(id string) (*Room, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	room, ok := m.rooms[id]

	return room, ok
}

// delete room
func (m *Manager) DeleteRoom(id string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.rooms, id)
}