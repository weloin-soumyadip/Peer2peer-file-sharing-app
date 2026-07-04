package rooms

import (
	"errors"
	"sync"
	"time"
)

const MaxPeer = 2;

var (
	ErrRoomFull = errors.New("Room is full!")
	ErrPeerExists = errors.New("Peer already exists")
)

type Room struct {
	ID string
	CreatedAt time.Time
	mu sync.RWMutex
	Peers map[string]*Peer
}

// add peer
func (r *Room) AddPeer(peer *Peer) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if len(r.Peers) >= MaxPeer {
		return ErrRoomFull
	}

	if _, ok := r.Peers[peer.ID]; ok {
		return ErrPeerExists
	}

	r.Peers[peer.ID] = peer
	return nil
}

// remove peer
func (r *Room) RemovePeer(peerID string)  {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.Peers, peerID)
}

// peer count
func (r *Room) Count() int {
	r.mu.Lock()
	defer r.mu.RUnlock()

	return len(r.Peers)
}

// is empty
func (r *Room) Empty() bool {
	return r.Count() == 0
}