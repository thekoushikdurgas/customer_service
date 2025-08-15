// Screen Share Pro - Main Application Logic
class ScreenShareApp {
    constructor() {
        // Application state
        this.state = {
            isSharing: false,
            stream: null,
            isLoading: false,
            error: null,
            isFullscreen: false,
            showSettings: false,
            includeAudio: true,
            videoQuality: '1080p'
        };

        // DOM elements
        this.elements = {};
        
        // Initialize the application
        this.init();
    }

    init() {
        // Get DOM elements
        this.elements = {
            video: document.getElementById('sharedVideo'),
            shareButton: document.getElementById('shareButton'),
            shareButtonText: document.getElementById('shareButtonText'),
            shareButtonIcon: document.getElementById('shareButtonIcon'),
            welcomeState: document.getElementById('welcomeState'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.getElementById('errorMessage'),
            statusIndicator: document.getElementById('statusIndicator'),
            statusDot: document.querySelector('.status-dot'),
            statusText: document.querySelector('.status-text'),
            secondaryControls: document.getElementById('secondaryControls'),
            fullscreenButton: document.getElementById('fullscreenButton'),
            settingsButton: document.getElementById('settingsButton'),
            settingsPanel: document.getElementById('settingsPanel'),
            videoContainer: document.getElementById('videoContainer'),
            includeAudio: document.getElementById('includeAudio'),
            videoQuality: document.getElementById('videoQuality'),
            browserNotice: document.getElementById('browserNotice')
        };

        // Check browser compatibility
        this.checkBrowserSupport();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize settings
        this.loadSettings();
        
        console.log('Screen Share Pro initialized successfully');
    }

    checkBrowserSupport() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            this.showBrowserNotice();
            if (this.elements.shareButton) {
                this.elements.shareButton.disabled = true;
            }
            console.warn('Screen sharing not supported in this browser');
            return false;
        }
        return true;
    }

    showBrowserNotice() {
        if (this.elements.browserNotice) {
            this.elements.browserNotice.classList.remove('hidden');
            setTimeout(() => {
                this.elements.browserNotice.classList.add('hidden');
            }, 8000);
        }
    }

    setupEventListeners() {
        // Main share button
        if (this.elements.shareButton) {
            this.elements.shareButton.addEventListener('click', () => {
                this.toggleSharing();
            });
        }

        // Fullscreen button
        if (this.elements.fullscreenButton) {
            this.elements.fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Settings button
        if (this.elements.settingsButton) {
            this.elements.settingsButton.addEventListener('click', () => {
                this.toggleSettings();
            });
        }

        // Settings change listeners
        if (this.elements.includeAudio) {
            this.elements.includeAudio.addEventListener('change', (e) => {
                this.state.includeAudio = e.target.checked;
                this.saveSettings();
            });
        }

        if (this.elements.videoQuality) {
            this.elements.videoQuality.addEventListener('change', (e) => {
                this.state.videoQuality = e.target.value;
                this.saveSettings();
            });
        }

        // Fullscreen change listener
        document.addEventListener('fullscreenchange', () => {
            this.state.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                this.toggleSharing();
            } else if (e.code === 'KeyF' && e.ctrlKey && this.state.isSharing) {
                e.preventDefault();
                this.toggleFullscreen();
            } else if (e.code === 'Escape' && this.state.showSettings) {
                this.toggleSettings();
            }
        });

        // Click outside settings to close
        document.addEventListener('click', (e) => {
            if (this.state.showSettings && 
                this.elements.settingsPanel &&
                !this.elements.settingsPanel.contains(e.target) && 
                this.elements.settingsButton &&
                !this.elements.settingsButton.contains(e.target)) {
                this.toggleSettings();
            }
        });
    }

    loadSettings() {
        try {
            if (this.elements.includeAudio) {
                this.elements.includeAudio.checked = this.state.includeAudio;
            }
            if (this.elements.videoQuality) {
                this.elements.videoQuality.value = this.state.videoQuality;
            }
        } catch (e) {
            console.log('Settings loaded from defaults');
        }
    }

    saveSettings() {
        console.log('Settings updated:', {
            includeAudio: this.state.includeAudio,
            videoQuality: this.state.videoQuality
        });
    }

    async toggleSharing() {
        if (this.state.isSharing) {
            this.stopSharing();
        } else {
            await this.startSharing();
        }
    }

    async startSharing() {
        try {
            // Check browser support first
            if (!this.checkBrowserSupport()) {
                this.showError('Screen sharing is not supported in your browser. Please use Chrome 72+, Firefox 66+, Safari 13+, or Edge 79+.');
                return;
            }

            this.setState({ isLoading: true, error: null });
            this.showState('loading');
            this.updateStatus('Requesting permissions...', 'loading');
            this.updateShareButton();

            // Get video quality constraints
            const constraints = this.getMediaConstraints();
            
            console.log('Requesting screen share with constraints:', constraints);

            // Request screen sharing
            const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
            
            console.log('Screen share stream obtained:', stream);

            // Handle stream ended event (user stops sharing via browser)
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.addEventListener('ended', () => {
                    console.log('Screen sharing ended by user');
                    this.stopSharing();
                });
            }

            // Set video stream
            if (this.elements.video) {
                this.elements.video.srcObject = stream;
                
                // Wait for video to load
                this.elements.video.addEventListener('loadedmetadata', () => {
                    console.log('Video metadata loaded');
                });
            }
            
            // Update state
            this.setState({ 
                stream, 
                isSharing: true, 
                isLoading: false 
            });

            // Update UI
            this.showState('video');
            this.updateShareButton();
            this.updateStatus('Sharing your screen', 'sharing');
            
            if (this.elements.secondaryControls) {
                this.elements.secondaryControls.classList.remove('hidden');
            }

            console.log('Screen sharing started successfully');
            this.showToast('Screen sharing started successfully', 'success');

        } catch (error) {
            console.error('Failed to start screen sharing:', error);
            
            let errorMessage = 'Unable to start screen sharing. ';
            
            if (error.name === 'NotAllowedError') {
                errorMessage += 'Permission denied. Please allow screen sharing and try again.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage += 'Screen sharing is not supported in this browser.';
            } else if (error.name === 'AbortError') {
                errorMessage += 'Screen sharing was cancelled.';
            } else {
                errorMessage += 'Please check your browser settings and try again.';
            }

            this.setState({ 
                error: errorMessage, 
                isLoading: false 
            });

            this.showError(errorMessage);
            this.updateStatus('Ready to share', 'ready');
            this.updateShareButton();
            this.showToast(errorMessage, 'error');
        }
    }

    stopSharing() {
        try {
            // Stop all tracks
            if (this.state.stream) {
                this.state.stream.getTracks().forEach(track => {
                    track.stop();
                    console.log('Stopped track:', track.kind);
                });
            }

            // Clear video source
            if (this.elements.video) {
                this.elements.video.srcObject = null;
            }

            // Exit fullscreen if active
            if (this.state.isFullscreen) {
                document.exitFullscreen().catch(console.warn);
            }

            // Update state
            this.setState({ 
                stream: null, 
                isSharing: false, 
                isFullscreen: false,
                showSettings: false
            });

            // Update UI
            this.showState('welcome');
            this.updateShareButton();
            this.updateStatus('Ready to share', 'ready');
            
            if (this.elements.secondaryControls) {
                this.elements.secondaryControls.classList.add('hidden');
            }
            if (this.elements.settingsPanel) {
                this.elements.settingsPanel.classList.add('hidden');
            }

            console.log('Screen sharing stopped successfully');
            this.showToast('Screen sharing stopped', 'info');

        } catch (error) {
            console.error('Error stopping screen share:', error);
        }
    }

    getMediaConstraints() {
        const quality = this.state.videoQuality;
        let videoConstraints = {
            cursor: 'always'
        };

        // Set resolution based on quality setting
        switch (quality) {
            case '720p':
                videoConstraints.width = { ideal: 1280 };
                videoConstraints.height = { ideal: 720 };
                break;
            case '1080p':
                videoConstraints.width = { ideal: 1920 };
                videoConstraints.height = { ideal: 1080 };
                break;
            case '1440p':
                videoConstraints.width = { ideal: 2560 };
                videoConstraints.height = { ideal: 1440 };
                break;
        }

        return {
            video: videoConstraints,
            audio: this.state.includeAudio
        };
    }

    toggleFullscreen() {
        if (!this.state.isSharing) return;

        try {
            if (this.state.isFullscreen) {
                document.exitFullscreen();
            } else if (this.elements.videoContainer) {
                this.elements.videoContainer.requestFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen toggle failed:', error);
        }
    }

    toggleSettings() {
        this.setState({ showSettings: !this.state.showSettings });
        
        if (this.elements.settingsPanel) {
            if (this.state.showSettings) {
                this.elements.settingsPanel.classList.remove('hidden');
            } else {
                this.elements.settingsPanel.classList.add('hidden');
            }
        }
    }

    showState(stateName) {
        // Hide all states
        const states = ['welcomeState', 'loadingState', 'errorState'];
        states.forEach(state => {
            if (this.elements[state]) {
                this.elements[state].classList.add('hidden');
            }
        });

        if (this.elements.video) {
            this.elements.video.classList.add('hidden');
        }

        // Show requested state
        switch (stateName) {
            case 'welcome':
                if (this.elements.welcomeState) {
                    this.elements.welcomeState.classList.remove('hidden');
                }
                break;
            case 'loading':
                if (this.elements.loadingState) {
                    this.elements.loadingState.classList.remove('hidden');
                }
                break;
            case 'error':
                if (this.elements.errorState) {
                    this.elements.errorState.classList.remove('hidden');
                }
                break;
            case 'video':
                if (this.elements.video) {
                    this.elements.video.classList.remove('hidden');
                }
                break;
        }
    }

    showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
        }
        this.showState('error');
    }

    updateShareButton() {
        const button = this.elements.shareButton;
        const text = this.elements.shareButtonText;
        const icon = this.elements.shareButtonIcon;

        if (!button || !text || !icon) return;

        if (this.state.isSharing) {
            button.classList.add('sharing');
            text.textContent = 'Stop Sharing';
            icon.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="12" height="12" fill="currentColor" rx="2"/>
                </svg>
            `;
        } else {
            button.classList.remove('sharing');
            text.textContent = 'Start Sharing';
            icon.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
        }

        // Update button state
        button.disabled = this.state.isLoading;
    }

    updateStatus(text, status = 'ready') {
        if (this.elements.statusText) {
            this.elements.statusText.textContent = text;
        }
        
        // Update status dot
        if (this.elements.statusDot) {
            this.elements.statusDot.classList.remove('sharing');
            if (status === 'sharing') {
                this.elements.statusDot.classList.add('sharing');
            }
        }
    }

    updateFullscreenButton() {
        const button = this.elements.fullscreenButton;
        if (!button) return;
        
        const isFullscreen = this.state.isFullscreen;
        
        button.innerHTML = isFullscreen 
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>`;
        
        button.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
    }

    handleRetry() {
        this.setState({ error: null });
        this.showState('welcome');
        this.updateStatus('Ready to share', 'ready');
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        console.log('State updated:', this.state);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1002',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });

        // Set background based on type
        const colors = {
            success: '#34A853',
            error: '#EA4335',
            info: '#4285F4',
            warning: '#FBBC05'
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Cleanup method for proper resource management
    cleanup() {
        if (this.state.stream) {
            this.state.stream.getTracks().forEach(track => track.stop());
        }
        
        if (this.state.isFullscreen) {
            document.exitFullscreen().catch(console.warn);
        }
    }
}

// Global instance
let screenShare;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    screenShare = new ScreenShareApp();
    // Make available globally for any remaining inline handlers
    window.screenShare = screenShare;
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (screenShare) {
        screenShare.cleanup();
    }
});

// Error boundary for better error handling
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    if (screenShare && screenShare.state && screenShare.state.isSharing) {
        if (screenShare.showToast) {
            screenShare.showToast('An error occurred during screen sharing', 'error');
        }
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

console.log('Screen Share Pro application loaded successfully');