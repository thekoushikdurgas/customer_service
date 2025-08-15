// Application data
const appData = {
  channels: [
    {"id": "general", "name": "General", "type": "text", "unread": 3},
    {"id": "development", "name": "Development", "type": "text", "unread": 0},
    {"id": "design", "name": "Design", "type": "text", "unread": 1},
    {"id": "random", "name": "Random", "type": "text", "unread": 0}
  ],
  users: [
    {"id": "user1", "name": "John Doe", "avatar": "👨‍💻", "status": "online"},
    {"id": "user2", "name": "Sarah Kim", "avatar": "👩‍🎨", "status": "online"},
    {"id": "user3", "name": "Mike Chen", "avatar": "👨‍🔬", "status": "away"},
    {"id": "user4", "name": "Emma Wilson", "avatar": "👩‍💼", "status": "busy"}
  ],
  messages: {
    general: [
      {"id": 1, "user": "Sarah Kim", "avatar": "👩‍🎨", "content": "Hey everyone! How's the new project coming along?", "timestamp": "10:30 AM", "type": "text"},
      {"id": 2, "user": "John Doe", "avatar": "👨‍💻", "content": "Making good progress on the Flutter app. The WebRTC integration is working smoothly!", "timestamp": "10:32 AM", "type": "text"},
      {"id": 3, "user": "Mike Chen", "avatar": "👨‍🔬", "content": "Great work! I've finished the backend API endpoints for real-time messaging.", "timestamp": "10:35 AM", "type": "text"},
      {"id": 4, "user": "Emma Wilson", "avatar": "👩‍💼", "content": "Perfect timing for our demo tomorrow. Should we do a quick video call to sync up?", "timestamp": "10:37 AM", "type": "text"}
    ],
    development: [
      {"id": 5, "user": "John Doe", "avatar": "👨‍💻", "content": "I've pushed the latest WebRTC changes to the dev branch.", "timestamp": "9:15 AM", "type": "text"},
      {"id": 6, "user": "Mike Chen", "avatar": "👨‍🔬", "content": "Testing the real-time messaging features now. Looking good!", "timestamp": "9:20 AM", "type": "text"},
      {"id": 7, "user": "Sarah Kim", "avatar": "👩‍🎨", "content": "The UI components are integrating well with the new backend.", "timestamp": "9:25 AM", "type": "text"}
    ],
    design: [
      {"id": 8, "user": "Sarah Kim", "avatar": "👩‍🎨", "content": "Updated the UI mockups with the new color scheme. Check them out!", "timestamp": "8:45 AM", "type": "text"},
      {"id": 9, "user": "Emma Wilson", "avatar": "👩‍💼", "content": "The new design looks fantastic! Great work on the color palette.", "timestamp": "8:50 AM", "type": "text"}
    ],
    random: [
      {"id": 10, "user": "Emma Wilson", "avatar": "👩‍💼", "content": "Anyone up for lunch after the meeting?", "timestamp": "11:00 AM", "type": "text"},
      {"id": 11, "user": "Mike Chen", "avatar": "👨‍🔬", "content": "Count me in! I know a great place nearby.", "timestamp": "11:02 AM", "type": "text"}
    ]
  },
  callParticipants: [
    {"id": "user1", "name": "John Doe", "avatar": "👨‍💻", "isMuted": false, "cameraOn": true, "isScreenSharing": false},
    {"id": "user2", "name": "Sarah Kim", "avatar": "👩‍🎨", "isMuted": false, "cameraOn": true, "isScreenSharing": false},
    {"id": "user4", "name": "Emma Wilson", "avatar": "👩‍💼", "isMuted": true, "cameraOn": false, "isScreenSharing": false}
  ]
};

// Application state
let appState = {
  currentChannel: 'general',
  currentInterface: 'chat', // 'chat', 'voice-call', 'video-call', 'screen-share'
  inCall: false,
  callStartTime: null,
  isMuted: false,
  cameraOn: true,
  isScreenSharing: false,
  messageCount: 11,
  typingUsers: [],
  callDurationInterval: null
};

// DOM elements - will be initialized after DOM loads
let channelItems, currentChannelEl, messagesList, messageInput, sendBtn, typingIndicator;
let chatInterface, voiceCallInterface, videoCallInterface, screenShareInterface;
let voiceCallBtn, videoCallBtn, screenShareBtn;
let callControls, muteBtn, cameraBtn, shareScreenBtn, endCallBtn, callDurationEl;

