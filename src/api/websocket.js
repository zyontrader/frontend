import * as quotesStore from '../store/quotesStore';
import * as userStore from '../store/userStore';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnecting = false;
    this.monitorInterval = 15000;
    this.connectionMonitor = null;
    this.inactivityMonitor = null;
    this.lastMessageTime = null;
    this._userListener = this._onUserStoreChange.bind(this);
    this._reconnectTimeout = null; // For debounce
    this.reconnectDelay = 2000; // Default delay if not set elsewhere
    eventBus.on(EVENT_TYPES.USER_ACCOUNT_ID_UPDATE, this._userListener);
    this._onUserStoreChange();
  }

  _onUserStoreChange() {
    const newAccountId = userStore.userStore.accountId;
    if (this.accountId !== newAccountId) {
      this.accountId = newAccountId;
      this._restart();
    }
  }

  _restart() {
    this.disconnect();
    if (this.accountId) {
      this.connect();
    }
  }

  // Initialize WebSocket connection
  connect() {
    if (this.isConnecting) {
      return;
    }

    if (!this.accountId || !userStore.userStore.creds) {
      return;
    }

    // If we already have a websocket, disconnect it first
    if (this.ws) {
      this.disconnect();
    }

    this.isConnecting = true;
    
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL || '/api';
    const wsUrl = baseUrl.replace(/^http/, 'ws').replace(/^https/, 'wss');
    const wsEndpoint = `${wsUrl}/ws`;

    try {
      this.ws = new WebSocket(wsEndpoint);
      this.setupEventHandlers();
    } catch (error) {
      console.error('[WebSocketService] connect: connection failed', error);
      this.isConnecting = false;

      this.handleReconnect();
    }
  }

  // Setup WebSocket event handlers
  setupEventHandlers() {
    this.ws.onopen = () => {
      this.isConnecting = false;
      
      // Authenticate the connection
      this.authenticate();
      
      // Start connection monitoring
      this.startConnectionMonitor();
      this.lastMessageTime = Date.now();
    };

    this.ws.onmessage = (event) => {
      this.lastMessageTime = Date.now();
      // Check if message is binary (quotes)
      if (event.data.arrayBuffer) {
        event.data.arrayBuffer().then((buffer) => {
          this.parseBinaryQuotes(buffer);
        });
      } else {
        // Handle JSON messages
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      }
    };

    this.ws.onclose = (event) => {
      this.isConnecting = false;
      this.stopConnectionMonitor();
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('[WebSocketService] onerror:', error);
      this.isConnecting = false;
    };
  }

  // Parse binary quotes data
  parseBinaryQuotes(buffer) {
    const array = new Int8Array(buffer);
    let i = 0;
    
    while (i < array.length) {
      i = this.parseSingleQuote(i, array);
    }
  }

  // Parse a single quote from binary data
  parseSingleQuote(index, array) {
    const nameLength = array.at(index);
    let scriptId = '';
    
    for (let j = index + 1; j <= index + nameLength; j++) {
      scriptId = scriptId + String.fromCharCode(array.at(j));
    }
    
    const quoteData = {
      scriptId: scriptId,
      price: this.parseInteger(array, index + nameLength + 1) / 100,
      ltTimeMs: this.parseLong(array, index + nameLength + 5),
      ltQuantity: this.parseInteger(array, index + nameLength + 13),
      dayVolume: this.parseLong(array, index + nameLength + 17),
      oi: this.parseLong(array, index + nameLength + 25),
      averagePrice: this.parseInteger(array, index + nameLength + 33) / 100,
      dayOhlc: {
        open: this.parseInteger(array, index + nameLength + 37) / 100,
        high: this.parseInteger(array, index + nameLength + 41) / 100,
        low: this.parseInteger(array, index + nameLength + 45) / 100,
        close: this.parseInteger(array, index + nameLength + 49) / 100
      },
      prevClose: this.parseInteger(array, index + nameLength + 53) / 100,
      change: this.parseInteger(array, index + nameLength + 57) / 100,
      changePct: this.parseInteger(array, index + nameLength + 61) / 100
    };
    // Update store with the parsed quote
    quotesStore.addQuote(quoteData);
    return index + nameLength + 65;
  }

  // Parse 32-bit integer from binary data
  parseInteger(array, index) {
    return new DataView(array.buffer.slice(index, index + 4)).getInt32();
  }

  // Parse 64-bit long from binary data
  parseLong(array, index) {
    return parseInt(new DataView(array.buffer.slice(index, index + 8)).getBigInt64().toString());
  }

  // Start connection monitoring
  startConnectionMonitor() {
    if (this.connectionMonitor) {
      clearInterval(this.connectionMonitor);
    }

    this.connectionMonitor = setInterval(() => {
      this.checkConnectionHealth();
    }, this.monitorInterval);

    // Start inactivity monitor
    if (this.inactivityMonitor) {
      clearInterval(this.inactivityMonitor);
    }
    this.inactivityMonitor = setInterval(() => {
      if (this.lastMessageTime && Date.now() - this.lastMessageTime > 30000) {
        this.disconnect();
        this.connect();
      }
    }, 1000);
  }

  // Stop connection monitoring
  stopConnectionMonitor() {
    if (this.connectionMonitor) {
      clearInterval(this.connectionMonitor);
      this.connectionMonitor = null;
    }
    if (this.inactivityMonitor) {
      clearInterval(this.inactivityMonitor);
      this.inactivityMonitor = null;
    }
  }

  // Check connection health and reconnect if needed
  checkConnectionHealth() {
    // Check if we have required credentials and account
    if (!this.accountId || !userStore.userStore.creds) {
      this.stopConnectionMonitor();
      return;
    }

    const status = this.getStatus();

    // If connection is not open and we're not already connecting, try to reconnect
    if (status !== 'connected' && !this.isConnecting) {
      this.connect();
    }
  }

  // Authenticate WebSocket connection
  authenticate() {
    if (!userStore.userStore.creds) {
      console.warn('WebSocket: Cannot authenticate - missing credentials');
      return;
    }
    
    if (!this.accountId) {
      console.warn('WebSocket: Cannot authenticate - missing account ID');
      return;
    }

    const authMessage = `Auth:${userStore.userStore.creds}:${this.accountId}`;
    this.send(authMessage);
  }

  // Handle incoming WebSocket messages
  handleMessage() {}

  // Send message to WebSocket
  send(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  // Handle reconnection with fixed delay
  handleReconnect() {
    if (this._reconnectTimeout) {
      return;
    }
    this._reconnectTimeout = setTimeout(() => {
      this._reconnectTimeout = null;
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect();
      }
    }, this.reconnectDelay);
  }

  // Disconnect WebSocket
  disconnect() {
    this.stopConnectionMonitor();
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect');
      this.ws = null;
    }
    if (this._reconnectTimeout) {
      clearTimeout(this._reconnectTimeout);
      this._reconnectTimeout = null;
    }
    this.isConnecting = false;
    this.lastMessageTime = null;
  }

  // Get connection status
  getStatus() {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;