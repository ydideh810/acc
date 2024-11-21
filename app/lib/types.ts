// Add WebLN type definition
declare global {
  interface Window {
    webln: any;
  }
}

export interface UserPreference {
  communicationStyle: 'technical' | 'casual' | 'formal';
  responseLength: 'concise' | 'detailed';
  topics: string[];
  lastInteractions: string[];
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  context?: string;
}

export interface ConversationContext {
  currentTopic: string;
  relevantTopics: string[];
  userPreferences: UserPreference;
  interactionCount: number;
  lastUpdateTime: number;
}