// Initialize the application
function init() {
  console.log('Initializing app...');
  
  // Initialize DOM elements
  channelItems = document.querySelectorAll('.channel-item');
  currentChannelEl = document.getElementById('current-channel');
  messagesList = document.getElementById('messages-list');
  messageInput = document.getElementById('message-input');
  sendBtn = document.getElementById('send-btn');
  typingIndicator = document.getElementById('typing-indicator');

  // Interface panels
  chatInterface = document.getElementById('chat-interface');
  voiceCallInterface = document.getElementById('voice-call-interface');
  videoCallInterface = document.getElementById('video-call-interface');
  screenShareInterface = document.getElementById('screen-share-interface');

  // Navigation buttons
  voiceCallBtn = document.getElementById('voice-call-btn');
  videoCallBtn = document.getElementById('video-call-btn');
  screenShareBtn = document.getElementById('screen-share-btn');

  // Call controls
  callControls = document.getElementById('call-controls');
  muteBtn = document.getElementById('mute-btn');
  cameraBtn = document.getElementById('camera-btn');
  shareScreenBtn = document.getElementById('share-screen-btn');
  endCallBtn = document.getElementById('end-call-btn');
  callDurationEl = document.getElementById('call-duration');

  setupEventListeners();
  loadMessages(appState.currentChannel);
  startMessageSimulation();
  updateChannelUnreadBadges();
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Channel switching
  if (channelItems) {
    channelItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const channelId = e.currentTarget.getAttribute('data-channel');
        console.log('Channel clicked:', channelId);
        switchChannel(channelId);
      });
    });
  }

  // Message sending
  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }
  
  if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Typing simulation
    messageInput.addEventListener('input', () => {
      if (Math.random() < 0.3) {
        simulateTyping();
      }
    });
  }

  // Call buttons
  if (voiceCallBtn) {
    voiceCallBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startCall('voice-call');
    });
  }
  
  if (videoCallBtn) {
    videoCallBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startCall('video-call');
    });
  }
  
  if (screenShareBtn) {
    screenShareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startCall('screen-share');
    });
  }

  // Call controls
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMute();
    });
  }
  
  if (cameraBtn) {
    cameraBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCamera();
    });
  }
  
  if (shareScreenBtn) {
    shareScreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleScreenShare();
    });
  }
  
  if (endCallBtn) {
    endCallBtn.addEventListener('click', (e) => {
      e.preventDefault();
      endCall();
    });
  }
}

// Channel management
function switchChannel(channelId) {
  console.log('Switching to channel:', channelId);
  
  // Update active channel
  channelItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-channel') === channelId) {
      item.classList.add('active');
    }
  });

  // Clear unread badge for current channel
  const currentChannelItem = document.querySelector(`[data-channel="${channelId}"]`);
  if (currentChannelItem) {
    const unreadBadge = currentChannelItem.querySelector('.unread-badge');
    if (unreadBadge) {
      unreadBadge.remove();
    }
  }

  // Update channel data
  const channelData = appData.channels.find(c => c.id === channelId);
  if (channelData) {
    channelData.unread = 0;
  }

  appState.currentChannel = channelId;
  if (currentChannelEl) {
    currentChannelEl.textContent = channelId.charAt(0).toUpperCase() + channelId.slice(1);
  }
  
  loadMessages(channelId);
  showNotification(`Switched to #${channelId}`);
}

// Message management
function loadMessages(channelId) {
  console.log('Loading messages for channel:', channelId);
  const messages = appData.messages[channelId] || [];
  
  if (messagesList) {
    messagesList.innerHTML = '';
    
    messages.forEach(message => {
      addMessageToUI(message);
    });
    
    scrollToBottom();
  }
}

function addMessageToUI(message) {
  if (!messagesList) return;
  
  const messageEl = document.createElement('div');
  messageEl.className = 'message-item';
  
  messageEl.innerHTML = `
    <span class="user-avatar">${message.avatar}</span>
    <div class="message-content">
      <div class="message-header">
        <span class="message-author">${message.user}</span>
        <span class="message-timestamp">${message.timestamp}</span>
      </div>
      <div class="message-text">${message.content}</div>
    </div>
  `;
  
  messagesList.appendChild(messageEl);
}

function sendMessage() {
  if (!messageInput) return;
  
  const content = messageInput.value.trim();
  if (!content) return;

  console.log('Sending message:', content);

  const message = {
    id: ++appState.messageCount,
    user: 'John Doe',
    avatar: '👨‍💻',
    content: content,
    timestamp: getCurrentTime(),
    type: 'text'
  };

  // Add to data
  if (!appData.messages[appState.currentChannel]) {
    appData.messages[appState.currentChannel] = [];
  }
  appData.messages[appState.currentChannel].push(message);

  // Add to UI
  addMessageToUI(message);
  messageInput.value = '';
  scrollToBottom();

  // Simulate response after delay
  setTimeout(() => {
    simulateIncomingMessage();
  }, 1000 + Math.random() * 3000);
}

