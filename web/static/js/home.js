document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const landingState = document.getElementById('landing-state');
  const roomState = document.getElementById('room-state');
  
  const createBtn = document.getElementById('create');
  const joinBtn = document.getElementById('join');
  const roomInput = document.getElementById('room');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSlider = document.querySelector('.tab-slider');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  const leaveRoomBtn = document.getElementById('leave-room-btn');
  const activeRoomId = document.getElementById('active-room-id');
  const shareUrlInput = document.getElementById('share-url-input');
  
  const copyIdBtn = document.getElementById('copy-id-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const transfersList = document.getElementById('transfers-list');
  const transfersCount = document.getElementById('transfers-count');
  const peerList = document.getElementById('peer-list');
  const roomStatusText = document.getElementById('room-status-text');

  // --- Mock State Variables ---
  let isRoomCreator = false;
  let currentRoomId = '';
  let activeTransfers = 0;
  let fileQueue = [];

  // --- 1. Hero Live Demo Animation Loop ---
  const demoSpeedEl = document.getElementById('demo-speed');
  const demoFileEl = document.getElementById('demo-filename');
  
  const demoFiles = [
    { name: 'vacation_album.zip', size: '245 MB' },
    { name: 'production_database_v3.sql', size: '1.2 GB' },
    { name: 'marketing_pitch_final.pdf', size: '18.4 MB' },
    { name: '4k_drone_footage.mp4', size: '890 MB' }
  ];
  let demoIndex = 0;

  function updateHeroDemo() {
    if (!demoSpeedEl || !demoFileEl) return;
    
    // Cycle files
    const file = demoFiles[demoIndex];
    demoFileEl.textContent = `${file.name} (${file.size})`;
    demoIndex = (demoIndex + 1) % demoFiles.length;

    // Simulate varying speed
    const mockSpeed = (35 + Math.random() * 20).toFixed(1);
    demoSpeedEl.textContent = `${mockSpeed} MB/s`;
  }
  
  // Update hero stats every 4.5 seconds
  setInterval(updateHeroDemo, 4500);
  updateHeroDemo();

  // --- 2. Action Tab Slider Navigation ---
  function updateTabSlider() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && tabSlider) {
      tabSlider.style.width = `${activeTab.offsetWidth}px`;
      tabSlider.style.left = `${activeTab.offsetLeft}px`;
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetPanel = btn.getAttribute('data-tab');
      tabPanels.forEach(panel => {
        if (panel.id === targetPanel) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
      
      updateTabSlider();
    });
  });

  // Initialize Slider position on load and resize
  updateTabSlider();
  window.addEventListener('resize', updateTabSlider);

  // --- 3. Room Management Logic ---

  // Generate random room ID (e.g. p2p-xxxx-xxxx)
  function generateRoomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let block1 = '';
    let block2 = '';
    for (let i = 0; i < 4; i++) {
      block1 += chars.charAt(Math.floor(Math.random() * chars.length));
      block2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `p2p-${block1}-${block2}`;
  }

  function showRoomState(roomId, creator = false) {
    currentRoomId = roomId;
    isRoomCreator = creator;

    // Set UI displays
    activeRoomId.textContent = roomId;
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    shareUrlInput.value = shareUrl;

    // Update URL query parameters without reloading
    window.history.pushState({ room: roomId }, '', `?room=${roomId}`);

    // Transition States
    landingState.classList.remove('active');
    setTimeout(() => {
      landingState.style.display = 'none';
      roomState.style.display = 'block';
      setTimeout(() => {
        roomState.classList.add('active');
      }, 50);
    }, 400);

    // Simulate connections based on who joined
    simulatePeerConnection();
  }

  function simulatePeerConnection() {
    // Empty Peer state first
    peerList.innerHTML = '';
    roomStatusText.textContent = 'Room Active - Waiting for peers';

    if (isRoomCreator) {
      // Host: Wait a few seconds then simulate peer joining
      peerList.innerHTML = `
        <div class="peer-item empty">
          <div class="peer-avatar-placeholder">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="peer-info">
            <p class="peer-name">Waiting for peer...</p>
            <p class="peer-status">Share invite code above to connect</p>
          </div>
        </div>
      `;

      setTimeout(() => {
        if (currentRoomId === '') return; // Guard in case user left early
        peerList.innerHTML = `
          <div class="peer-item connected">
            <div class="peer-avatar-placeholder">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="peer-info">
              <p class="peer-name">Peer-2648 (Connected)</p>
              <p class="peer-status">Direct WebRTC Data Connection Active</p>
            </div>
          </div>
        `;
        roomStatusText.textContent = 'Room Active - Connected';
        showToast('Peer connected to room!');
      }, 5000);
    } else {
      // Guest: Immediately simulate connecting to Host
      peerList.innerHTML = `
        <div class="peer-item empty">
          <div class="peer-avatar-placeholder">
            <svg viewBox="0 0 24 24" width="16" height="16" class="spinning" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
          </div>
          <div class="peer-info">
            <p class="peer-name">Connecting...</p>
            <p class="peer-status">Establishing WebRTC Handshake</p>
          </div>
        </div>
      `;

      setTimeout(() => {
        if (currentRoomId === '') return;
        peerList.innerHTML = `
          <div class="peer-item connected">
            <div class="peer-avatar-placeholder">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="peer-info">
              <p class="peer-name">Room Host (Connected)</p>
              <p class="peer-status">Direct WebRTC Data Connection Active</p>
            </div>
          </div>
        `;
        roomStatusText.textContent = 'Room Active - Connected';
        showToast('Connected to Room Host!');
      }, 2000);
    }
  }

  // --- Buttons Event Handlers ---

  createBtn.addEventListener('click', () => {
    const newId = generateRoomId();
    showRoomState(newId, true);
  });

  joinBtn.addEventListener('click', () => {
    const id = roomInput.value.trim();
    if (!id) {
      roomInput.style.borderColor = 'var(--accent-red)';
      roomInput.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.2)';
      setTimeout(() => {
        roomInput.style.borderColor = '';
        roomInput.style.boxShadow = '';
      }, 2000);
      return;
    }
    // Support parsing complete URLs pasted into input
    let cleanId = id;
    if (id.includes('?room=')) {
      cleanId = id.split('?room=')[1];
    }
    showRoomState(cleanId, false);
  });

  leaveRoomBtn.addEventListener('click', () => {
    currentRoomId = '';
    isRoomCreator = false;
    roomInput.value = '';
    
    // Clear URL parameter
    window.history.pushState({}, '', window.location.pathname);

    // Clear queue files
    fileQueue = [];
    activeTransfers = 0;
    updateTransfersUI();

    // Transition States back
    roomState.classList.remove('active');
    setTimeout(() => {
      roomState.style.display = 'none';
      landingState.style.display = 'block';
      setTimeout(() => {
        landingState.classList.add('active');
        updateTabSlider();
      }, 50);
    }, 400);
  });

  // --- 4. Copy Widgets Functionality ---

  function triggerCopyVisuals(btn) {
    const copyIcon = btn.querySelector('.copy-icon');
    const checkIcon = btn.querySelector('.check-icon');
    
    if (copyIcon && checkIcon) {
      copyIcon.classList.add('hidden');
      checkIcon.classList.remove('hidden');
      
      setTimeout(() => {
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
      }, 2000);
    }
  }

  copyIdBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentRoomId)
      .then(() => {
        triggerCopyVisuals(copyIdBtn);
        showToast('Room ID copied to clipboard!');
      })
      .catch(err => console.error('Failed to copy: ', err));
  });

  copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrlInput.value)
      .then(() => {
        showToast('Sharing link copied!');
      })
      .catch(err => console.error('Failed to copy link: ', err));
  });

  // --- 5. Drag & Drop Upload Simulator ---

  // Trigger select file click
  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    handleSelectedFiles(e.target.files);
  });

  // Drag listeners
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleSelectedFiles(files);
  }, false);

  function handleSelectedFiles(files) {
    if (files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      addFileToQueue(file);
    }
    
    // Clear input
    fileInput.value = '';
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    // Archive
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return {
        color: 'var(--accent-purple)',
        svg: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 9h18M3 15h18"/></svg>`
      };
    }
    // Image
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return {
        color: 'var(--accent-cyan)',
        svg: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
      };
    }
    // Video
    if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
      return {
        color: 'var(--accent-red)',
        svg: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`
      };
    }
    // Code
    if (['html', 'css', 'js', 'py', 'go', 'json', 'ts', 'rs'].includes(ext)) {
      return {
        color: 'var(--accent-blue)',
        svg: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
      };
    }
    
    // Default document
    return {
      color: 'var(--text-secondary)',
      svg: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
    };
  }

  function addFileToQueue(file) {
    const fileId = 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const fileIconInfo = getFileIcon(file.name);
    
    const fileObj = {
      id: fileId,
      name: file.name,
      size: file.size,
      formattedSize: formatBytes(file.size),
      progress: 0,
      speed: 0,
      status: 'sending', // 'sending', 'completed', 'cancelled'
      iconInfo: fileIconInfo
    };

    fileQueue.unshift(fileObj);
    activeTransfers++;
    updateTransfersUI();

    // Start simulation loop for this file
    simulateFileUpload(fileId);
  }

  function updateTransfersUI() {
    const countEl = transfersCount;
    if (countEl) {
      countEl.textContent = `${fileQueue.length} files`;
    }

    const listContainer = transfersList;
    if (!listContainer) return;

    if (fileQueue.length === 0) {
      listContainer.innerHTML = `
        <div class="transfers-empty-state">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p>No active transfers. Add files above to begin sending.</p>
        </div>
      `;
      return;
    }

    // Build the lists
    let html = '';
    fileQueue.forEach(item => {
      const isCompleted = item.status === 'completed';
      const isCancelled = item.status === 'cancelled';
      
      let statusText = '';
      if (isCompleted) {
        statusText = 'Completed';
      } else if (isCancelled) {
        statusText = 'Cancelled';
      } else {
        statusText = `${item.progress}% &bull; ${item.speed} MB/s`;
      }

      html += `
        <div class="transfer-item ${item.status}" id="${item.id}">
          <div class="file-icon-wrapper" style="color: ${item.iconInfo.color}">
            ${item.iconInfo.svg}
          </div>
          <div class="transfer-details">
            <div class="transfer-info-row">
              <span class="file-name" title="${item.name}">${item.name}</span>
              <span class="transfer-meta">${item.formattedSize}</span>
            </div>
            <div class="transfer-info-row" style="margin-bottom: 0.5rem">
              <span class="transfer-meta" id="${item.id}-status" style="font-size: 0.7rem">${statusText}</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar" id="${item.id}-progress" style="width: ${item.progress}%"></div>
            </div>
          </div>
          <div class="transfer-actions">
            ${isCompleted ? `
              <button class="btn-action download" title="Download File" onclick="event.stopPropagation(); alert('Mock Download: In a live connection, this streams the file bits directly from the peer.')">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            ` : ''}
            ${!isCompleted && !isCancelled ? `
              <button class="btn-action" title="Cancel Transfer" id="${item.id}-cancel-btn">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Attach cancel button events
    fileQueue.forEach(item => {
      const cancelBtn = document.getElementById(`${item.id}-cancel-btn`);
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          cancelUpload(item.id);
        });
      }
    });
  }

  function simulateFileUpload(id) {
    let progress = 0;
    
    function tick() {
      const fileIndex = fileQueue.findIndex(f => f.id === id);
      if (fileIndex === -1) return;
      const file = fileQueue[fileIndex];

      if (file.status !== 'sending') return;

      // Increment progress
      const step = 1.5 + Math.random() * 4.5;
      progress = Math.min(100, progress + step);
      
      file.progress = Math.round(progress);
      file.speed = (15 + Math.random() * 35).toFixed(1);

      // Update specific DOM nodes directly for performance
      const progressEl = document.getElementById(`${id}-progress`);
      const statusEl = document.getElementById(`${id}-status`);

      if (progressEl) progressEl.style.width = `${file.progress}%`;
      if (statusEl) statusEl.innerHTML = `${file.progress}% &bull; ${file.speed} MB/s`;

      if (progress < 100) {
        setTimeout(tick, 150);
      } else {
        file.status = 'completed';
        activeTransfers--;
        updateTransfersUI();
        showToast(`Finished sending "${file.name}"!`);
      }
    }

    setTimeout(tick, 100);
  }

  function cancelUpload(id) {
    const fileIndex = fileQueue.findIndex(f => f.id === id);
    if (fileIndex !== -1) {
      const file = fileQueue[fileIndex];
      if (file.status === 'sending') {
        file.status = 'cancelled';
        activeTransfers--;
        updateTransfersUI();
        showToast(`Cancelled sending "${file.name}".`);
      }
    }
  }

  // --- 6. Helper Toast Notification System ---
  function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.background = 'rgba(13, 17, 28, 0.9)';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    toast.style.borderLeft = '3px solid var(--accent-blue)';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.85rem 1.5rem';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '600';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = 'var(--font-body)';
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Animate out and remove
    setTimeout(() => {
      toast.style.transform = 'translateY(50px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  }

  // --- 7. Deep Linking handler ---
  // If the user lands with a url query e.g., ?room=p2p-abcd-1234
  const urlParams = new URLSearchParams(window.location.search);
  const inviteRoomId = urlParams.get('room');
  if (inviteRoomId) {
    // Switch to Join Room tab on the card just as visual feedback
    const joinTabBtn = document.querySelector('.tab-btn[data-tab="join-panel"]');
    if (joinTabBtn) {
      joinTabBtn.click();
    }
    roomInput.value = inviteRoomId;
    
    // Automatically join room after a short delay
    setTimeout(() => {
      showRoomState(inviteRoomId, false);
    }, 800);
  }
});
