import { Message } from './types';
import { storage } from './storage';

class OfflineManager {
  private isOnline: boolean = true;
  private messageQueue: Message[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      this.loadQueuedMessages();
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.processMessageQueue();
  };

  private handleOffline = () => {
    this.isOnline = false;
  };

  private loadQueuedMessages() {
    const saved = localStorage.getItem('nidam_message_queue');
    if (saved) {
      this.messageQueue = JSON.parse(saved);
    }
  }

  private saveMessageQueue() {
    localStorage.setItem('nidam_message_queue', JSON.stringify(this.messageQueue));
  }

  public queueMessage(message: Message) {
    this.messageQueue.push(message);
    this.saveMessageQueue();
  }

  private async processMessageQueue() {
    if (!this.isOnline || this.messageQueue.length === 0) return;

    // Process queued messages when back online
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          // Process message (implement actual processing logic)
          console.log('Processing queued message:', message);
        } catch (error) {
          console.error('Failed to process message:', error);
          // Re-queue failed messages
          this.queueMessage(message);
        }
      }
    }

    this.saveMessageQueue();
  }

  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public cleanup() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }
}

export const offlineManager = new OfflineManager();