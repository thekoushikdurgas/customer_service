// Application Data
const appData = {
  "participants": [
    {
      "id": "1",
      "name": "John Smith",
      "avatar": "JS",
      "status": "connected",
      "isHost": true,
      "audioEnabled": true,
      "videoEnabled": true,
      "joinTime": "2025-08-14T09:30:00Z"
    },
    {
      "id": "2", 
      "name": "Sarah Johnson",
      "avatar": "SJ",
      "status": "connected",
      "isHost": false,
      "audioEnabled": true,
      "videoEnabled": false,
      "joinTime": "2025-08-14T09:32:00Z"
    },
    {
      "id": "3",
      "name": "Mike Chen",
      "avatar": "MC", 
      "status": "connecting",
      "isHost": false,
      "audioEnabled": false,
      "videoEnabled": true,
      "joinTime": "2025-08-14T09:35:00Z"
    },
    {
      "id": "4",
      "name": "Emily Davis",
      "avatar": "ED",
      "status": "connected",
      "isHost": false,
      "audioEnabled": true,
      "videoEnabled": true,
      "joinTime": "2025-08-14T09:33:00Z"
    }
  ],
  "qualityOptions": [
    {"value": "720p", "label": "720p HD", "bandwidth": "1.5 Mbps"},
    {"value": "1080p", "label": "1080p Full HD", "bandwidth": "3.0 Mbps"},
    {"value": "4k", "label": "4K Ultra HD", "bandwidth": "8.0 Mbps"}
  ],
  "connectionStats": {
    "bandwidth": "5.2 Mbps",
    "latency": "45ms", 
    "packetLoss": "0.1%",
    "quality": "excellent"
  },
  "simulatedScreenContent": {
    "type": "presentation",
    "title": "Q4 Sales Report",
    "slideNumber": 3,
    "totalSlides": 12,
    "content": "Simulated presentation content being shared"
  }
};