function simulateIncomingMessage() {
  const responses = [
    { user: 'Sarah Kim', avatar: '👩‍🎨', content: 'That sounds great! I agree with that approach.' },
    { user: 'Mike Chen', avatar: '👨‍🔬', content: 'Nice work on that feature! 🚀' },
    { user: 'Emma Wilson', avatar: '👩‍💼', content: 'Let me know if you need any help with testing.' },
    { user: 'Sarah Kim', avatar: '👩‍🎨', content: 'I can review the code changes later today.' },
    { user: 'Mike Chen', avatar: '👨‍🔬', content: 'The new architecture looks solid!' }
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];
  const message = {
    id: ++appState.messageCount,
    user: response.user,
    avatar: response.avatar,
    content: response.content,
    timestamp: getCurrentTime(),
    type: 'text'
  };

  if (!appData.messages[appState.currentChannel]) {
    appData.messages[appState.currentChannel] = [];
  }
  appData.messages[appState.currentChannel].push(message);
  addMessageToUI(message);
  scrollToBottom();
}

// Call management
function startCall(type) {
  console.log('Starting call of type:', type);
  
  appState.currentInterface = type;
  appState.inCall = true;
  appState.callStartTime = Date.now();
  
  // Switch interface
  document.querySelectorAll('.interface-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  let targetInterface;
  switch(type) {
    case 'voice-call':
      targetInterface = voiceCallInterface;
      break;
    case 'video-call':
      targetInterface = videoCallInterface;
      break;
    case 'screen-share':
      targetInterface = screenShareInterface;
      break;
  }
  
  if (targetInterface) {
    targetInterface.classList.add('active');
  }
  
  // Show call controls
  if (callControls) {
    callControls.classList.remove('hidden');
  }
  
  // Start call duration timer
  startCallTimer();
  
  // Update call control states
  updateCallControlStates();
  
  // Simulate call connection
  setTimeout(() => {
    showNotification(`${type.replace('-', ' ').toUpperCase()} started`);
  }, 500);
}

function endCall() {
  console.log('Ending call');
  
  appState.inCall = false;
  appState.currentInterface = 'chat';
  appState.callStartTime = null;
  
  // Hide call controls
  if (callControls) {
    callControls.classList.add('hidden');
  }
  
  // Switch back to chat
  document.querySelectorAll('.interface-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  if (chatInterface) {
    chatInterface.classList.add('active');
  }
  
  // Stop call timer
  if (appState.callDurationInterval) {
    clearInterval(appState.callDurationInterval);
    appState.callDurationInterval = null;
  }
  
  // Reset call states
  appState.isMuted = false;
  appState.cameraOn = true;
  appState.isScreenSharing = false;
  updateCallControlStates();
  
  showNotification('Call ended');
}

// Call controls
function toggleMute() {
  appState.isMuted = !appState.isMuted;
  updateCallControlStates();
  showNotification(appState.isMuted ? 'Microphone muted' : 'Microphone unmuted');
}

function toggleCamera() {
  appState.cameraOn = !appState.cameraOn;
  updateCallControlStates();
  showNotification(appState.cameraOn ? 'Camera on' : 'Camera off');
}

function toggleScreenShare() {
  appState.isScreenSharing = !appState.isScreenSharing;
  updateCallControlStates();
  
  if (appState.isScreenSharing) {
    // Switch to screen share interface
    document.querySelectorAll('.interface-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    if (screenShareInterface) {
      screenShareInterface.classList.add('active');
    }
    appState.currentInterface = 'screen-share';
    showNotification('Screen sharing started');
  } else {
    // Switch back to video call
    document.querySelectorAll('.interface-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    if (videoCallInterface) {
      videoCallInterface.classList.add('active');
    }
    appState.currentInterface = 'video-call';
    showNotification('Screen sharing stopped');
  }
}

function updateCallControlStates() {
  if (muteBtn) {
    muteBtn.classList.toggle('muted', appState.isMuted);
  }
  if (cameraBtn) {
    cameraBtn.classList.toggle('active', appState.cameraOn);
  }
  if (shareScreenBtn) {
    shareScreenBtn.classList.toggle('active', appState.isScreenSharing);
  }
}

// Call timer
function startCallTimer() {
  if (appState.callDurationInterval) {
    clearInterval(appState.callDurationInterval);
  }
  
  appState.callDurationInterval = setInterval(() => {
    if (appState.callStartTime && callDurationEl) {
      const duration = Date.now() - appState.callStartTime;
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      callDurationEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// Typing indicator
function simulateTyping() {
  if (!typingIndicator) return;
  
  const users = ['Sarah Kim', 'Mike Chen', 'Emma Wilson'];
  const randomUser = users[Math.floor(Math.random() * users.length)];
  
  // Show typing indicator
  typingIndicator.classList.remove('hidden');
  const typingText = typingIndicator.querySelector('.typing-dots span');
  if (typingText) {
    typingText.textContent = `${randomUser} is typing`;
  }
  
  // Hide after 3 seconds
  setTimeout(() => {
    typingIndicator.classList.add('hidden');
  }, 3000);
}

// Message simulation
function startMessageSimulation() {
  setInterval(() => {
    // Randomly simulate incoming messages in different channels
    if (Math.random() < 0.2) { // 20% chance every interval
      const channels = Object.keys(appData.messages);
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];
      
      // Only add unread badge if not current channel
      if (randomChannel !== appState.currentChannel) {
        simulateIncomingMessageInChannel(randomChannel);
      }
    }
  }, 10000); // Every 10 seconds
}

function simulateIncomingMessageInChannel(channelId) {
  const messages = [
    { user: 'Sarah Kim', avatar: '👩‍🎨', content: 'Just finished the new design mockups!' },
    { user: 'Mike Chen', avatar: '👨‍🔬', content: 'Server deployment is complete ✅' },
    { user: 'Emma Wilson', avatar: '👩‍💼', content: 'Meeting scheduled for tomorrow at 2 PM' },
    { user: 'Sarah Kim', avatar: '👩‍🎨', content: 'The latest UI changes look great!' },
    { user: 'Mike Chen', avatar: '👨‍🔬', content: 'Database optimization is complete.' }
  ];
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  const newMessage = {
    id: ++appState.messageCount,
    user: message.user,
    avatar: message.avatar,
    content: message.content,
    timestamp: getCurrentTime(),
    type: 'text'
  };
  
  if (!appData.messages[channelId]) {
    appData.messages[channelId] = [];
  }
  appData.messages[channelId].push(newMessage);
  
  // Update unread count
  const channelData = appData.channels.find(c => c.id === channelId);
  if (channelData) {
    channelData.unread = (channelData.unread || 0) + 1;
  }
  
  updateChannelUnreadBadges();
}

function updateChannelUnreadBadges() {
  if (!channelItems) return;
  
  channelItems.forEach(item => {
    const channelId = item.getAttribute('data-channel');
    const channelData = appData.channels.find(c => c.id === channelId);
    
    // Remove existing badge
    const existingBadge = item.querySelector('.unread-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Add new badge if needed
    if (channelData && channelData.unread > 0) {
      const badge = document.createElement('span');
      badge.className = 'unread-badge';
      badge.textContent = channelData.unread;
      item.appendChild(badge);
    }
  });
}

// Utility functions
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

function scrollToBottom() {
  if (messagesList) {
    messagesList.scrollTop = messagesList.scrollHeight;
  }
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(88, 101, 242, 0.95);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;
  notification.textContent = message;
  
  // Add CSS for animation if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Speaking animation for voice calls
function simulateSpeakingActivity() {
  if (appState.currentInterface === 'voice-call') {
    const participants = document.querySelectorAll('.voice-avatar');
    participants.forEach(avatar => {
      avatar.classList.remove('speaking');
    });
    
    // Randomly make someone speak
    if (Math.random() < 0.6) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      if (participants[randomIndex]) {
        participants[randomIndex].classList.add('speaking');
      }
    }
  }
}

// Audio visualization
function animateAudioBars() {
  const audioBars = document.querySelectorAll('.audio-bar');
  audioBars.forEach(bar => {
    const height = Math.random() * 32 + 8;
    bar.style.height = `${height}px`;
  });
}

// Start continuous animations
let speakingInterval, audioInterval;

function startAnimations() {
  speakingInterval = setInterval(simulateSpeakingActivity, 2000);
  audioInterval = setInterval(animateAudioBars, 200);
}

function stopAnimations() {
  if (speakingInterval) clearInterval(speakingInterval);
  if (audioInterval) clearInterval(audioInterval);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  init();
  startAnimations();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAnimations();
    if (appState.callDurationInterval) {
      clearInterval(appState.callDurationInterval);
    }
  } else {
    startAnimations();
    if (appState.inCall && appState.callStartTime) {
      startCallTimer();
    }
  }
});