// Application State
class ScreenShareApp {
  constructor() {
    this.state = {
      isSharing: false,
      isLoading: false,
      audioEnabled: true,
      quality: '1080p',
      participants: [...appData.participants],
      connectionStats: {...appData.connectionStats},
      participantsPanelMinimized: false,
      isFullscreen: false
    };

    this.elements = {};
    this.initialized = false;
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      });
    }

    this.getElements();
    this.setupEventListeners();
    this.renderParticipants();
    this.updateConnectionStats();
    this.updateUI();
    this.startSimulations();
    this.initialized = true;
    
    console.log('Screen Share App initialized successfully');
  }

  getElements() {
    this.elements = {
      shareBtn: document.getElementById('shareBtn'),
      waitingState: document.getElementById('waitingState'),
      sharingContent: document.getElementById('sharingContent'),
      loadingState: document.getElementById('loadingState'),
      loadingText: document.getElementById('loadingText'),
      controlOptions: document.getElementById('controlOptions'),
      participantsList: document.getElementById('participantsList'),
      participantsPanel: document.getElementById('participantsPanel'),
      audioToggle: document.getElementById('audioToggle'),
      qualitySelect: document.getElementById('qualitySelect'),
      settingsBtn: document.getElementById('settingsBtn'),
      settingsModal: document.getElementById('settingsModal'),
      fullscreenBtn: document.getElementById('fullscreenBtn')
    };

    // Verify all elements exist
    for (const [key, element] of Object.entries(this.elements)) {
      if (!element) {
        console.error(`Element not found: ${key}`);
      }
    }
  }

  setupEventListeners() {
    // Main share button
    if (this.elements.shareBtn) {
      this.elements.shareBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Share button clicked, current state:', this.state.isSharing);
        
        if (this.state.isSharing) {
          await this.stopScreenShare();
        } else {
          await this.startScreenShare();
        }
      });
    }

    // Audio toggle
    if (this.elements.audioToggle) {
      this.elements.audioToggle.addEventListener('change', (e) => {
        this.state.audioEnabled = e.target.checked;
        this.showNotification(
          this.state.audioEnabled ? 'Audio sharing enabled' : 'Audio sharing disabled',
          this.state.audioEnabled ? 'success' : 'info'
        );
      });
    }

    // Quality select
    if (this.elements.qualitySelect) {
      this.elements.qualitySelect.addEventListener('change', (e) => {
        this.state.quality = e.target.value;
        const option = appData.qualityOptions.find(opt => opt.value === e.target.value);
        this.showNotification(`Quality changed to ${option.label}`, 'info');
      });
    }

    // Settings button
    if (this.elements.settingsBtn) {
      this.elements.settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSettingsModal();
      });
    }

    // Fullscreen button
    if (this.elements.fullscreenBtn) {
      this.elements.fullscreenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFullscreen();
      });
    }

    // Modal backdrop click to close
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', () => {
        this.closeSettingsModal();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.elements.settingsModal && !this.elements.settingsModal.classList.contains('hidden')) {
          this.closeSettingsModal();
        }
      }
      if (e.key === 'F11') {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  async startScreenShare() {
    if (this.state.isLoading || this.state.isSharing) {
      console.log('Already loading or sharing, ignoring request');
      return;
    }

    console.log('Starting screen share...');
    this.state.isLoading = true;
    this.updateUI();

    // Simulate loading process
    const loadingMessages = [
      'Starting screen share...',
      'Configuring display settings...',
      'Connecting to participants...',
      'Optimizing quality...'
    ];

    try {
      for (let i = 0; i < loadingMessages.length; i++) {
        if (this.elements.loadingText) {
          this.elements.loadingText.textContent = loadingMessages[i];
        }
        console.log(loadingMessages[i]);
        await this.sleep(600);
      }

      // Start sharing
      this.state.isLoading = false;
      this.state.isSharing = true;
      this.updateUI();
      
      this.showNotification('Screen sharing started successfully', 'success');
      console.log('Screen sharing started successfully');
      
      // Simulate participants seeing the share
      this.simulateParticipantReactions();
    } catch (error) {
      console.error('Error starting screen share:', error);
      this.state.isLoading = false;
      this.updateUI();
      this.showNotification('Failed to start screen sharing', 'error');
    }
  }

  async stopScreenShare() {
    if (this.state.isLoading || !this.state.isSharing) {
      console.log('Not sharing or already loading, ignoring stop request');
      return;
    }

    console.log('Stopping screen share...');
    this.state.isLoading = true;
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = 'Stopping screen share...';
    }
    this.updateUI();

    try {
      await this.sleep(800);

      this.state.isLoading = false;
      this.state.isSharing = false;
      this.updateUI();

      this.showNotification('Screen sharing stopped', 'info');
      console.log('Screen sharing stopped successfully');
    } catch (error) {
      console.error('Error stopping screen share:', error);
      this.state.isLoading = false;
      this.updateUI();
      this.showNotification('Failed to stop screen sharing', 'error');
    }
  }

  updateUI() {
    console.log('Updating UI, current state:', {
      isLoading: this.state.isLoading,
      isSharing: this.state.isSharing
    });

    // Update button
    if (this.elements.shareBtn) {
      if (this.state.isLoading) {
        this.elements.shareBtn.disabled = true;
        this.elements.shareBtn.className = 'share-btn start loading';
        this.elements.shareBtn.innerHTML = `
          <span class="btn-icon">
            <div style="width: 16px; height: 16px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </span>
          <span class="btn-text">Please wait...</span>
        `;
      } else if (this.state.isSharing) {
        this.elements.shareBtn.disabled = false;
        this.elements.shareBtn.className = 'share-btn stop';
        this.elements.shareBtn.innerHTML = `
          <span class="btn-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
          </span>
          <span class="btn-text">Stop Screen Share</span>
        `;
      } else {
        this.elements.shareBtn.disabled = false;
        this.elements.shareBtn.className = 'share-btn start';
        this.elements.shareBtn.innerHTML = `
          <span class="btn-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </span>
          <span class="btn-text">Start Screen Share</span>
        `;
      }
    }

    // Update display states
    if (this.state.isLoading) {
      this.hideElement(this.elements.waitingState);
      this.hideElement(this.elements.sharingContent);
      this.showElement(this.elements.loadingState);
    } else if (this.state.isSharing) {
      this.hideElement(this.elements.waitingState);
      this.hideElement(this.elements.loadingState);
      this.showElement(this.elements.sharingContent);
      this.showElement(this.elements.fullscreenBtn);
    } else {
      this.hideElement(this.elements.loadingState);
      this.hideElement(this.elements.sharingContent);
      this.showElement(this.elements.waitingState);
      this.hideElement(this.elements.fullscreenBtn);
    }

    // Update control options visibility
    if (this.state.isSharing) {
      this.showElement(this.elements.controlOptions);
    } else {
      this.hideElement(this.elements.controlOptions);
    }
  }

  showElement(element) {
    if (element) {
      element.classList.remove('hidden');
    }
  }

  hideElement(element) {
    if (element) {
      element.classList.add('hidden');
    }
  }

  renderParticipants() {
    if (!this.elements.participantsList) return;

    this.elements.participantsList.innerHTML = '';
    
    this.state.participants.forEach(participant => {
      const participantElement = document.createElement('div');
      participantElement.className = 'participant-item';
      participantElement.innerHTML = `
        <div class="participant-avatar ${participant.isHost ? 'host' : ''}">
          ${participant.avatar}
        </div>
        <div class="participant-info">
          <div class="participant-name">
            ${participant.name}
            ${participant.isHost ? '<span class="host-badge">Host</span>' : ''}
          </div>
          <div class="participant-status">
            <div class="status-dot ${participant.status}"></div>
            ${participant.status === 'connected' ? 'Connected' : 'Connecting...'}
          </div>
        </div>
        <div class="participant-controls">
          <svg class="control-icon ${participant.audioEnabled ? 'active' : 'disabled'}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${participant.audioEnabled 
              ? '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>'
              : '<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12L19 10v2a7 7 0 0 1-11.19 5.69"/><path d="M12 1a3 3 0 0 0-3 3v3l6 6V4a3 3 0 0 0-3-3z"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>'
            }
          </svg>
          <svg class="control-icon ${participant.videoEnabled ? 'active' : 'disabled'}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${participant.videoEnabled
              ? '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'
              : '<line x1="1" y1="1" x2="23" y2="23"/><path d="M10.5 5H19a2 2 0 0 1 2 2v8.5L16 12"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'
            }
          </svg>
        </div>
      `;
      this.elements.participantsList.appendChild(participantElement);
    });

    // Update participants count
    if (this.elements.participantsPanel) {
      const participantsHeader = this.elements.participantsPanel.querySelector('.panel-header h3');
      if (participantsHeader) {
        participantsHeader.textContent = `Participants (${this.state.participants.length})`;
      }
    }
  }

  updateConnectionStats() {
    const stats = this.state.connectionStats;
    const statElements = document.querySelectorAll('.connection-stats .stat-value');
    
    if (statElements.length >= 3) {
      statElements[0].textContent = stats.bandwidth;
      statElements[1].textContent = stats.latency;
      statElements[2].textContent = stats.quality.charAt(0).toUpperCase() + stats.quality.slice(1);
      statElements[2].className = `stat-value ${stats.quality}`;
    }
  }

  simulateParticipantReactions() {
    // Simulate participants joining/leaving and status changes
    setTimeout(() => {
      if (this.state.participants[2] && this.state.participants[2].status === 'connecting') {
        this.state.participants[2].status = 'connected';
        this.renderParticipants();
        this.showNotification('Mike Chen joined the session', 'info');
      }
    }, 2000);

    // Simulate connection quality changes
    setTimeout(() => {
      const qualities = ['excellent', 'good', 'excellent'];
      let currentIndex = 0;
      
      const updateQuality = () => {
        if (this.state.isSharing) {
          this.state.connectionStats.quality = qualities[currentIndex];
          this.updateConnectionStats();
          currentIndex = (currentIndex + 1) % qualities.length;
        }
      };
      
      const qualityInterval = setInterval(() => {
        if (this.state.isSharing) {
          updateQuality();
        } else {
          clearInterval(qualityInterval);
        }
      }, 8000);
    }, 3000);
  }

  startSimulations() {
    // Simulate periodic participant audio/video toggles
    setInterval(() => {
      if (Math.random() < 0.15 && this.state.participants.length > 0) { // 15% chance
        const nonHostParticipants = this.state.participants.filter(p => !p.isHost);
        if (nonHostParticipants.length > 0) {
          const randomParticipant = nonHostParticipants[Math.floor(Math.random() * nonHostParticipants.length)];
          randomParticipant.audioEnabled = !randomParticipant.audioEnabled;
          this.renderParticipants();
        }
      }
    }, 6000);

    // Simulate bandwidth fluctuations
    setInterval(() => {
      const bandwidths = ['4.8 Mbps', '5.2 Mbps', '5.7 Mbps', '4.1 Mbps', '6.1 Mbps'];
      const latencies = ['42ms', '45ms', '38ms', '52ms', '41ms'];
      
      this.state.connectionStats.bandwidth = bandwidths[Math.floor(Math.random() * bandwidths.length)];
      this.state.connectionStats.latency = latencies[Math.floor(Math.random() * latencies.length)];
      this.updateConnectionStats();
    }, 10000);
  }

  toggleParticipantsPanel() {
    this.state.participantsPanelMinimized = !this.state.participantsPanelMinimized;
    const participantsList = this.elements.participantsPanel?.querySelector('.participants-list');
    const minimizeBtn = this.elements.participantsPanel?.querySelector('.panel-minimize');
    
    if (participantsList && minimizeBtn) {
      if (this.state.participantsPanelMinimized) {
        participantsList.style.display = 'none';
        minimizeBtn.textContent = '+';
      } else {
        participantsList.style.display = 'block';
        minimizeBtn.textContent = '−';
      }
    }
  }

  openSettingsModal() {
    if (!this.elements.settingsModal) return;
    
    this.elements.settingsModal.classList.remove('hidden');
    
    // Sync settings with current state
    const qualityRadio = document.querySelector(`input[name="quality"][value="${this.state.quality}"]`);
    if (qualityRadio) qualityRadio.checked = true;
    
    const audioEnabledSettings = document.getElementById('audioEnabledSettings');
    if (audioEnabledSettings) audioEnabledSettings.checked = this.state.audioEnabled;
  }

  closeSettingsModal() {
    if (this.elements.settingsModal) {
      this.elements.settingsModal.classList.add('hidden');
    }
  }

  applySettings() {
    // Get quality setting
    const selectedQuality = document.querySelector('input[name="quality"]:checked');
    if (selectedQuality) {
      this.state.quality = selectedQuality.value;
      if (this.elements.qualitySelect) {
        this.elements.qualitySelect.value = selectedQuality.value;
      }
    }

    // Get audio setting
    const audioEnabledSettings = document.getElementById('audioEnabledSettings');
    if (audioEnabledSettings) {
      this.state.audioEnabled = audioEnabledSettings.checked;
      if (this.elements.audioToggle) {
        this.elements.audioToggle.checked = audioEnabledSettings.checked;
      }
    }

    this.showNotification('Settings applied successfully', 'success');
    this.closeSettingsModal();
  }

  toggleFullscreen() {
    const screenDisplayContainer = document.querySelector('.screen-display-container');
    if (!screenDisplayContainer) return;
    
    if (!this.state.isFullscreen) {
      // Enter fullscreen
      if (screenDisplayContainer.requestFullscreen) {
        screenDisplayContainer.requestFullscreen();
      } else if (screenDisplayContainer.webkitRequestFullscreen) {
        screenDisplayContainer.webkitRequestFullscreen();
      } else if (screenDisplayContainer.msRequestFullscreen) {
        screenDisplayContainer.msRequestFullscreen();
      }
      
      this.state.isFullscreen = true;
      this.updateFullscreenButton(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      this.state.isFullscreen = false;
      this.updateFullscreenButton(false);
    }
  }

  updateFullscreenButton(isFullscreen) {
    if (!this.elements.fullscreenBtn) return;
    
    if (isFullscreen) {
      this.elements.fullscreenBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      `;
    } else {
      this.elements.fullscreenBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      `;
    }
  }

  handleResize() {
    // Handle responsive behavior
    const isMobile = window.innerWidth <= 768;
    const controlPanel = document.querySelector('.control-panel');
    
    if (controlPanel) {
      if (isMobile) {
        controlPanel.style.left = '16px';
        controlPanel.style.right = '16px';
        controlPanel.style.transform = 'none';
      } else {
        controlPanel.style.left = '50%';
        controlPanel.style.right = 'auto';
        controlPanel.style.transform = 'translateX(-50%)';
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? '#34A853' : type === 'error' ? '#EA4335' : '#4285F4'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 3000;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global functions for HTML event handlers
function toggleParticipantsPanel() {
  if (window.app && window.app.initialized) {
    window.app.toggleParticipantsPanel();
  }
}

function closeSettingsModal() {
  if (window.app && window.app.initialized) {
    window.app.closeSettingsModal();
  }
}

function applySettings() {
  if (window.app && window.app.initialized) {
    window.app.applySettings();
  }
}

// Initialize app
window.app = new ScreenShareApp();
window.app.init().catch(error => {
  console.error('Failed to initialize app:', error);
});

// Handle fullscreen change events
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && window.app && window.app.initialized) {
    window.app.state.isFullscreen = false;
    window.app.updateFullscreenButton(false);
  }
});

// Handle webkit fullscreen change
document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement && window.app && window.app.initialized) {
    window.app.state.isFullscreen = false;
    window.app.updateFullscreenButton(false);
  }
});

// Prevent default behavior for certain events
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.screen-display')) {
    e.preventDefault();
  }
});

// Add smooth scrolling behavior
if (document.documentElement) {
  document.documentElement.style.scrollBehavior = 'smooth';
}